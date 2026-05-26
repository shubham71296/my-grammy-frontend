export const buildListBody = ({
  query = {},
  projection = {},
  skip = 0,
  limit = 0,
  sort = { createdAt: -1 },
} = {}) => ({
  query,
  projection,
  options: { skip, limit, sort },
});

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildTextOrPriceQuery = (search, { textField, priceField }) => {
  const q = String(search ?? "").trim();
  if (!q) return {};
  if (!Number.isNaN(Number(q)) && q !== "") {
    return { [priceField]: Number(q) };
  }
  return { [textField]: { $regex: escapeRegex(q), $options: "i" } };
};

export const filterTextMinLen = 2;
/** @deprecated use filterTextMinLen */
export const instrumentFilterTitleMinLen = filterTextMinLen;

const textRegex = (value) => ({
  $regex: escapeRegex(value),
  $options: "i",
});

const mergeFilterClauses = (clauses) =>
  clauses.reduce((acc, part) => ({ ...acc, ...part }), {});

/**
 * Admin instruments list — escaped title regex, exact numeric price (flat query for sanitizer).
 */
export const buildInstrumentAdminFilterQuery = ({ title = "", price = "" } = {}) => {
  const clauses = [];
  const t = String(title ?? "").trim();
  const p = String(price ?? "").trim();

  if (t.length >= filterTextMinLen) {
    clauses.push({ instrument_title: textRegex(t) });
  }
  if (p !== "" && !Number.isNaN(Number(p))) {
    clauses.push({ instrument_price: Number(p) });
  }
  return mergeFilterClauses(clauses);
};

/**
 * Admin users list — email, first name, phone (partial or exact at 10 digits).
 */
export const buildUsersAdminFilterQuery = ({ email = "", name = "", phone = "" } = {}) => {
  const clauses = [];
  const em = String(email ?? "").trim();
  const n = String(name ?? "").trim();
  const ph = String(phone ?? "").trim();

  if (em.length >= filterTextMinLen) {
    clauses.push({ em: textRegex(em) });
  }
  if (n.length >= filterTextMinLen) {
    clauses.push({ first_name: textRegex(n) });
  }
  if (ph.length === 10 && /^[0-9]+$/.test(ph)) {
    clauses.push({ phone_number: ph });
  } else if (ph.length >= 3) {
    clauses.push({ phone_number: textRegex(ph) });
  }
  return mergeFilterClauses(clauses);
};

const ORDER_STATUSES = ["pending", "paid", "cancelled", "failed"];

/**
 * Admin orders list — customer email, payment status, exact amount.
 */
export const buildOrdersAdminFilterQuery = ({ email = "", status = "", amount = "" } = {}) => {
  const clauses = [];
  const em = String(email ?? "").trim();
  const st = String(status ?? "").trim().toLowerCase();
  const am = String(amount ?? "").trim();

  if (em.length >= filterTextMinLen) {
    clauses.push({ userEmail: textRegex(em) });
  }
  if (st && ORDER_STATUSES.includes(st)) {
    clauses.push({ paymentStatus: st });
  }
  if (am !== "" && !Number.isNaN(Number(am))) {
    clauses.push({ amount: Number(am) });
  }
  return mergeFilterClauses(clauses);
};

export { ORDER_STATUSES as orderPaymentStatuses };
