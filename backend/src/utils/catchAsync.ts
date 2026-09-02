import { NextFunction, Request, Response } from "express";

type AsyncRequestHandler<TRequest extends Request = Request> = (
    req: TRequest,
    res: Response,
    next: NextFunction
) => Promise<unknown>;

export const catchAsync = <TRequest extends Request>(
    fn: AsyncRequestHandler<TRequest>
) => {
    return (req: TRequest, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
