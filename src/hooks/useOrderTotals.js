const useOrderTotals = (subtotal, isExpressShipping) => {
  const base = 15;
  const express = 25;

  const shippingCost = base;
  const expressCost = express;

  const tax = subtotal * 0.08;

  const finalTotal = subtotal + base + tax + (isExpressShipping ? express : 0);

  return {
    shippingCost,
    expressCost,
    tax,
    finalTotal,
  };
};

export default useOrderTotals;
