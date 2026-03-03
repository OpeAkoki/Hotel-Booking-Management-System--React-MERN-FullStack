import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import hotelRoutes from "../routes/hotels";
import Booking from "../models/booking";

jest.mock("stripe", () => {
  const retrieve = jest.fn().mockResolvedValue({
    id: "pi_xxx",
    status: "succeeded",
    metadata: { hotelId: "hotel-1", userId: "user-123" },
  });
  const create = jest.fn().mockResolvedValue({
    id: "pi_xxx",
    client_secret: "secret",
  });
  return jest.fn().mockImplementation(() => ({
    paymentIntents: { retrieve, create },
  }));
});

jest.mock("../middleware/auth", () => ({
  __esModule: true,
  default: (req: any, _res: any, next: any) => {
    req.userId = "user-123";
    next();
  },
}));

jest.mock("../models/booking", () => {
  const mockFind = jest.fn();
  const mockSave = jest.fn().mockResolvedValue(undefined);
  function MockBooking() {
    return { save: mockSave };
  }
  (MockBooking as any).find = mockFind;
  return { __esModule: true, default: MockBooking };
});

jest.mock("../models/hotel", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock("../models/user", () => ({
  __esModule: true,
  default: {
    findByIdAndUpdate: jest.fn(),
  },
}));

const createApp = () => {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use("/api/hotels", hotelRoutes);
  return app;
};

describe("Booking overlap enforcement at API level", () => {
  const app = createApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when new booking dates overlap with existing booking", async () => {
    (Booking as any).find.mockResolvedValue([
      {
        checkIn: new Date("2025-03-10"),
        checkOut: new Date("2025-03-15"),
      },
    ]);

    const response = await request(app)
      .post("/api/hotels/hotel-1/bookings")
      .send({
        paymentIntentId: "pi_xxx",
        checkIn: "2025-03-12",
        checkOut: "2025-03-18",
        firstName: "Test",
        lastName: "User",
        email: "test@test.com",
        adultCount: 1,
        childCount: 0,
        totalCost: 357,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Booking dates overlap with an existing booking",
    });
  });
});
