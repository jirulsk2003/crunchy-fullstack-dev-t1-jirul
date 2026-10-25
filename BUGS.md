# BUGS.md - Task 1 Modernization Report

### Bug 1: Callback Scope / Var Hoisting Issue
* **Location:** Legacy coupon fetching utility.
* **What was wrong:** Used `var` within asynchronous callback loops, causing reference retention errors and race conditions.
* **Fix:** Converted to native `Promise` and handled via `async/await`.

### Bug 2: Array In-Place Mutation
* **Location:** `sortItemsByPrice`
* **What was wrong:** Used `Array.prototype.sort()` directly on the incoming argument array, mutating caller data and creating side-effects.
* **Fix:** Upgraded to `array.toSorted()` / spread clone `[...items].sort()` to preserve immutability.

### Bug 3: Object Reference Mutation
* **Location:** `processOrder`
* **What was wrong:** Properties (`status`, `total`) were added directly to the passed `order` object.
* **Fix:** Used `structuredClone()` to create an isolated deep clone before calculating totals.

### Bug 4: Incorrect Falsy Guard for Zero/Values
* **Location:** `validateInventory` stock resolution.
* **What was wrong:** Evaluated `stockMap[item.id] || 0`, which caused edge cases when stock was defined as falsy conditions.
* **Fix:** Replaced with nullish coalescing operator `?? 0`.

---

### Kept Loop Justification (Requirement #4)
* **Location:** `validateInventory()`
* **Reason:** Kept a clean `for..of` loop instead of forcing `reduce()`. The loop provides immediate line-by-line readability, early warning accumulation, and avoids nested ternary logic inside accumulator states.