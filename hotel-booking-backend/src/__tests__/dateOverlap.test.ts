import { hasOverlap } from "../utils/dateOverlap";

describe("hasOverlap (booking rules - overlap prevention)", () => {
  it("returns true when ranges overlap (new booking starts before existing ends)", () => {
    const existingCheckIn = new Date("2025-03-10");
    const existingCheckOut = new Date("2025-03-15");
    const newCheckIn = new Date("2025-03-12");
    const newCheckOut = new Date("2025-03-18");

    expect(hasOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut)).toBe(true);
  });

  it("returns true when ranges overlap (new booking ends after existing starts)", () => {
    const existingCheckIn = new Date("2025-03-12");
    const existingCheckOut = new Date("2025-03-18");
    const newCheckIn = new Date("2025-03-10");
    const newCheckOut = new Date("2025-03-15");

    expect(hasOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut)).toBe(true);
  });

  it("returns false when ranges do not overlap (new booking after existing)", () => {
    const existingCheckIn = new Date("2025-03-10");
    const existingCheckOut = new Date("2025-03-15");
    const newCheckIn = new Date("2025-03-16");
    const newCheckOut = new Date("2025-03-20");

    expect(hasOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut)).toBe(false);
  });

  it("returns false when ranges do not overlap (new booking before existing)", () => {
    const existingCheckIn = new Date("2025-03-16");
    const existingCheckOut = new Date("2025-03-20");
    const newCheckIn = new Date("2025-03-10");
    const newCheckOut = new Date("2025-03-15");

    expect(hasOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut)).toBe(false);
  });

  it("returns false when ranges just touch on same day (no night overlap)", () => {
    const existingCheckIn = new Date("2025-03-10");
    const existingCheckOut = new Date("2025-03-15");
    const newCheckIn = new Date("2025-03-15");
    const newCheckOut = new Date("2025-03-18");

    expect(
      hasOverlap(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut)
    ).toBe(false);
  });
});
