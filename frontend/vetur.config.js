// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
    projects: [
        {
            // Root of the project (where your package.json and tsconfig.json are located)
            root: './',
            // Path to tsconfig.json
            tsconfig: './tsconfig.json',
            // Global components to be registered (optional)
            globalComponents: [
                './src/components/**/*.vue',
            ],
        },
    ],
};
