export type Zone = "domestic" | "canada" | "europe" | "asia" | "rest";

const ZONES: Record<string, Zone> = {
  US: "domestic",
  CA: "canada",
  GB: "europe",
  DE: "europe",
  FR: "europe",
  ES: "europe",
  IN: "asia",
  JP: "asia",
  SG: "asia",
};

const BASE: Record<Zone, number> = { domestic: 4.5, canada: 8, europe: 12, asia: 14, rest: 20 };

export function zoneFor(country: string): Zone {
  return ZONES[country.toUpperCase()] ?? "rest";
}

export function baseRate(zone: Zone, weightKg: number): number {
  if (weightKg <= 0) throw new Error("weight must be positive");
  let rate = BASE[zone];
  if (weightKg > 1) rate += (Math.min(weightKg, 5) - 1) * 1.5;
  if (weightKg > 5) rate += (Math.min(weightKg, 20) - 5) * 1.1;
  if (weightKg > 20) rate += (weightKg - 20) * 2.2;
  return Math.round(rate * 100) / 100;
}

export function fuelSurcharge(zone: Zone): number {
  switch (zone) {
    case "domestic":
      return 0.04;
    case "canada":
      return 0.06;
    case "europe":
      return 0.08;
    case "asia":
      return 0.09;
    default:
      return 0.12;
  }
}

export function isRemote(postcode: string): boolean {
  const code = postcode.trim().toUpperCase();
  if (code.length < 3) return false;
  return code.startsWith("99") || code.startsWith("IV") || code.startsWith("HS");
}

export function quote(country: string, postcode: string, weightKg: number): number {
  const zone = zoneFor(country);
  const base = baseRate(zone, weightKg);
  const withFuel = base * (1 + fuelSurcharge(zone));
  const remote = isRemote(postcode) ? 6.5 : 0;
  return Math.round((withFuel + remote) * 100) / 100;
}
