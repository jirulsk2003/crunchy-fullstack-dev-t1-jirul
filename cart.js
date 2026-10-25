/**
 * Modernized ES6+ E-Commerce Cart & Pricing Engine
 */

// Simulated async database call to get coupon discounts
export const fetchCouponDiscount = async (code) => {
  return new Promise((resolve, reject) => {
    if (!code) {
      return reject(new Error('Invalid coupon code'));
    }
    setTimeout(() => {
      const coupons = {
        SAVE10: 0.1,
        FESTIVE20: 0.2,
      };
      resolve(coupons[code] ?? 0);
    }, 50);
  });
};

// 1. Immutable array processing using .map()
export const applyTaxToItems = (items, taxRate = 0.05) => {
  return items.map((item) => ({
    ...item,
    priceWithTax: Number((item.price * (1 + taxRate)).toFixed(2)),
  }));
};

// 2. Kept-loop justification: A clean for..of loop is maintained here
// instead of a complex .reduce() with nested branches to ensure early return
// and clear readability when handling inventory alerts and sequential logic.
export const validateInventory = (items, stockMap) => {
  const issues = [];
  for (const item of items) {
    const stockAvailable = stockMap[item.id] ?? 0;
    if (stockAvailable < item.quantity) {
      issues.push(`Insufficient stock for item ${item.name || item.id}`);
    }
  }
  return {
    isValid: issues.length === 0,
    issues,
  };
};

// 3. Array reduction for aggregating totals
export const calculateSubtotal = (items) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

// 4. Immutable sorting using toSorted() or shallow spread
export const sortItemsByPrice = (items, order = 'asc') => {
  return items.toSorted((a, b) =>
    order === 'asc' ? a.price - b.price : b.price - a.price
  );
};

// 5. Complete order processing using async/await and non-mutating updates
export const processOrder = async (order, stockMap, couponCode = null) => {
  if (!order || !order.items || order.items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // Deep clone to ensure immutability
  const orderCopy = structuredClone(order);

  // Validate stock
  const stockValidation = validateInventory(orderCopy.items, stockMap);
  if (!stockValidation.isValid) {
    throw new Error(stockValidation.issues.join(', '));
  }

  // Calculate pricing
  const subtotal = calculateSubtotal(orderCopy.items);
  let discountRate = 0;

  if (couponCode) {
    try {
      discountRate = await fetchCouponDiscount(couponCode);
    } catch {
      discountRate = 0;
    }
  }

  const discountAmount = subtotal * discountRate;
  const totalAfterDiscount = subtotal - discountAmount;
  const taxRate = orderCopy.taxRate ?? 0.08;
  const finalTotal = Number((totalAfterDiscount * (1 + taxRate)).toFixed(2));

  return {
    ...orderCopy,
    subtotal,
    discount: discountAmount,
    total: finalTotal,
    status: 'PROCESSED',
  };
};