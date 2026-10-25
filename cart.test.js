import {
  applyTaxToItems,
  validateInventory,
  calculateSubtotal,
  sortItemsByPrice,
  processOrder,
  fetchCouponDiscount,
} from './cart.js';

describe('Task 1: ES6+ Modernization & Cart Suite', () => {
  const sampleItems = [
    { id: 'item-1', name: 'Keyboard', price: 50, quantity: 2 },
    { id: 'item-2', name: 'Mouse', price: 25, quantity: 1 },
  ];

  const sampleStock = {
    'item-1': 10,
    'item-2': 5,
  };

  test('applyTaxToItems correctly calculates tax and does not mutate source', () => {
    const originalSnapshot = JSON.stringify(sampleItems);
    const taxed = applyTaxToItems(sampleItems, 0.1);

    expect(taxed[0].priceWithTax).toBe(55);
    expect(taxed[1].priceWithTax).toBe(27.5);
    expect(JSON.stringify(sampleItems)).toBe(originalSnapshot);
  });

  test('calculateSubtotal accurately reduces total cost', () => {
    const subtotal = calculateSubtotal(sampleItems);
    expect(subtotal).toBe(125);
  });

  test('sortItemsByPrice sorts correctly without mutating the original array', () => {
    const sorted = sortItemsByPrice(sampleItems, 'asc');
    expect(sorted[0].price).toBe(25);
    expect(sorted[1].price).toBe(50);
    expect(sampleItems[0].price).toBe(50);
  });

  test('validateInventory detects out of stock items', () => {
    const tightStock = { 'item-1': 1, 'item-2': 5 };
    const result = validateInventory(sampleItems, tightStock);

    expect(result.isValid).toBe(false);
    expect(result.issues.length).toBe(1);
  });

  test('fetchCouponDiscount resolves async promise correctly', async () => {
    const discount = await fetchCouponDiscount('SAVE10');
    expect(discount).toBe(0.1);
  });

  test('processOrder successfully processes order immutably with async discount', async () => {
    const order = {
      orderId: 'ORD-101',
      items: sampleItems,
      taxRate: 0.1,
    };

    const processed = await processOrder(order, sampleStock, 'SAVE10');

    expect(processed.subtotal).toBe(125);
    expect(processed.discount).toBe(12.5);
    expect(processed.total).toBe(123.75);
    expect(processed.status).toBe('PROCESSED');
    expect(order.status).toBeUndefined(); // Source immutability verify
  });
});