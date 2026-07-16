import { Response } from 'express';
import { randomUUID } from 'crypto';


const generateRequestId = (): string => randomUUID();

const sendErrorResponse = (res: Response, requestId: string, message: string, statusCode: number = 500, error?: any) => {
    res.status(statusCode).json({
        msg: message,
        requestId,
        ...(process.env.NODE_ENV === 'development' && error && { error: error.message })
    });
};

const generateUUID = (): string => {
    // Cryptographically-secure, unguessable pass IDs (was Math.random-based).
    return `Zynvo ${randomUUID()}`;
};

export { generateRequestId, sendErrorResponse, generateUUID };