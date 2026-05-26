import { describe, it, expect } from "vitest";
import {
  buildListBody,
  buildTextOrPriceQuery,
  buildInstrumentAdminFilterQuery,
  buildUsersAdminFilterQuery,
  buildOrdersAdminFilterQuery,
} from "./api-query";

describe("buildListBody", () => {
  it("builds default list request body", () => {
    expect(buildListBody()).toEqual({
      query: {},
      projection: {},
      options: { skip: 0, limit: 0, sort: { createdAt: -1 } },
    });
  });

  it("merges pagination and query", () => {
    const body = buildListBody({
      query: { instrument_title: "guitar" },
      skip: 10,
      limit: 5,
    });
    expect(body.query).toEqual({ instrument_title: "guitar" });
    expect(body.options.skip).toBe(10);
    expect(body.options.limit).toBe(5);
  });
});

describe("buildTextOrPriceQuery", () => {
  it("returns regex query for text search", () => {
    expect(
      buildTextOrPriceQuery("piano", { textField: "title", priceField: "price" })
    ).toEqual({ title: { $regex: "piano", $options: "i" } });
  });

  it("returns numeric price query when search is a number", () => {
    expect(
      buildTextOrPriceQuery("499", { textField: "title", priceField: "price" })
    ).toEqual({ price: 499 });
  });
});

describe("buildInstrumentAdminFilterQuery", () => {
  it("returns empty when inputs are too short or invalid", () => {
    expect(buildInstrumentAdminFilterQuery({ title: "a", price: "" })).toEqual({});
    expect(buildInstrumentAdminFilterQuery({ title: "", price: "abc" })).toEqual({});
  });

  it("escapes regex in title filter", () => {
    expect(
      buildInstrumentAdminFilterQuery({ title: "key+board", price: "" })
    ).toEqual({
      instrument_title: { $regex: "key\\+board", $options: "i" },
    });
  });

  it("uses exact numeric price", () => {
    expect(
      buildInstrumentAdminFilterQuery({ title: "", price: "9000" })
    ).toEqual({ instrument_price: 9000 });
  });

  it("combines title and price in a flat query", () => {
    expect(
      buildInstrumentAdminFilterQuery({ title: "piano", price: "499" })
    ).toEqual({
      instrument_title: { $regex: "piano", $options: "i" },
      instrument_price: 499,
    });
  });
});

describe("buildUsersAdminFilterQuery", () => {
  it("filters by email and first name", () => {
    expect(
      buildUsersAdminFilterQuery({ email: "test@", name: "Ra", phone: "" })
    ).toEqual({
      em: { $regex: "test@", $options: "i" },
      first_name: { $regex: "Ra", $options: "i" },
    });
  });

  it("uses exact phone at 10 digits", () => {
    expect(
      buildUsersAdminFilterQuery({ email: "", name: "", phone: "9876543210" })
    ).toEqual({ phone_number: "9876543210" });
  });
});

describe("buildOrdersAdminFilterQuery", () => {
  it("filters by email, status, and amount", () => {
    expect(
      buildOrdersAdminFilterQuery({
        email: "buyer@mail.com",
        status: "paid",
        amount: "1200",
      })
    ).toEqual({
      userEmail: { $regex: "buyer@mail\\.com", $options: "i" },
      paymentStatus: "paid",
      amount: 1200,
    });
  });

  it("ignores invalid status", () => {
    expect(
      buildOrdersAdminFilterQuery({ email: "", status: "bogus", amount: "" })
    ).toEqual({});
  });
});
