/** Live USD exchange rate from the rates provider. */
export async function usdTo(currency: string): Promise<number> {
  const target = currency.toUpperCase();
  const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${target}`);
  if (!res.ok) throw new Error(`rates api returned ${res.status}`);
  const body = (await res.json()) as { rates: Record<string, number> };
  return body.rates[target];
}