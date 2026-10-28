import { describe, expect, it } from "vitest";
import { selectContextualEvents } from "./rules";
import type { ContextualEvent } from "./catalog";

const event: ContextualEvent = {
  id: "demo-construction",
  title: "Événement de démonstration bâtiment",
  summary: "Données de test uniquement",
  sectors: ["batiment", "construction", "travaux"],
  regions: ["nantes", "loire-atlantique", "44"],
  startsAt: "2099-03-15",
  endsAt: "2099-03-16",
  locationLabel: "Fictif",
  status: "demo",
};

describe("selectContextualEvents", () => {
  const now = new Date("2026-10-28T08:00:00Z");

  it("matches construction work in department 44", () => {
    expect(selectContextualEvents(
      { keyword: "travaux de construction", location: "44", type: "Travaux" },
      [event], now,
    )).toHaveLength(1);
  });

  it("does not match an unrelated keyword", () => {
    expect(selectContextualEvents(
      { keyword: "informatique", location: "44", type: "all" },
      [event], now,
    )).toHaveLength(0);
  });

  it("does not match another department", () => {
    expect(selectContextualEvents(
      { keyword: "construction", location: "68", type: "Travaux" },
      [event], now,
    )).toHaveLength(0);
  });

  it("does not show expired events", () => {
    expect(selectContextualEvents(
      { keyword: "construction", location: "44", type: "Travaux" },
      [{ ...event, endsAt: "2020-01-01" }], now,
    )).toHaveLength(0);
  });
});
