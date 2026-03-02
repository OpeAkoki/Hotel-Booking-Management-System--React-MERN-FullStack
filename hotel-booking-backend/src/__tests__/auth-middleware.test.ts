import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

describe("verifyToken middleware", () => {
  const mockRequest = (headers: any = {}, cookies: any = {}) =>
    ({
      headers,
      cookies,
    } as unknown as Request);

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = () => jest.fn() as NextFunction;

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, JWT_SECRET_KEY: "test-secret" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("returns 401 when no token is provided", () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("sets req.userId and calls next when token is valid", () => {
    const fakePayload = { userId: "user123" };
    const token = jwt.sign(fakePayload, "test-secret");

    const req = mockRequest({ authorization: `Bearer ${token}` });
    const res = mockResponse();
    const next = mockNext();

    verifyToken(req, res, next);

    expect((req as any).userId).toBe("user123");
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

