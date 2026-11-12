import { getCategoryLabel } from "./categories";

// Product search shared by the header's live results (SearchModal) and the
// Shop page's ?q= filter, so both agree on what matches and in what order.
// A match in the name outranks one in the category, which outranks a match
// only in the description text (audit V10): "bag" lists bags before a
// product that merely mentions one.
const RANK = { name: 0, category: 1, description: 2 };

const normalize = (value) => String(value ?? "").toLowerCase();

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Description text only counts when the query starts a word: "red" matches
// "red" or "redness" but not "inspired" or "tailored". Names and categories
// keep plain substring matching, so "bag" still finds "Handbag".
const startsAWord = (text, q) =>
  new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(q)}`, "u").test(text);

// The best rank for one product, or null when it doesn't match at all.
function rankMatch(product, q) {
  if (normalize(product.productName).includes(q)) return RANK.name;
  if (
    normalize(product.category).includes(q) ||
    normalize(getCategoryLabel(product.category)).includes(q)
  ) {
    return RANK.category;
  }
  if (startsAWord(normalize(product.description), q)) return RANK.description;
  return null;
}

/**
 * Products matching `query`.
 * @param {Array<object>} products transformed products (apiProducts shape)
 * @param {string} query raw text; blank returns `products` unchanged
 * @param {{ ranked?: boolean }} [options] ranked: order by match strength
 *   (stable within a rank); otherwise keep the incoming order, e.g. a sort
 *   the shopper picked.
 * @returns {Array<object>}
 */
export function searchProducts(products, query, { ranked = true } = {}) {
  const q = normalize(query).trim();
  if (!q) return products;

  const matches = products
    .map((product, index) => ({ product, index, rank: rankMatch(product, q) }))
    .filter((match) => match.rank !== null);

  const ordered = ranked
    ? [...matches].sort((a, b) => a.rank - b.rank || a.index - b.index)
    : matches;
  return ordered.map((match) => match.product);
}
