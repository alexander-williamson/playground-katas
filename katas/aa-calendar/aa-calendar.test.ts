import { describe, expect, it } from "bun:test";
import {
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  eachWeekOfInterval,
  endOfYear,
  getDate,
  getMonth,
  isSameDay,
  isSaturday,
  nextSaturday,
  startOfMonth,
} from "date-fns";

const SATURDAY = 6;

function saturdayCalculator(year: number): Date[] {
  const firstDayOfYear = new Date(`${year}-01-01`);
  const firstSaturday = isSaturday(firstDayOfYear) ? firstDayOfYear : nextSaturday(firstDayOfYear);

  return eachWeekOfInterval({ start: firstSaturday, end: endOfYear(firstSaturday) }, { weekStartsOn: SATURDAY });
}

function isFirstSaturdayOfMonth(input: Date): boolean {
  return isSaturday(input) && getDate(input) <= 7;
}

type MeetingCalendarItem = { date: Date; type: string };

function meetingCalculator(dates: Date[]): MeetingCalendarItem[] {
  if (dates.length === 0) {
    throw new Error("No dates provided");
  }

  return dates.map(mapToMeeting);
}

function mapToMeeting(date: Date): MeetingCalendarItem {
  if (isFirstSaturdayOfMonth(date)) {
    return {
      date,
      type: `tradition-${getMonth(date) + 1}`,
    };
  }

  const knownStep11 = new Date("2025-12-27");
  const knownStep11ZeroOffset = 10;

  const diffWeeksSinceKnown = differenceInCalendarWeeks(date, knownStep11);
  const diffMonthsSinceKnown = differenceInCalendarMonths(date, knownStep11);
  const newMod = knownStep11ZeroOffset + diffWeeksSinceKnown - diffMonthsSinceKnown;
  const step = `step-${(newMod % 12) + 1}`;

  return {
    date,
    type: step,
  };
}

describe("saturdayCalculator", () => {
  const result = saturdayCalculator(2026);

  it("returns the correct first Saturday", () => {
    expect(result[0]).toEqual(new Date("2026-01-03"));
  });

  it("returns the correct last Saturday", () => {
    expect(result[result.length - 1]).toEqual(new Date("2026-12-26"));
  });
});

describe("isFirstSaturdayOfMonth", () => {
  it("returns true if the day is the first Saturday of the month", () => {
    expect(isFirstSaturdayOfMonth(new Date("2026-02-07"))).toEqual(true);
    expect(isFirstSaturdayOfMonth(new Date("2026-08-01"))).toEqual(true);
  });

  it("returns false if the day is not the first Saturday of the month", () => {
    expect(isFirstSaturdayOfMonth(new Date("2026-02-06"))).toEqual(false);
    expect(isFirstSaturdayOfMonth(new Date("2026-02-14"))).toEqual(false);
  });
});

describe("meetingCalculator", () => {
  describe("2026", () => {
    const result = meetingCalculator(saturdayCalculator(2026));

    it("calculates January correctly", () => {
      expect(result[0]).toEqual({
        date: new Date("2026-01-03"),
        type: "tradition-1",
      });
      expect(result[1]).toEqual({
        date: new Date("2026-01-10"),
        type: "step-12",
      });
      expect(result[2]).toEqual({
        date: new Date("2026-01-17"),
        type: "step-1",
      });
      expect(result[3]).toEqual({
        date: new Date("2026-01-24"),
        type: "step-2",
      });
      expect(result[4]).toEqual({
        date: new Date("2026-01-31"),
        type: "step-3",
      });
    });

    it("calculates February correctly", () => {
      expect(result[5]).toEqual({
        date: new Date("2026-02-07"),
        type: "tradition-2",
      });
      expect(result[6]).toEqual({
        date: new Date("2026-02-14"),
        type: "step-4",
      });
      expect(result[7]).toEqual({
        date: new Date("2026-02-21"),
        type: "step-5",
      });
      expect(result[8]).toEqual({
        date: new Date("2026-02-28"),
        type: "step-6",
      });
    });
  });
});
