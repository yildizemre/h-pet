/**
 * Single source of truth for the demo station: pumps, field staff and cameras.
 * Demo day is 17 Ekim 2026 (Cumartesi) — the day shown on the notification images.
 */
import { at } from "../lib/util";

/* ------------------------------------------------------------------ */
/*  Station                                                            */
/* ------------------------------------------------------------------ */

export const STATION = {
  id: "ist-ornek",
  city: "İstanbul",
  name: "Örnek İstasyon",
  full: "İstanbul / Örnek İstasyon",
  brand: "Petrol Ofisi",
  day: "17 Ekim 2026 Cumartesi",
  shift: "Akşam vardiyası · 16:00–24:00",
  lastData: "18:40:00",
};

/* ------------------------------------------------------------------ */
/*  Pumps — 4 islands × 2 sides                                        */
/* ------------------------------------------------------------------ */

export type PumpState = "DOLUM" | "BOŞ" | "İŞGAL" | "KUYRUK" | "HİZMET BEKLİYOR";

export type Pump = {
  id: string;
  island: number;
  fuels: string;
  state: PumpState;
  queue: number;
  /** average service seconds today */
  service: number;
  /** average wait in queue, seconds */
  wait: number;
  /** after nozzle closed, seconds */
  afterNozzle: number;
  occupancy: number;
  vehicles: number;
  occupyAlerts: number;
  badDocking: number;
};

export const PUMPS: Pump[] = [
  { id: "P1", island: 1, fuels: "Benzin · Motorin", state: "DOLUM", queue: 1, service: 248, wait: 64, afterNozzle: 42, occupancy: 71, vehicles: 182, occupyAlerts: 1, badDocking: 3 },
  { id: "P2", island: 1, fuels: "Benzin · Motorin", state: "KUYRUK", queue: 3, service: 402, wait: 188, afterNozzle: 58, occupancy: 88, vehicles: 171, occupyAlerts: 2, badDocking: 5 },
  { id: "P3", island: 2, fuels: "Motorin · LPG", state: "KUYRUK", queue: 5, service: 286, wait: 236, afterNozzle: 51, occupancy: 93, vehicles: 204, occupyAlerts: 1, badDocking: 2 },
  { id: "P4", island: 2, fuels: "Motorin · LPG", state: "HİZMET BEKLİYOR", queue: 2, service: 271, wait: 142, afterNozzle: 47, occupancy: 84, vehicles: 196, occupyAlerts: 0, badDocking: 6 },
  { id: "P5", island: 3, fuels: "Benzin · Motorin", state: "DOLUM", queue: 0, service: 233, wait: 38, afterNozzle: 36, occupancy: 62, vehicles: 158, occupyAlerts: 0, badDocking: 1 },
  { id: "P6", island: 3, fuels: "Benzin · Motorin", state: "İŞGAL", queue: 2, service: 259, wait: 121, afterNozzle: 558, occupancy: 79, vehicles: 149, occupyAlerts: 3, badDocking: 2 },
  { id: "P7", island: 4, fuels: "Motorin (TIR)", state: "DOLUM", queue: 1, service: 512, wait: 96, afterNozzle: 64, occupancy: 68, vehicles: 61, occupyAlerts: 0, badDocking: 1 },
  { id: "P8", island: 4, fuels: "Motorin (TIR)", state: "BOŞ", queue: 0, service: 488, wait: 22, afterNozzle: 41, occupancy: 41, vehicles: 47, occupyAlerts: 0, badDocking: 0 },
];

export const PUMP_STATE_TONE: Record<PumpState, "ok" | "accent" | "warn" | "danger" | "mute"> = {
  DOLUM: "accent",
  BOŞ: "mute",
  İŞGAL: "danger",
  KUYRUK: "warn",
  "HİZMET BEKLİYOR": "warn",
};

export const pumpById = (id: string) => PUMPS.find((p) => p.id === id);

/* ------------------------------------------------------------------ */
/*  Field staff                                                        */
/* ------------------------------------------------------------------ */

export type StaffRole = "Pompacı" | "Kasiyer" | "Vardiya Sorumlusu" | "Temizlik";
export type StaffStatus = "SAHADA" | "MARKET" | "MOLA" | "PASİF";

export type Staff = {
  id: string;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  area: string;
  vehicles: number;
  windows: number;
  additiveOffers: number;
  additiveSold: number;
  avgService: number;
  /** minutes on field today */
  fieldMin: number;
  vest: boolean;
  uniform: boolean;
};

export const STAFF: Staff[] = [
  { id: "S-01", name: "Pompacı 01", role: "Pompacı", status: "SAHADA", area: "Ada 1", vehicles: 96, windows: 61, additiveOffers: 38, additiveSold: 9, avgService: 241, fieldMin: 152, vest: true, uniform: true },
  { id: "S-02", name: "Pompacı 02", role: "Pompacı", status: "SAHADA", area: "Ada 2", vehicles: 118, windows: 42, additiveOffers: 21, additiveSold: 4, avgService: 288, fieldMin: 161, vest: false, uniform: true },
  { id: "S-03", name: "Pompacı 03", role: "Pompacı", status: "SAHADA", area: "Ada 3", vehicles: 87, windows: 66, additiveOffers: 44, additiveSold: 12, avgService: 236, fieldMin: 149, vest: true, uniform: true },
  { id: "S-04", name: "Pompacı 04", role: "Pompacı", status: "PASİF", area: "Ada 3", vehicles: 54, windows: 19, additiveOffers: 8, additiveSold: 1, avgService: 312, fieldMin: 96, vest: true, uniform: false },
  { id: "S-05", name: "Pompacı 05", role: "Pompacı", status: "SAHADA", area: "Ada 4 (TIR)", vehicles: 61, windows: 33, additiveOffers: 12, additiveSold: 3, avgService: 498, fieldMin: 158, vest: true, uniform: true },
  { id: "S-06", name: "Pompacı 06", role: "Pompacı", status: "MOLA", area: "—", vehicles: 72, windows: 48, additiveOffers: 26, additiveSold: 6, avgService: 259, fieldMin: 118, vest: true, uniform: true },
  { id: "S-07", name: "Kasiyer 01", role: "Kasiyer", status: "MARKET", area: "Kasa 1", vehicles: 0, windows: 0, additiveOffers: 0, additiveSold: 0, avgService: 0, fieldMin: 0, vest: false, uniform: true },
  { id: "S-08", name: "Kasiyer 02", role: "Kasiyer", status: "MARKET", area: "Kasa 2", vehicles: 0, windows: 0, additiveOffers: 0, additiveSold: 0, avgService: 0, fieldMin: 0, vest: false, uniform: true },
  { id: "S-09", name: "Vardiya Sorumlusu", role: "Vardiya Sorumlusu", status: "SAHADA", area: "Saha", vehicles: 14, windows: 6, additiveOffers: 4, additiveSold: 2, avgService: 0, fieldMin: 88, vest: true, uniform: true },
  { id: "S-10", name: "Temizlik 01", role: "Temizlik", status: "MARKET", area: "Lavabo / Market", vehicles: 0, windows: 0, additiveOffers: 0, additiveSold: 0, avgService: 0, fieldMin: 0, vest: false, uniform: true },
];

export const staffById = (id: string) => STAFF.find((s) => s.id === id);
export const PUMP_ATTENDANTS = STAFF.filter((s) => s.role === "Pompacı");

/* ------------------------------------------------------------------ */
/*  Cameras                                                            */
/* ------------------------------------------------------------------ */

export type CamStatus = "online" | "warning" | "offline";
export type CamIssue = "Bağlantı koptu" | "Kirlenme" | "Kararma" | "Açı kayması" | "Bulanık" | "FPS düşük";

export type Camera = {
  id: string;
  name: string;
  area: "Pompa" | "Tanker" | "Güvenlik" | "Market" | "Giriş/Çıkış" | "Yıkama";
  status: CamStatus;
  issue?: CamIssue;
  issueAt?: Date;
  fps: number;
  conf: number;
  analytics: boolean;
  models: string[];
};

const CAM_DEF: [string, string, Camera["area"], string[]][] = [
  ["CAM-01", "Giriş / Plaka", "Giriş/Çıkış", ["Plaka OCR", "Araç sayımı", "Araç cinsi"]],
  ["CAM-02", "Çıkış / Plaka", "Giriş/Çıkış", ["Plaka OCR", "Drive-off"]],
  ["CAM-03", "Pompa Adası 1", "Pompa", ["Servis süresi", "Yanaşma", "Cam silme"]],
  ["CAM-04", "Pompa Adası 1 · Karşı", "Pompa", ["Kuyruk", "Kıyafet / yelek"]],
  ["CAM-05", "Pompa Adası 2", "Pompa", ["Servis süresi", "Yanaşma", "Cam silme"]],
  ["CAM-06", "Pompa Adası 2 · Karşı", "Pompa", ["Kuyruk", "Saha düzeni"]],
  ["CAM-07", "Pompa Adası 3", "Pompa", ["Servis süresi", "Pompa işgali", "Cam silme"]],
  ["CAM-08", "Pompa Adası 3 · Karşı", "Pompa", ["Kuyruk", "Saha düzeni"]],
  ["CAM-09", "Pompa Adası 4 (TIR)", "Pompa", ["Servis süresi", "Araç cinsi"]],
  ["CAM-10", "Saha Genel · Kanopi", "Pompa", ["Personel sayımı", "Yangın / duman", "Isı haritası"]],
  ["CAM-11", "Tanker Boşaltma Alanı", "Tanker", ["Tanker takibi", "Emniyet konisi", "Yangın söndürücü"]],
  ["CAM-12", "Tanker Plaka", "Tanker", ["Plaka OCR", "Geliş / çıkış"]],
  ["CAM-13", "Tank Sahası", "Güvenlik", ["Yasaklı alan", "Yangın / duman"]],
  ["CAM-14", "Jeneratör / Elektrik Odası", "Güvenlik", ["Yasaklı alan"]],
  ["CAM-15", "Market Arkası", "Güvenlik", ["Gece güvenliği", "Şüpheli bekleme", "Yangın / duman"]],
  ["CAM-16", "Depo", "Güvenlik", ["Yasaklı alan", "Yangın / duman"]],
  ["CAM-17", "Market Giriş", "Market", ["Kişi sayımı", "Cinsiyet (anonim)"]],
  ["CAM-18", "Market Kasa 1", "Market", ["Kasa kuyruğu", "Kasa personeli"]],
  ["CAM-19", "Market Kasa 2", "Market", ["Kasa kuyruğu", "Kasa personeli"]],
  ["CAM-20", "Market Reyon A", "Market", ["Isı haritası", "Kampanya standı"]],
  ["CAM-21", "Market Reyon B", "Market", ["Isı haritası"]],
  ["CAM-22", "Lavabo Koridoru", "Market", ["Tuvalet kullanımı", "Temizlik girişi"]],
  ["CAM-23", "Oto Yıkama", "Yıkama", ["Yıkama sayımı", "Yıkama süresi"]],
  ["CAM-24", "Hava-Su Ünitesi", "Yıkama", ["Kullanım sayımı"]],
];

const ISSUES: Record<string, Partial<Camera>> = {
  "CAM-07": { status: "warning", issue: "Açı kayması", issueAt: at(17, 4, 12), conf: 61, analytics: false },
  "CAM-04": { status: "warning", issue: "Kirlenme", issueAt: at(15, 22, 40), conf: 54, analytics: false },
  "CAM-14": { status: "offline", issue: "Bağlantı koptu", issueAt: at(18, 2, 33), conf: 0, fps: 0, analytics: false },
};

export const CAMERAS: Camera[] = CAM_DEF.map(([id, name, area, models]) => ({
  id,
  name,
  area,
  status: "online" as CamStatus,
  fps: 25,
  conf: 94 + (id.charCodeAt(id.length - 1) % 6),
  analytics: true,
  models,
  ...ISSUES[id],
}));

export const cameraById = (id: string) => CAMERAS.find((c) => c.id === id);

export const CAM_STATS = {
  total: CAMERAS.length,
  online: CAMERAS.filter((c) => c.status !== "offline").length,
  offline: CAMERAS.filter((c) => c.status === "offline").length,
  warning: CAMERAS.filter((c) => c.status !== "online").length,
  analyticsHealthy: CAMERAS.filter((c) => c.analytics).length,
};
