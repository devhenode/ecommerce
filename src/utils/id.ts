let counter = 0;

export function generateId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}

export function generateOrderNumber(): string {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `HN-${n}`;
}

export function generatePaymentReference(): string {
  const n = Math.floor(1000 + Math.random() * 8999);
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `HN-${n}-${suffix}`;
}
