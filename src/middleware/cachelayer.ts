import type { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

interface CacheOptions {
    key: string;
    ttl?: number; 
    tags?: string[];
}

export const cache = (options: CacheOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cacheKey = `cache:${options.key}:${JSON.stringify(req.query)}`;

            const cached = await redis.get(cacheKey);
            if (cached) {
                 res.json(JSON.parse(cached));
                 return;
            }

            const originalJson = res.json;

            res.json = function (data: any) {
                const ttl = options.ttl || 300; 
                redis.setex(cacheKey, ttl, JSON.stringify(data));

                if (options.tags) {
                    options.tags.forEach(tag => {
                        redis.sadd(`tag:${tag}`, cacheKey);
                    });
                }

                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

export const purgeCache = (tags: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const originalJson = res.json;
        const originalSend = res.send;

        const purgeAfterResponse = async (data: any) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    for (const tag of tags) {
                        const keys = await redis.smembers(`tag:${tag}`);
                        if (keys.length > 0) {
                            await redis.del(...keys);
                            await redis.del(`tag:${tag}`);
                        }
                    }
                } catch (error) {
                    console.error('Cache purge error:', error);
                }
            }
            return data;
        };

        res.json = function (data: any) {
            purgeAfterResponse(data);
            return originalJson.call(this, data);
        };

        res.send = function (data: any) {
            purgeAfterResponse(data);
            return originalSend.call(this, data);
        };

        next();
    };
};
