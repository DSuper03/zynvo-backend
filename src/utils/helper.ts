import { Response } from 'express';


const generateRequestId = (): string => Math.random().toString(36).substring(7);

const sendErrorResponse = (res: Response, requestId: string, message: string, statusCode: number = 500, error?: any) => {
    res.status(statusCode).json({
        msg: message,
        requestId,
        ...(process.env.NODE_ENV === 'development' && error && { error: error.message })
    });
};

const generateUUID = (): string => {
    return 'Zynvo xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
};

export { generateRequestId, sendErrorResponse, generateUUID };