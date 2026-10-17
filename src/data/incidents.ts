/**
 * The AI notifications of 17.10.2026. Every notification has its own CCTV image in
 * public/bildirim/<slug>.jpg — until an image is uploaded the panel shows a placeholder with the file name.
 */
import { at } from "../lib/util";

export type Cat =
  | "pump"
  | "occupy"
  | "wash"
  | "queue"
  | "staffing"
  | "uniform"
  | "tanker"
  | "tanker_safety"
  | "fire"
  | "restricted"
  | "order"
  | "night"
  | "driveoff"
  | "customer"
  | "market"
  | "restroom"
  | "carwash"
  | "camera";

export type Sev = "critical" | "warning" | "info";
export type Status = "new" | "review" | "verified" | "false" | "closed";

export type Incident = {
  id: string;
  /** order in the presentation list */
  no: number;
  cat: Cat;
  sev: Sev;
  status: Status;
  at: Date;
  /** camera label exactly as printed on the image */
  cam: string;
  img: string;
  pump?: string;
  plate?: string;
  staff?: string;
  track?: string;
  amount?: number;
  title: string;
  /** short lines used by notification cards */
  lines: string[];
  /** values read off the image overlay */
  facts: [string, string][];
  detail: string;
  action: string;
  link: string;
  linkLabel: string;
  /** incidents that belong to the same story share a chain id */
  chain?: string;
  note?: string;
};

export type NotifCat = "Pompa" | "Hizmet" | "Personel" | "Tanker" | "Yangın" | "Güvenlik" | "Saha Düzeni" | "Drive-off" | "Market" | "Kamera";
export const NOTIF_CATS: NotifCat[] = ["Yangın", "Güvenlik", "Drive-off", "Tanker", "Pompa", "Hizmet", "Personel", "Saha Düzeni", "Market", "Kamera"];

export type IncGroup = "Operasyon" | "Tanker" | "Güvenlik & İSG" | "Müşteri & Market" | "Kamera Sağlığı";
export const INC_GROUPS: IncGroup[] = ["Operasyon", "Tanker", "Güvenlik & İSG", "Müşteri & Market", "Kamera Sağlığı"];

export const CAT_META: Record<Cat, { label: string; notif: NotifCat; group: IncGroup; emoji: string }> = {
  pump: { label: "Pompa Operasyonu", notif: "Pompa", group: "Operasyon", emoji: "⛽" },
  occupy: { label: "Pompa İşgali", notif: "Pompa", group: "Operasyon", emoji: "⛽" },
  wash: { label: "Cam Silme & Hizmet", notif: "Hizmet", group: "Operasyon", emoji: "🧽" },
  queue: { label: "Pompa Kuyruğu", notif: "Pompa", group: "Operasyon", emoji: "🚗" },
  staffing: { label: "Personel – Yoğunluk", notif: "Personel", group: "Operasyon", emoji: "👷" },
  uniform: { label: "Kıyafet & Yelek", notif: "Personel", group: "Operasyon", emoji: "🦺" },
  tanker: { label: "Tanker Dolum", notif: "Tanker", group: "Tanker", emoji: "🚛" },
  tanker_safety: { label: "Tanker Emniyet", notif: "Tanker", group: "Tanker", emoji: "🚧" },
  fire: { label: "Yangın & Duman", notif: "Yangın", group: "Güvenlik & İSG", emoji: "🔥" },
  restricted: { label: "Yasaklı Alan", notif: "Güvenlik", group: "Güvenlik & İSG", emoji: "⛔" },
  order: { label: "Saha Düzeni", notif: "Saha Düzeni", group: "Güvenlik & İSG", emoji: "📋" },
  night: { label: "Gece Güvenliği", notif: "Güvenlik", group: "Güvenlik & İSG", emoji: "🌙" },
  driveoff: { label: "Drive-off", notif: "Drive-off", group: "Güvenlik & İSG", emoji: "💸" },
  customer: { label: "Araç & Müşteri", notif: "Market", group: "Müşteri & Market", emoji: "👥" },
  market: { label: "Market Kasa", notif: "Market", group: "Müşteri & Market", emoji: "🛒" },
  restroom: { label: "Lavabo Temizlik", notif: "Market", group: "Müşteri & Market", emoji: "🧹" },
  carwash: { label: "Oto Yıkama", notif: "Market", group: "Müşteri & Market", emoji: "🚿" },
  camera: { label: "Kamera Sağlığı", notif: "Kamera", group: "Kamera Sağlığı", emoji: "📷" },
};

export const SEV_META: Record<Sev, { label: string; tone: "danger" | "warn" | "accent" }> = {
  critical: { label: "KRİTİK", tone: "danger" },
  warning: { label: "UYARI", tone: "warn" },
  info: { label: "BİLGİ", tone: "accent" },
};

export const STATUS_META: Record<Status, { label: string; tone: "danger" | "warn" | "ok" | "mute" | "accent" }> = {
  new: { label: "Yeni", tone: "danger" },
  review: { label: "İncelemede", tone: "warn" },
  verified: { label: "Doğrulandı", tone: "accent" },
  false: { label: "Yanlış alarm", tone: "mute" },
  closed: { label: "Kapatıldı", tone: "ok" },
};

const img = (slug: string) => `/bildirim/${slug}.jpg`;

/* ------------------------------------------------------------------ */
/*  Notifications — presentation order                                 */
/* ------------------------------------------------------------------ */

const LIST: Omit<Incident, "id">[] = [
  // ⛽ Pompa operasyonu
  {
    no: 1, cat: "pump", sev: "warning", status: "closed", at: at(17, 12, 8),
    cam: "CAM-05 · Pompa Adası 2", img: img("arac-pompaya-hatali-yanasti"), pump: "P4", plate: "34 KLM 482",
    title: "Araç Pompaya Hatalı Yanaştı",
    lines: ["P4 · araç yanaşma çizgisinin 1,4 m dışında", "Personel yönlendirmesi yapılmadı"],
    facts: [["Pompa", "P4"], ["Sapma", "1,4 m"], ["Yönlendirme", "YOK"], ["Plaka", "34 KLM 482"]],
    detail: "P4'e gelen binek araç yanaşma alanının dışında durdu; tabanca hortumu gergin şekilde kullanıldı. Sahadaki personel aracı yönlendirmedi.",
    action: "Personeli araç karşılama ve yanaştırma prosedürü konusunda bilgilendir.",
    link: "/pumps", linkLabel: "Olayı İncele",
  },
  {
    no: 2, cat: "pump", sev: "warning", status: "review", at: at(17, 48, 31),
    cam: "CAM-05 · Pompa Adası 2", img: img("servis-suresi-sla-asildi"), pump: "P2", staff: "S-02",
    title: "Servis Süresi SLA Aşıldı",
    lines: ["P2 · hizmet süresi 06:42 (hedef 04:30)", "Personel S-02 · araç başı bekleme uzadı"],
    facts: [["Pompa", "P2"], ["Hizmet süresi", "06:42"], ["Hedef", "04:30"], ["Personel", "S-02"]],
    detail: "P2'deki araca hizmet süresi 06:42 ile hedefin 2 dakikadan fazla üstüne çıktı. Personel aynı anda iki araçla ilgilendi.",
    action: "Ada 2'ye ikinci pompacı yönlendir.",
    link: "/pumps", linkLabel: "Olayı İncele",
  },
  {
    no: 3, cat: "occupy", sev: "critical", status: "new", at: at(18, 21, 44),
    cam: "CAM-07 · Pompa Adası 3", img: img("pompa-isgali-arac-pompada-birakildi"), pump: "P6", plate: "34 RT 7719", track: "Track 418", chain: "occupy-p6",
    title: "Pompa İşgali — Araç Pompada Bırakıldı",
    lines: ["P6 · tabanca kapandıktan sonra 09:18 işgal", "Sürücü markete yöneldi · arkada 2 araç bekliyor"],
    facts: [["Pompa", "P6"], ["Tabanca sonrası", "09:18"], ["Eşik", "03:00"], ["Bekleyen araç", "2"], ["Plaka", "34 RT 7719"]],
    detail: "P6'da yakıt alımı 18:12'de tamamlandı. Sürücü aracı pompada bırakarak markete gitti; araç 9 dakikadan uzun süredir pompayı işgal ediyor ve arkada 2 araç bekliyor.",
    action: "Kasaya bildir: sürücüden aracı park alanına çekmesini iste.",
    link: "/pumps", linkLabel: "Olayı İncele",
  },
  {
    no: 4, cat: "occupy", sev: "info", status: "new", at: at(18, 13, 2),
    cam: "CAM-17 · Market Giriş", img: img("surucu-markete-girdi"), pump: "P6", track: "Track 418", chain: "occupy-p6",
    title: "Sürücü Markete Girdi",
    lines: ["Track 418 · P6 aracından markete giriş", "Araç pompada bırakıldı"],
    facts: [["Track", "418"], ["Kaynak pompa", "P6"], ["Market girişi", "18:13:02"]],
    detail: "P6'daki aracın sürücüsü (Track 418) yakıt alımından 50 sn sonra markete girdi. Sistem aracı işgal takibine aldı.",
    action: "—",
    link: "/pumps", linkLabel: "Olayı İncele",
  },
  {
    no: 5, cat: "pump", sev: "warning", status: "new", at: at(18, 31, 19),
    cam: "CAM-08 · Pompa Adası 3 · Karşı", img: img("arac-hizmet-bekliyor-personel-yok"), pump: "P5",
    title: "Araç Hizmet Bekliyor — Personel Yok",
    lines: ["P5 · araç 02:36'dır pompada, personel gelmedi", "En yakın personel S-04 · PASİF"],
    facts: [["Pompa", "P5"], ["Bekleme", "02:36"], ["Ada personeli", "0"], ["En yakın", "S-04 · PASİF"]],
    detail: "P5'e yanaşan araca 2,5 dakikadır hiçbir personel yaklaşmadı. Ada 3'ten sorumlu S-04 pompa dibinde pasif durumda.",
    action: "S-04'ü P5'e yönlendir.",
    link: "/pumps", linkLabel: "Olayı İncele",
  },

  // 🧽 Cam silme & hizmet
  {
    no: 6, cat: "wash", sev: "info", status: "closed", at: at(17, 36, 50),
    cam: "CAM-03 · Pompa Adası 1", img: img("cam-silme-hizmeti-tamamlandi"), pump: "P1", staff: "S-01",
    title: "Cam Silme Hizmeti Tamamlandı",
    lines: ["P1 · S-01 ön camı sildi · 48 sn", "Bugün S-01: 61 cam"],
    facts: [["Pompa", "P1"], ["Personel", "S-01"], ["Süre", "00:48"], ["Bugün", "61 cam"]],
    detail: "S-01 P1'deki aracın ön camını 48 saniyede sildi. Hizmet araç bazlı kaydedildi.",
    action: "—",
    link: "/service-quality", linkLabel: "Olayı İncele",
  },
  {
    no: 7, cat: "wash", sev: "warning", status: "new", at: at(18, 4, 27),
    cam: "CAM-05 · Pompa Adası 2", img: img("musteri-kendi-camini-siliyor"), pump: "P3",
    title: "Müşteri Kendi Camını Siliyor",
    lines: ["P3 · müşteri camını kendisi sildi", "Personel S-02 başka araçla meşgul"],
    facts: [["Pompa", "P3"], ["Silen", "MÜŞTERİ"], ["Bugün", "37 müşteri"]],
    detail: "P3'teki müşteri camı kendisi sildi. Bugün kendi camını silen müşteri sayısı 37'ye ulaştı; bunların 22'si Ada 2'de.",
    action: "Ada 2'de cam silme hizmetini güçlendir.",
    link: "/service-quality", linkLabel: "Olayı İncele",
  },
  {
    no: 8, cat: "wash", sev: "info", status: "closed", at: at(17, 58, 12),
    cam: "CAM-07 · Pompa Adası 3", img: img("yakit-katkisi-teklif-edildi"), pump: "P5", staff: "S-03",
    title: "Yakıt Katkı Ürünü Verildi",
    lines: ["P5 · S-03 araca katkı ürünü uyguladı", "Bugün katkı alan araç: 37"],
    facts: [["Pompa", "P5"], ["Personel", "S-03"], ["Ürün", "Yakıt katkısı"], ["Bugün", "37 araç"]],
    detail: "S-03 P5'teki araca yakıt katkı ürünü uyguladı. Katkı alan / almayan araçlar ayrı raporlanır.",
    action: "—",
    link: "/service-quality", linkLabel: "Olayı İncele",
  },

  // 🚗 Kuyruk & personel
  {
    no: 9, cat: "queue", sev: "warning", status: "new", at: at(18, 26, 5),
    cam: "CAM-06 · Pompa Adası 2 · Karşı", img: img("pompa-kuyrugu-esik-ustu"), pump: "P3",
    title: "Pompa Kuyruğu Eşik Üstü",
    lines: ["Ada 2 · P3'te 5 araç kuyrukta", "Ortalama bekleme 03:56 · Ada 3 boşta"],
    facts: [["Pompa", "P3"], ["Kuyruk", "5 araç"], ["Bekleme", "03:56"], ["Doluluk", "%93"]],
    detail: "P3'te kuyruk 5 araca çıktı, ortalama bekleme 03:56. Aynı anda Ada 3'teki P5 boşta.",
    action: "Girişte araçları Ada 3'e yönlendir.",
    link: "/queue", linkLabel: "Olayı İncele",
  },
  {
    no: 10, cat: "staffing", sev: "critical", status: "review", at: at(17, 30, 0),
    cam: "CAM-10 · Saha Genel · Kanopi", img: img("saha-personeli-yetersiz"),
    title: "Saha Personeli Yetersiz",
    lines: ["17:00–18:00 · 4 pompacı · 132 araç", "Personel başına 33 araç (hedef ≤ 22)"],
    facts: [["Saat", "17:00–18:00"], ["Sahada personel", "4"], ["Araç", "132"], ["Araç / personel", "33"]],
    detail: "Akşam yoğunluğunda sahada 4 pompacı vardı; saatlik 132 araç ile personel başına 33 araç düştü. Aynı saatte 1 personel moladaydı.",
    action: "Molaları 17:00–19:00 dışına kaydır; bu saatlere +2 pompacı planla.",
    link: "/staffing", linkLabel: "Olayı İncele",
  },
  {
    no: 11, cat: "uniform", sev: "warning", status: "new", at: at(16, 44, 21),
    cam: "CAM-04 · Pompa Adası 1 · Karşı", img: img("reflektorlu-yelek-yok"), staff: "S-02",
    title: "Reflektörlü Yelek Kullanılmıyor",
    lines: ["S-02 · sahada yeleksiz çalışıyor", "Süre 1 sa 56 dk"],
    facts: [["Personel", "S-02"], ["Yelek", "YOK"], ["Kıyafet", "UYGUN"], ["Süre", "1:56"]],
    detail: "S-02 vardiya başından beri pompa sahasında reflektörlü yelek olmadan çalışıyor.",
    action: "Vardiya sorumlusu S-02'ye yelek giydirsin.",
    link: "/uniform", linkLabel: "Olayı İncele",
  },
  {
    no: 12, cat: "uniform", sev: "warning", status: "new", at: at(16, 9, 48),
    cam: "CAM-07 · Pompa Adası 3", img: img("firma-kiyafeti-uyumsuz"), staff: "S-04",
    title: "Firma Kıyafeti Uyumsuz",
    lines: ["S-04 · firma montu yerine sivil mont", "Yelek mevcut"],
    facts: [["Personel", "S-04"], ["Kıyafet", "UYUMSUZ"], ["Yelek", "VAR"]],
    detail: "S-04 firma montu yerine sivil bir mont giyiyor; reflektörlü yelek mevcut.",
    action: "Kıyafet standardını hatırlat.",
    link: "/uniform", linkLabel: "Olayı İncele",
  },

  // 🚛 Tanker
  {
    no: 13, cat: "tanker", sev: "info", status: "closed", at: at(14, 2, 16),
    cam: "CAM-12 · Tanker Plaka", img: img("tanker-giris-yapti-plaka-okundu"), plate: "34 TNK 905", chain: "tanker-1",
    title: "Tanker Giriş Yaptı — Plaka Okundu",
    lines: ["34 TNK 905 · 14:02 giriş", "Beklenen sevkiyat ile eşleşti"],
    facts: [["Plaka", "34 TNK 905"], ["Giriş", "14:02:16"], ["OCR güveni", "%98"]],
    detail: "Akaryakıt tankeri istasyona giriş yaptı, plaka OCR ile okundu ve dolum geçmişine eklendi.",
    action: "—",
    link: "/tanker", linkLabel: "Olayı İncele",
  },
  {
    no: 14, cat: "tanker_safety", sev: "critical", status: "verified", at: at(14, 9, 40),
    cam: "CAM-11 · Tanker Boşaltma Alanı", img: img("bosaltmada-emniyet-konisi-eksik"), plate: "34 TNK 905", chain: "tanker-1",
    title: "Boşaltmada Emniyet Konisi / Şerit Eksik",
    lines: ["Boşaltma başladı · koni 0 / 4", "Emniyet şeridi kurulmadı"],
    facts: [["Plaka", "34 TNK 905"], ["Koni", "0 / 4"], ["Şerit", "YOK"], ["Boşaltma", "AKTİF"]],
    detail: "Tanker boşaltmaya başladığında alana emniyet konisi ve şeridi kurulmamıştı. Alanın çevresinden araç ve yaya geçişi açık.",
    action: "Boşaltmayı durdur, koni ve şeridi kur.",
    link: "/tanker", linkLabel: "Olayı İncele",
  },
  {
    no: 15, cat: "tanker_safety", sev: "critical", status: "verified", at: at(14, 10, 2),
    cam: "CAM-11 · Tanker Boşaltma Alanı", img: img("yangin-sondurucu-yerinde-degil"), plate: "34 TNK 905", chain: "tanker-1",
    title: "Yangın Söndürücü Yerinde Değil",
    lines: ["Boşaltma noktasında söndürücü tespit edilmedi", "Tanker 34 TNK 905"],
    facts: [["Söndürücü", "YOK"], ["Beklenen", "2 adet · 50 kg"], ["Boşaltma", "AKTİF"]],
    detail: "Boşaltma noktasının yanında bulunması gereken tekerlekli yangın söndürücü tespit edilmedi.",
    action: "Söndürücüyü boşaltma noktasına getir.",
    link: "/tanker", linkLabel: "Olayı İncele",
  },
  {
    no: 16, cat: "tanker_safety", sev: "warning", status: "closed", at: at(14, 24, 51),
    cam: "CAM-11 · Tanker Boşaltma Alanı", img: img("bosaltma-basinda-personel-yok"), plate: "34 TNK 905", chain: "tanker-1",
    title: "Boşaltma Başında Personel Yok",
    lines: ["Boşaltma sürerken alan 04:12 boyunca personelsiz", "Şoför araç kabininde"],
    facts: [["Personelsiz süre", "04:12"], ["Şoför", "KABİNDE"], ["Boşaltma", "AKTİF"]],
    detail: "Boşaltma sürerken istasyon personeli alandan ayrıldı; tanker şoförü kabinde bekledi. Alan 4 dakikadan uzun süre gözetimsiz kaldı.",
    action: "Boşaltma süresince bir personel alanda kalmalı.",
    link: "/tanker", linkLabel: "Olayı İncele",
  },
  {
    no: 17, cat: "tanker", sev: "info", status: "closed", at: at(14, 46, 33),
    cam: "CAM-12 · Tanker Plaka", img: img("tanker-bosaltma-tamamlandi"), plate: "34 TNK 905", chain: "tanker-1",
    title: "Tanker Boşaltma Tamamlandı",
    lines: ["Boşaltma süresi 36 dk · istasyonda 44 dk", "Çıkış 14:46"],
    facts: [["Plaka", "34 TNK 905"], ["Boşaltma", "36 dk"], ["İstasyonda", "44 dk"], ["Çıkış", "14:46:33"]],
    detail: "Tanker 14:02'de girdi, boşaltma 14:09–14:45 arasında 36 dakika sürdü, 14:46'da istasyondan çıktı.",
    action: "—",
    link: "/tanker", linkLabel: "Olayı İncele",
  },

  // 🔥 Yangın
  {
    no: 18, cat: "fire", sev: "critical", status: "new", at: at(18, 36, 12),
    cam: "CAM-10 · Saha Genel · Kanopi", img: img("pompa-adasinda-duman-tespit-edildi"), pump: "P3",
    title: "Pompa Adasında Duman Tespit Edildi",
    lines: ["Ada 2 · P3 yanında duman · güven %91", "Panel + mobil + WhatsApp bildirimi gönderildi"],
    facts: [["Alan", "Pompa Adası 2"], ["Tespit", "DUMAN"], ["Güven", "%91"], ["Bildirim", "Panel · Mobil · WhatsApp"]],
    detail: "Ada 2'de P3 yanında duman tespit edildi (sigara içen müşteri). Sistem 3 saniye içinde yetkililere bildirim gönderdi ve kanıt klibi kaydetti.",
    action: "Sahaya müdahale et; pompa adasında sigara içilmesini engelle.",
    link: "/fire", linkLabel: "Olayı İncele",
  },
  {
    no: 19, cat: "fire", sev: "critical", status: "closed", at: at(12, 51, 7),
    cam: "CAM-15 · Market Arkası", img: img("market-arkasinda-alev-belirtisi"),
    title: "Market Arkasında Alev Belirtisi",
    lines: ["Çöp konteyneri yanında alev · güven %88", "Personel 1 dk 40 sn'de müdahale etti"],
    facts: [["Alan", "Market Arkası"], ["Tespit", "ALEV"], ["Güven", "%88"], ["Müdahale", "01:40"]],
    detail: "Market arkasındaki çöp konteyneri yanında küçük çaplı alev tespit edildi. Personel söndürücü ile 1 dk 40 sn'de müdahale etti.",
    action: "Çöp alanını yanıcı atıklardan arındır.",
    link: "/fire", linkLabel: "Olayı İncele",
  },

  // ⛔ Yasaklı alan & gece
  {
    no: 20, cat: "restricted", sev: "critical", status: "new", at: at(16, 58, 30),
    cam: "CAM-13 · Tank Sahası", img: img("tank-sahasina-yetkisiz-giris"), track: "Track 233",
    title: "Tank Sahasına Yetkisiz Giriş",
    lines: ["Track 233 · tank sahası ROI içine girdi", "Bekleme 02:14 · personel değil"],
    facts: [["Alan", "Tank Sahası"], ["Kişi", "Track 233"], ["Bekleme", "02:14"], ["Yelek", "YOK"]],
    detail: "Yelek giymeyen bir kişi tank sahası (sanal sınır) içine girdi ve 2 dakikadan uzun süre kaldı.",
    action: "Vardiya sorumlusu kişiyi alandan çıkarsın.",
    link: "/restricted", linkLabel: "Olayı İncele",
  },
  {
    no: 21, cat: "restricted", sev: "warning", status: "closed", at: at(15, 37, 4),
    cam: "CAM-16 · Depo", img: img("depoya-yetkisiz-giris"), track: "Track 157",
    title: "Depoya Yetkisiz Giriş",
    lines: ["Track 157 · depo kapısından giriş", "Kapı 06:20 açık kaldı"],
    facts: [["Alan", "Depo"], ["Kişi", "Track 157"], ["Kapı açık", "06:20"]],
    detail: "Bir müşteri depo kapısından içeri girdi; kapı 6 dakikadan uzun süre açık kaldı.",
    action: "Depo kapısını kilitli tut.",
    link: "/restricted", linkLabel: "Olayı İncele",
  },
  {
    no: 22, cat: "night", sev: "critical", status: "review", at: at(3, 12, 44),
    cam: "CAM-15 · Market Arkası", img: img("mesai-disi-supheli-bekleme"), plate: "OKUNAMADI",
    title: "Mesai Dışı Şüpheli Bekleme",
    lines: ["03:12 · market arkasında araç + 2 kişi", "Bekleme 11:40 · plaka okunamadı"],
    facts: [["Saat", "03:12:44"], ["Araç", "1"], ["Kişi", "2"], ["Bekleme", "11:40"], ["Plaka", "OKUNAMADI"]],
    detail: "Gece 03:12'de market arkasına farları kapalı bir araç girdi; 2 kişi 11 dakikadan uzun süre depo kapısı çevresinde bekledi.",
    action: "Kanıt klibini güvenlik birimiyle paylaş.",
    link: "/restricted", linkLabel: "Olayı İncele",
  },

  // 📋 Saha düzeni
  {
    no: 23, cat: "order", sev: "warning", status: "new", at: at(16, 21, 15),
    cam: "CAM-06 · Pompa Adası 2 · Karşı", img: img("pompaya-mont-asilmis"), pump: "P4",
    title: "Pompaya Mont / Bez Asılmış",
    lines: ["P4 · pompa gövdesine mont asıldı", "Süre 2 sa 19 dk"],
    facts: [["Pompa", "P4"], ["Nesne", "MONT"], ["Süre", "2:19"]],
    detail: "P4 pompa gövdesine bir mont asıldı ve 2 saatten uzun süredir orada duruyor.",
    action: "Montu kaldır; ekipman üzerine eşya asılmasını engelle.",
    link: "/site-order", linkLabel: "Olayı İncele",
  },
  {
    no: 24, cat: "order", sev: "warning", status: "new", at: at(18, 28, 40),
    cam: "CAM-07 · Pompa Adası 3", img: img("personel-pompa-dibinde-oturuyor"), pump: "P6", staff: "S-04",
    title: "Personel Pompa Dibinde Oturuyor",
    lines: ["S-04 · P6 dibinde 07:52 oturdu", "Aynı anda P5'te araç bekliyor"],
    facts: [["Personel", "S-04"], ["Pompa", "P6"], ["Süre", "07:52"]],
    detail: "S-04 P6 dibinde yaklaşık 8 dakika oturdu; aynı anda P5'te hizmet bekleyen araç vardı.",
    action: "Personeli uyar.",
    link: "/site-order", linkLabel: "Olayı İncele",
  },

  // 💸 Drive-off
  {
    no: 25, cat: "driveoff", sev: "warning", status: "verified", at: at(17, 52, 3),
    cam: "CAM-03 · Pompa Adası 1", img: img("yakit-alimi-tamamlandi-odeme-bekleniyor"), pump: "P2", plate: "06 BZK 341", amount: 2850, chain: "driveoff-1",
    title: "Yakıt Alımı Tamamlandı — Ödeme Bekleniyor",
    lines: ["P2 · 2.850 TL dolum · sürücü araçta kaldı", "Markete giriş yok"],
    facts: [["Pompa", "P2"], ["Tutar", "2.850 TL"], ["Plaka", "06 BZK 341"], ["Market girişi", "YOK"]],
    detail: "P2'de 2.850 TL'lik dolum tamamlandı. Sürücü araçtan inmedi ve kasaya gitmedi.",
    action: "Pompacı ödemeyi teyit etsin.",
    link: "/driveoff", linkLabel: "Olayı İncele",
  },
  {
    no: 26, cat: "driveoff", sev: "critical", status: "verified", at: at(17, 53, 21),
    cam: "CAM-02 · Çıkış / Plaka", img: img("odemeden-kacma-drive-off"), pump: "P2", plate: "06 BZK 341", amount: 2850, chain: "driveoff-1",
    title: "Ödemeden Kaçma — Drive-Off",
    lines: ["06 BZK 341 · ödeme yapmadan çıkış", "Tutar 2.850 TL · POS eşleşmesi YOK"],
    facts: [["Plaka", "06 BZK 341"], ["Tutar", "2.850 TL"], ["POS", "ÖDEME YOK"], ["Çıkış", "17:53:21"]],
    detail: "P2'den dolum yapan araç ödeme yapmadan istasyondan çıktı. Plaka çıkış kamerasında okundu, POS kaydı ile eşleşme bulunamadı.",
    action: "Kanıt paketini (plaka + klip) emniyete ilet.",
    link: "/driveoff", linkLabel: "Olayı İncele",
  },

  // 🛒 Müşteri & market
  {
    no: 27, cat: "market", sev: "warning", status: "new", at: at(18, 18, 9),
    cam: "CAM-18 · Market Kasa 1", img: img("kasa-kuyrugu-esik-ustu"),
    title: "Kasa Kuyruğu Eşik Üstü",
    lines: ["Kasa 1 · 6 kişi kuyrukta · bekleme 04:20", "Kasa 2 kapalı"],
    facts: [["Kasa", "Kasa 1"], ["Kuyruk", "6 kişi"], ["Bekleme", "04:20"], ["Kasa 2", "KAPALI"]],
    detail: "Kasa 1'de kuyruk 6 kişiye çıktı; Kasa 2 kapalı. Ortalama bekleme 04:20.",
    action: "Kasa 2'yi aç.",
    link: "/market", linkLabel: "Olayı İncele",
  },
  {
    no: 28, cat: "market", sev: "warning", status: "closed", at: at(16, 33, 52),
    cam: "CAM-19 · Market Kasa 2", img: img("kasa-basinda-personel-yok"),
    title: "Kasa Başında Personel Yok",
    lines: ["Kasa 2 · 03:05 personelsiz", "2 müşteri bekledi"],
    facts: [["Kasa", "Kasa 2"], ["Personelsiz", "03:05"], ["Bekleyen", "2 kişi"]],
    detail: "Kasa 2'de 3 dakika boyunca personel bulunmadı; 2 müşteri kasada bekledi.",
    action: "—",
    link: "/market", linkLabel: "Olayı İncele",
  },
  {
    no: 29, cat: "restroom", sev: "warning", status: "new", at: at(18, 0, 0),
    cam: "CAM-22 · Lavabo Koridoru", img: img("lavabo-temizligi-gecikti"), staff: "S-10",
    title: "Lavabo Temizliği Gecikti",
    lines: ["Planlı temizlik 17:00 · 60 dk gecikme", "Son temizlik 16:02 · 214 kullanım"],
    facts: [["Planlı", "17:00"], ["Son temizlik", "16:02"], ["Gecikme", "60 dk"], ["Kullanım", "214"]],
    detail: "17:00'de yapılması gereken lavabo temizliği yapılmadı. Son temizlikten bu yana 214 kullanım sayıldı.",
    action: "Temizlik personelini lavaboya yönlendir.",
    link: "/restroom", linkLabel: "Olayı İncele",
  },
  {
    no: 30, cat: "customer", sev: "info", status: "closed", at: at(18, 10, 0),
    cam: "CAM-01 · Giriş / Plaka", img: img("ist-yogunluk-zirvesi"),
    title: "İstasyon Yoğunluk Zirvesi",
    lines: ["17:00–18:00 · 132 araç · %84 yakıt aldı", "Markete giriş 96 kişi"],
    facts: [["Giren araç", "132"], ["Yakıt alan", "111 · %84"], ["Markete giren", "96"], ["Alışveriş", "58"]],
    detail: "Günün zirve saati: 132 araç giriş yaptı, 111'i yakıt aldı. Markete 96 kişi girdi, 58'i alışveriş yaptı.",
    action: "—",
    link: "/vehicles", linkLabel: "Olayı İncele",
  },
  {
    no: 31, cat: "carwash", sev: "info", status: "closed", at: at(15, 48, 26),
    cam: "CAM-23 · Oto Yıkama", img: img("oto-yikama-kuyrugu"),
    title: "Oto Yıkama Kuyruğu",
    lines: ["Yıkamada 3 araç kuyrukta", "Ortalama yıkama 08:40"],
    facts: [["Kuyruk", "3 araç"], ["Yıkama süresi", "08:40"], ["Bugün", "41 araç"]],
    detail: "Oto yıkama ünitesinde 3 araç kuyrukta bekliyor; ortalama yıkama süresi 08:40.",
    action: "—",
    link: "/carwash", linkLabel: "Olayı İncele",
  },

  // 📷 Kamera sağlığı
  {
    no: 32, cat: "camera", sev: "warning", status: "new", at: at(17, 4, 12),
    cam: "CAM-07 · Pompa Adası 3", img: img("kamera-acisi-kaydi"),
    title: "Kamera Açısı Kaydı",
    lines: ["CAM-07 · referans sahne eşleşmesi %61", "P6 tabanca alanı kadraj dışında"],
    facts: [["Kamera", "CAM-07"], ["Referans eşleşme", "%61"], ["Analitik", "DÜŞÜK"]],
    detail: "CAM-07'nin açısı kaydı; P6 tabanca bölgesinin bir kısmı kadraj dışında kaldı.",
    action: "Kamerayı referans açıya geri getir.",
    link: "/cameras", linkLabel: "Kamerayı Aç",
  },
  {
    no: 33, cat: "camera", sev: "warning", status: "new", at: at(15, 22, 40),
    cam: "CAM-04 · Pompa Adası 1 · Karşı", img: img("kamera-goruntusu-kirlendi"),
    title: "Kamera Görüntüsü Kirlendi",
    lines: ["CAM-04 · lens kirli · netlik %54", "Kıyafet / yelek analizi etkileniyor"],
    facts: [["Kamera", "CAM-04"], ["Netlik", "%54"], ["Analitik", "DEGRADED"]],
    detail: "CAM-04 lensinde toz ve yakıt buharı kaynaklı kirlenme var; görüntü netliği %54'e düştü.",
    action: "Lensi temizle.",
    link: "/cameras", linkLabel: "Kamerayı Aç",
  },
  {
    no: 34, cat: "camera", sev: "critical", status: "new", at: at(18, 2, 33),
    cam: "CAM-14 · Jeneratör / Elektrik Odası", img: img("kamera-baglantisi-koptu"),
    title: "Kamera Bağlantısı Koptu",
    lines: ["CAM-14 · görüntü yok · 38 dk", "Yasaklı alan izlemesi durdu"],
    facts: [["Kamera", "CAM-14"], ["Durum", "OFFLINE"], ["Süre", "38 dk"]],
    detail: "Jeneratör / elektrik odası kamerası 18:02'den beri görüntü göndermiyor.",
    action: "Kamera kablosu ve PoE switch portunu kontrol et.",
    link: "/cameras", linkLabel: "Kamerayı Aç",
  },
];

export const INCIDENTS: Incident[] = LIST.map((x) => ({ ...x, id: `INC-${5100 + x.no}` }));

export const incidentById = (id: string) => INCIDENTS.find((i) => i.id === id);
export const incidentByNo = (no: number) => INCIDENTS.find((i) => i.no === no)!;
export const incByCat = (...cats: Cat[]) => INCIDENTS.filter((i) => cats.includes(i.cat));
export const chainOf = (i: Incident) => (i.chain ? INCIDENTS.filter((x) => x.chain === i.chain).sort((a, b) => a.at.getTime() - b.at.getTime() || a.no - b.no) : [i]);
