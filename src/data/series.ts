/** Time series and aggregates for the demo day (17.10.2026) and the station network. */

const H = (h: number) => `${String(h).padStart(2, "0")}:00`;

/* ------------------------------ Hourly field data ------------------------------ */

/** 06:00 – 23:00: vehicles in, fueled, attendants on field, avg queue and wait. */
export const HOURLY = [
  [6, 38, 33, 2, 0.2, 22],
  [7, 74, 66, 3, 0.8, 48],
  [8, 96, 84, 3, 1.4, 86],
  [9, 81, 70, 4, 0.9, 54],
  [10, 72, 61, 4, 0.6, 41],
  [11, 78, 66, 4, 0.7, 44],
  [12, 94, 79, 4, 1.1, 68],
  [13, 88, 74, 4, 1.0, 62],
  [14, 84, 71, 3, 1.2, 77],
  [15, 92, 78, 4, 1.1, 71],
  [16, 118, 99, 5, 1.9, 124],
  [17, 132, 111, 4, 2.8, 196],
  [18, 126, 106, 5, 2.4, 168],
  [19, 104, 88, 5, 1.5, 96],
  [20, 86, 73, 4, 0.9, 58],
  [21, 64, 54, 3, 0.6, 40],
  [22, 41, 35, 2, 0.4, 30],
  [23, 26, 22, 2, 0.2, 18],
].map(([h, cars, fueled, staff, queue, wait]) => ({
  t: H(h),
  cars,
  fueled,
  staff,
  queue,
  wait,
  perStaff: Math.round(cars / staff),
  ideal: Math.max(2, Math.ceil(cars / 22)),
}));

export const DAY = {
  cars: HOURLY.reduce((a, b) => a + b.cars, 0),
  fueled: HOURLY.reduce((a, b) => a + b.fueled, 0),
  prevCars: 1418,
};

/** Weekly × hourly pump occupancy heatmap (0–100). */
export const HEAT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, d) => ({
  day,
  values: Array.from({ length: 24 }, (_, h) => {
    const base = h < 6 ? 6 : h < 8 ? 40 : h < 10 ? 62 : h < 16 ? 50 : h < 20 ? 78 : h < 22 ? 46 : 22;
    const wk = d >= 4 ? 12 : 0;
    return Math.min(100, Math.round(base + wk + ((h * 7 + d * 13) % 11) - 5));
  }),
}));

/* ------------------------------ Service quality ------------------------------ */

export const SERVICE = {
  avgService: 274,
  slaTarget: 270,
  avgDwell: 342,
  afterNozzle: 61,
  docking: 92.4,
  slaHit: 81.6,
};

export const SERVICE_STAGES = [
  { label: "Yanaşma → karşılama", v: 24 },
  { label: "Karşılama → tabanca", v: 38 },
  { label: "Dolum", v: 162 },
  { label: "Ödeme / kapanış", v: 50 },
  { label: "Tabanca sonrası bekleme", v: 61 },
];

export const WASH = {
  served: 520,
  windows: 275,
  selfWash: 37,
  additive: 37,
  additiveOffered: 153,
};

/* ------------------------------ Customer & market ------------------------------ */

export const VEHICLE_TYPES = [
  { label: "Binek", value: 1086 },
  { label: "Jip / SUV", value: 214 },
  { label: "Minibüs / Panelvan", value: 96 },
  { label: "Kamyon / TIR", value: 78 },
];

export const SHIFTS = [
  { t: "Sabah 06–16", cars: 797, fueled: 682, market: 412, buy: 251, women: 23, perCar: 1.4 },
  { t: "Akşam 16–24", cars: 697, fueled: 588, market: 418, buy: 262, women: 27, perCar: 1.7 },
];

export const MARKET = { entered: 830, bought: 513, women: 25, perCar: 1.55, avgQueue: 1.8, avgWait: 96, staffed: 94.2 };

export const RESTROOM = [
  { label: "Bay", value: 412 },
  { label: "Bayan", value: 238 },
  { label: "Çocuk", value: 57 },
];

export const AISLES = [
  { label: "İçecek dolabı", value: 92, dwell: 48 },
  { label: "Atıştırmalık", value: 78, dwell: 41 },
  { label: "Kampanya standı (madeni yağ)", value: 64, dwell: 36 },
  { label: "Kahve köşesi", value: 61, dwell: 112 },
  { label: "Oto aksesuar", value: 34, dwell: 29 },
  { label: "Tütün / kasa önü", value: 88, dwell: 22 },
];

export const CASH_HOURLY = HOURLY.map((h) => ({
  t: h.t,
  queue: Math.round(h.cars / 40 + (h.t >= "17:00" && h.t <= "18:00" ? 2 : 0)),
  wait: Math.round(30 + h.cars * 0.9),
}));

export const CLEANING = [
  { plan: "08:00", done: "08:04", ok: true },
  { plan: "10:00", done: "10:11", ok: true },
  { plan: "12:00", done: "12:02", ok: true },
  { plan: "14:00", done: "14:26", ok: false },
  { plan: "16:00", done: "16:02", ok: true },
  { plan: "17:00", done: "—", ok: false },
];

export const CARWASH = { cars: 41, avg: 520, airWater: 118, queuePeak: 3 };
export const CARWASH_HOURLY = HOURLY.map((h, i) => ({ t: h.t, wash: Math.max(0, Math.round(h.cars / 30 + ((i * 3) % 4) - 1)), air: Math.round(h.cars / 12) }));

/* ------------------------------ Tanker history ------------------------------ */

export const TANKERS = [
  { date: "17.10.2026", plate: "34 TNK 905", fuel: "Motorin 18.000 L", in: "14:02", out: "14:46", dur: 36, safety: "2 ihlal" },
  { date: "15.10.2026", plate: "34 TNK 312", fuel: "Benzin 14.000 L", in: "10:41", out: "11:20", dur: 31, safety: "Uygun" },
  { date: "13.10.2026", plate: "41 AKR 077", fuel: "Motorin 20.000 L", in: "06:18", out: "07:09", dur: 42, safety: "Uygun" },
  { date: "11.10.2026", plate: "34 TNK 905", fuel: "LPG 9.000 L", in: "15:30", out: "16:02", dur: 25, safety: "1 ihlal" },
  { date: "09.10.2026", plate: "34 TNK 312", fuel: "Motorin 18.000 L", in: "09:12", out: "09:55", dur: 35, safety: "Uygun" },
  { date: "07.10.2026", plate: "41 AKR 077", fuel: "Benzin 14.000 L", in: "13:47", out: "14:28", dur: 33, safety: "Uygun" },
];

/* ------------------------------ Stations ------------------------------ */

export type StationRow = {
  id: string;
  name: string;
  region: string;
  cars: number;
  service: number;
  queue: number;
  wash: number;
  uniform: number;
  safety: number;
  driveoff: number;
  market: number;
  cams: string;
  score: number;
  status: "NORMAL" | "WARNING" | "CRITICAL";
};

export const STATIONS: StationRow[] = [
  { id: "ist-ornek", name: "İstanbul / Örnek İstasyon", region: "İstanbul Avrupa", cars: 1494, service: 274, queue: 118, wash: 53, uniform: 86, safety: 7, driveoff: 1, market: 62, cams: "22/24", score: 78, status: "WARNING" },
  { id: "ist-basaksehir", name: "İstanbul / Başakşehir", region: "İstanbul Avrupa", cars: 1622, service: 248, queue: 84, wash: 68, uniform: 97, safety: 1, driveoff: 0, market: 66, cams: "26/26", score: 91, status: "NORMAL" },
  { id: "ist-tuzla", name: "İstanbul / Tuzla TEM", region: "İstanbul Anadolu", cars: 2184, service: 312, queue: 164, wash: 41, uniform: 81, safety: 9, driveoff: 2, market: 58, cams: "30/32", score: 69, status: "CRITICAL" },
  { id: "kocaeli", name: "Kocaeli / Gebze", region: "Marmara", cars: 1356, service: 261, queue: 92, wash: 61, uniform: 94, safety: 2, driveoff: 0, market: 60, cams: "20/20", score: 88, status: "NORMAL" },
  { id: "bursa", name: "Bursa / Nilüfer", region: "Marmara", cars: 1188, service: 255, queue: 76, wash: 64, uniform: 92, safety: 3, driveoff: 1, market: 64, cams: "22/22", score: 86, status: "NORMAL" },
  { id: "ankara", name: "Ankara / Eskişehir Yolu", region: "İç Anadolu", cars: 1730, service: 289, queue: 131, wash: 48, uniform: 88, safety: 5, driveoff: 1, market: 57, cams: "27/28", score: 76, status: "WARNING" },
  { id: "izmir", name: "İzmir / Bornova", region: "Ege", cars: 1264, service: 252, queue: 81, wash: 66, uniform: 95, safety: 1, driveoff: 0, market: 65, cams: "24/24", score: 90, status: "NORMAL" },
  { id: "antalya", name: "Antalya / Kepez", region: "Akdeniz", cars: 1102, service: 266, queue: 88, wash: 59, uniform: 91, safety: 2, driveoff: 0, market: 61, cams: "20/20", score: 85, status: "NORMAL" },
];

/* ------------------------------ Reports ------------------------------ */

export const WEEK = [
  { t: "Pzt", cars: 1312, service: 266, events: 18 },
  { t: "Sal", cars: 1288, service: 262, events: 15 },
  { t: "Çar", cars: 1341, service: 268, events: 21 },
  { t: "Per", cars: 1376, service: 271, events: 19 },
  { t: "Cum", cars: 1528, service: 281, events: 27 },
  { t: "Cmt", cars: 1494, service: 274, events: 34 },
  { t: "Paz", cars: 1186, service: 259, events: 14 },
];
