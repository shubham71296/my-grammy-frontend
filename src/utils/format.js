export const formatCurrency = (amount, currency = "INR") => {
  const value = Number(amount);
  if (Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};
