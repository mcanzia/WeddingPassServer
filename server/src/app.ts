import 'reflect-metadata';
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './routes/index';
import Logger from './util/logs/logger';
import { CustomError } from './util/error/CustomError';
import { ErrorHandler } from './util/error/ErrorHandler';
import { AuthServiceImpl } from './services/AuthService';
import path from 'path';

const port: number = Number(process.env.VITE_PORT) || 7500;
const app: Express = express();

// Compression
app.use(compression());

// Security
app.set('trust proxy', 1);
app.use(cors());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200 // limit each IP to 100 requests per 15 minutes
});
app.use(limiter);

// User Authorization
app.use(async (request : Request, response : Response, next : NextFunction) => {
  try {
    const userDetails = await AuthServiceImpl.validateAuthToken(request.headers.authorization)
    response.locals.userAuth = userDetails.uid;
    response.locals.userRole = userDetails.role;
    next();
  } catch(error) {
    Logger.error("Authorization attempt failed");
    return response.status(403).json({ error: 'User is not authorized to perform this action' });
  }
});

//SSR
app.use(express.static(path.join(__dirname, '../public')));

//Routes Definitions
app.use('/api', routes);

//Error Handling
app.use((error : CustomError, request : Request, response : Response, next : NextFunction) => {
  ErrorHandler.handleError(error, response);
});

app.listen(port, () => {
  Logger.info(`Server is running on port ${port}`);

});
