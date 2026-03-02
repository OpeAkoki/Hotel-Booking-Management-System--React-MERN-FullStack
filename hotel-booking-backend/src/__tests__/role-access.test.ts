import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import myBookingsRouter from "../routes/my-bookings";
import myHotelsRouter from "../routes/my-hotels";

const createApp = () => {
  const app = express();
  app.use(cookieParser());
  app.use("/api/my-bookings", myBookingsRouter);
  app.use("/api/my-hotels", myHotelsRouter);
  return app;
};

describe("Role-based access control for user-specific routes", () => {
  const app = createApp();

  it("returns 401 for GET /api/my-bookings when no token is provided", async () => {
    const response = await request(app).get("/api/my-bookings");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "unauthorized" });
  });

  it("returns 401 for GET /api/my-hotels when no token is provided", async () => {
    const response = await request(app).get("/api/my-hotels");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "unauthorized" });
  });
});

