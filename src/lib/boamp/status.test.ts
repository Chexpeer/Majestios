import { describe, expect, it } from "vitest";
import { isOpenBoampNotice } from "./status";

describe("isOpenBoampNotice", () => {
  const now = new Date("2026-10-28T10:00:00Z").getTime();

  it("marks a market notice with a future deadline as open", () => {
    expect(isOpenBoampNotice({
      nature: "Avis de marché",
      status: "INITIAL",
      deadline: "2026-11-20T12:00:00+01:00",
      now,
    })).toBe(true);
  });

  it("does not treat award/result notices as open consultations", () => {
    expect(isOpenBoampNotice({
      nature: "Avis d'attribution",
      status: "INITIAL",
      deadline: "2026-11-20T12:00:00+01:00",
      now,
    })).toBe(false);
  });

  it.each(["ANNULATION", "ANNULE", "SUPPRIME", "SANS SUITE"])(
    "rejects cancelled status %s",
    (status) => {
      expect(isOpenBoampNotice({
        nature: "Avis de marché",
        status,
        deadline: "2026-11-20T12:00:00+01:00",
        now,
      })).toBe(false);
    },
  );

  it("rejects missing, invalid, or expired deadlines", () => {
    for (const deadline of ["", "not-a-date", "2020-01-01"]) {
      expect(isOpenBoampNotice({
        nature: "Avis de marché",
        status: "INITIAL",
        deadline,
        now,
      })).toBe(false);
    }
  });
});
