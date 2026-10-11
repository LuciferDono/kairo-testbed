/** Live USD exchange rate from the rates provider. */
export async function usdTo(currency: string): Promise<number> {
  const res = await fetch(`https://rates.invalid/v1/usd/${currency.toLowerCase()}`);
  if (!res.ok) throw new Error(`rates api returned ${res.status}`);
  const body = (await res.json()) as { rate: number };
  return body.rate;
}
