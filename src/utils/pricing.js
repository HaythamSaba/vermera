// Single source of truth for every price shown or computed in the store:
// currency formatting, shipping, the free-delivery threshold, and tax.
// Components and route actions must go through this module rather than
// hard-coding amounts or calling toFixed() themselves, so checkout, the
// saved order, the confirmation page, and the profile can never disagree.

export const CURRENCY = "EUR";
export const LOCALE = "en-IE";

export const STANDARD_SHIPPING = 15;
// Express is a surcharge on top of standard delivery (shown as "+€25"),
// so an express order pays €40 below the threshold and €25 above it.
export const EXPRESS_SURCHARGE = 25;
// Orders whose merchandise subtotal reaches this amount get standard
// delivery free. The express surcharge still applies.
export const FREE_SHIPPING_THRESHOLD = 500;
export const TAX_RATE = 0.08;

const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
});

// For marketing copy like "over €500", where cents would read as noise.
const wholePriceFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

export function formatPrice(amount, { wholeUnits = false } = {}) {
  const value = Number(amount) || 0;
  return (wholeUnits ? wholePriceFormatter : priceFormatter).format(value);
}

const roundToCents = (value) => Math.round(value * 100) / 100;

export function qualifiesForFreeShipping(subtotal) {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}

// subtotal: merchandise total before shipping and tax.
export function computeOrderTotals(subtotal, { express = false } = {}) {
  const isFreeStandardShipping = qualifiesForFreeShipping(subtotal);
  const standardShipping = isFreeStandardShipping ? 0 : STANDARD_SHIPPING;
  const expressSurcharge = express ? EXPRESS_SURCHARGE : 0;
  const shipping = standardShipping + expressSurcharge;
  const tax = roundToCents(subtotal * TAX_RATE);
  const total = roundToCents(subtotal + shipping + tax);

  return {
    subtotal: roundToCents(subtotal),
    standardShipping,
    expressSurcharge,
    shipping,
    tax,
    total,
    isFreeStandardShipping,
  };
}

// Sum of an order's or cart's line totals.
export function getSubtotal(items) {
  return roundToCents(
    items.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0),
  );
}
