import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import bookingsRouter from "../routes/bookings";
import Hotel from "../models/hotel";

jest.mock("../middleware/auth", () => ({
  __esModule: true,
  default: (req: any, _res: any, next: any) => {
    req.userId = "user-123";
    next();
  },
}));

jest.mock("../models/booking", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock("../models/hotel", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

const createApp = () => {
  const app = express();
  app.use(cookieParser());
  app.use("/api/bookings", bookingsRouter);
  return app;
};

describe("Bookings route access control", () => {
  const app = createApp();
  const mockedHotel = Hotel as any;

  it("returns 403 when authenticated user is not the hotel owner", async () => {
    mockedHotel.findById.mockResolvedValue({
      _id: "hotel-1",
      userId: "another-owner",
    });

    const response = await request(app).get("/api/bookings/hotel/hotel-1");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Access denied" });
  });
});

