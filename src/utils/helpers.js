// Chhote reusable helper functions

// Date ko "12 Jun 2026" jaise format mein
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Price ko "Rs.1,500" format mein
export function formatPrice(amount) {
  if (!amount) return "Rs.0";
  return "Rs." + Number(amount).toLocaleString("en-PK");
}

// Lamba text chhota karna (cards ke liye)
export function truncate(text, length = 80) {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
}