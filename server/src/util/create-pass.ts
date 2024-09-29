import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import archiver from 'archiver';
import { execFile } from 'child_process';
import util from 'util';
import { Guest } from '../models/Guest';

// Promisify execFile for async/await usage
const execFileAsync = util.promisify(execFile);

/**
 * Create the manifest.json by hashing all files in the pass directory.
 * @param {string} passDirectory - Path to the pass directory.
 * @param {string} manifestPath - Path where the manifest.json will be saved.
 */
async function createManifest(passDirectory: string, manifestPath: string) {
    const manifest: any = {};

    const files = await fs.readdir(passDirectory, { withFileTypes: true });

    // Recursive function to traverse directories
    async function traverseDirectory(currentPath: string) {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const entryPath = path.join(currentPath, entry.name);
            const relativePath = path.relative(passDirectory, entryPath).replace(/\\/g, '/');

            if (entry.isDirectory()) {
                await traverseDirectory(entryPath);
            } else if (
                entry.isFile() &&
                entry.name !== 'manifest.json' &&
                entry.name !== 'signature' &&
                !entry.name.endsWith('.pem') && // Exclude certificate files if present
                !entry.name.endsWith('.key')    // Exclude key files if present
            ) {
                const fileBuffer = await fs.readFile(entryPath);
                const hash = crypto.createHash('sha1').update(fileBuffer).digest('hex');
                manifest[relativePath] = hash;
            }
        }
    }

    await traverseDirectory(passDirectory);

    // Write manifest.json
    await fs.writeJson(manifestPath, manifest, { spaces: 4 });
    console.log(`manifest.json created at: ${manifestPath}`);
}

/**
 * Create a PKCS #7 detached signature for the manifest.
 * @param {string} manifestPath - Path to the manifest.json file.
 * @param {string} certPath - Path to the certificate PEM file.
 * @param {string} keyPath - Path to the private key PEM file.
 * @param {string} outputSignaturePath - Path where the signature file will be saved.
 */
async function createPkcs7Signature(manifestPath: string, certPath: string, keyPath: string, outputSignaturePath: string) {
    try {
        await execFileAsync('openssl', [
            'smime',
            '-sign',
            '-signer',
            certPath,
            '-inkey',
            keyPath,
            '-in',
            manifestPath,
            '-out',
            outputSignaturePath,
            '-outform',
            'DER',
            '-binary',
            '-nodetach'
        ]);

        console.log(`Signature created at: ${outputSignaturePath}`);
    } catch (error) {
        console.error('Error creating PKCS #7 signature:', error);
        throw error;
    }
}

/**
 * Zip the pass directory and save it as a .pkpass file.
 * @param {string} passDirectory - Path to the pass directory.
 * @param {string} outputPkpassPath - Path where the .pkpass file will be saved.
 */
async function createPkpass(passDirectory: string, outputPkpassPath: string) {
    return new Promise<void>((resolve, reject) => {
        const output = fs.createWriteStream(outputPkpassPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });

        output.on('close', () => {
            console.log(`.pkpass file created at: ${outputPkpassPath} (${archive.pointer()} total bytes)`);
            resolve();
        });

        archive.on('error', (err) => {
            console.error('Error creating .pkpass file:', err);
            reject(err);
        });

        archive.pipe(output);

        // Append all files in the pass directory
        archive.directory(passDirectory, false);

        archive.finalize();
    });
}

async function createGuestSpecificPass(guestData: Guest): Promise<Buffer | undefined> {
    // Load environment variables
    const certPath = process.env.CERT_PATH;
    const keyPath = process.env.KEY_PATH;
    const passDirectory = process.env.PASS_DIRECTORY;
    const outputPkpassPath = process.env.OUTPUT_PKPASS_PATH;

    if (!certPath || !keyPath || !passDirectory || !outputPkpassPath) {
        throw new Error('One or more environment variables are missing.');
    }

    try {
        const passJsonPath = path.join(passDirectory, 'pass.json');
        const passJson = await fs.readJson(passJsonPath);

        passJson.serialNumber = guestData.serialNumber;
        passJson.boardingPass.secondaryFields = [
            {
                "key": "passenger-name",
                "label": "passenger_name",
                "value": guestData.name
            }
        ];

        await fs.writeJson(passJsonPath, passJson, { spaces: 4 });
        console.log('pass.json updated with user data.');

        // Paths to manifest.json and signature files
        const manifestPath = path.join(passDirectory, 'manifest.json');
        const signaturePath = path.join(passDirectory, 'signature');

        // Create the manifest.json file
        await createManifest(passDirectory, manifestPath);

        // Create the PKCS #7 detached signature
        await createPkcs7Signature(manifestPath, certPath, keyPath, signaturePath);

        // Create the .pkpass file
        await createPkpass(passDirectory, outputPkpassPath);

        const passBuffer = await fs.readFile(outputPkpassPath);

        return passBuffer;
    } catch (error) {
        console.error('Error generating guest specific pass', error);
    }

}

/**
 * Main function to create the .pkpass file.
 */
async function main() {
    try {
        // Load environment variables
        const certPath = process.env.CERT_PATH;
        const keyPath = process.env.KEY_PATH;
        const passDirectory = process.env.PASS_DIRECTORY;
        const outputPkpassPath = process.env.OUTPUT_PKPASS_PATH;

        if (!certPath || !keyPath || !passDirectory || !outputPkpassPath) {
            throw new Error('One or more environment variables are missing.');
        }

        // Paths to manifest.json and signature files
        const manifestPath = path.join(passDirectory, 'manifest.json');
        const signaturePath = path.join(passDirectory, 'signature');

        // Create the manifest.json file
        await createManifest(passDirectory, manifestPath);

        // Create the PKCS #7 detached signature
        await createPkcs7Signature(manifestPath, certPath, keyPath, signaturePath);

        // Create the .pkpass file
        await createPkpass(passDirectory, outputPkpassPath);
    } catch (error) {
        console.error('Error creating .pkpass file:', error);
        process.exit(1);
    }
}

// Execute the main function
// main();

export {createGuestSpecificPass};
