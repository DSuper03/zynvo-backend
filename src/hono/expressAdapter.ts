import type { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import type { Env, Hono } from 'hono';
import { HONO_NOT_FOUND_HEADER } from './app';

type ExpressMiddleware = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => Promise<void> | void;

const isBodylessMethod = (method: string) =>
  method.toUpperCase() === 'GET' || method.toUpperCase() === 'HEAD';

const buildHeaders = (req: ExpressRequest) => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'undefined') continue;
    if (Array.isArray(value)) {
      for (const entry of value) {
        headers.append(key, entry);
      }
      continue;
    }
    headers.set(key, value);
  }
  return headers;
};

const buildBody = (req: ExpressRequest, headers: Headers) => {
  if (isBodylessMethod(req.method)) return undefined;
  if (req.body === undefined || req.body === null) return undefined;

  if (typeof req.body === 'string') {
    return req.body;
  }

  const toArrayBuffer = (view: ArrayBufferView): ArrayBuffer => {
    const uint8 =
      view instanceof Uint8Array
        ? view
        : new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    const copy = new Uint8Array(uint8.byteLength);
    copy.set(uint8);
    return copy.buffer;
  };

  if (Buffer.isBuffer(req.body)) {
    return toArrayBuffer(req.body);
  }

  if (req.body instanceof Uint8Array) {
    return toArrayBuffer(req.body);
  }

  if (!headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }
  return JSON.stringify(req.body);
};

export const createHonoExpressMiddleware = <E extends Env = Env>(
  app: Hono<E>
): ExpressMiddleware => {
  return async (req, res, next) => {
    try {
      const host = req.get('host') ?? 'localhost';
      const baseUrl = `${req.protocol}://${host}`;
      const requestUrl = new URL(req.url || req.originalUrl || '/', baseUrl);

      const headers = buildHeaders(req);
      const body = buildBody(req, headers);

      const response = await app.fetch(
        new Request(requestUrl, {
          method: req.method,
          headers,
          body,
        })
      );

      if (response.headers.get(HONO_NOT_FOUND_HEADER) === '1') {
        return next();
      }

      res.status(response.status);
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === HONO_NOT_FOUND_HEADER) return;
        res.setHeader(key, value);
      });

      if (req.method.toUpperCase() === 'HEAD' || response.status === 204) {
        res.end();
        return;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      res.end(buffer);
    } catch (error) {
      next(error);
    }
  };
};
