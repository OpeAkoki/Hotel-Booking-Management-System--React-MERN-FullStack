import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import hotelRoutes from "../routes/hotels";
import Hotel from "../models/hotel";
import Stripe from "stripe";

jest.mock("stripe", () => {
  const mockCreate = jest.fn().mockResolvedValue({
    id: "pi_xxx",
    client_secret: "secret",
  });

  const Mock = jest.fn().mockImplementation(() => ({
    paymentIntents: { create: mockCreate },
  }));

  (Mock as any).__mockCreate = mockCreate;

  return {
    __esModule: true,
    default: Mock,
  };
});

jest.mock("../middleware/auth", () => ({
  __esModule: true,
  default: (req: any, _res: any, next: any) => {
    req.userId = "user-123";
    next();
  },
}));

jest.mock("../models/hotel", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
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

describe("Payment intent amount calculation", () => {
  const app = createApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calculates total cost based on price per night and number of nights", async () => {
    (Hotel as any).findById.mockResolvedValue({
      _id: "hotel-1",
      pricePerNight: 119,
    });

    const response = await request(app)
      .post("/api/hotels/hotel-1/bookings/payment-intent")
      .send({ numberOfNights: 3 });

    expect(response.status).toBe(200);
    expect(response.body.totalCost).toBe(119 * 3);
    expect((Stripe as any).__mockCreate).toHaveBeenCalledWith({
      amount: 119 * 3 * 100,
      currency: "gbp",
      metadata: {
        hotelId: "hotel-1",
        userId: "user-123",
      },
    });
  });
});

