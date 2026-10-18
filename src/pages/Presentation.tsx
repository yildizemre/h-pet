/**
 * Sunum modu — Hype Vision × Petrol Ofisi.
 * 1600×900 sabit tuval, pencereye ölçeklenir. ← → / Space ile gezilir, Esc panele döner, F tam ekran.
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutDashboard, Maximize, X } from "lucide-react";
import { incidentByNo, type Incident } from "../data/incidents";
import { hhmmss } from "../lib/util";
import { POLogo } from "../components/Layout";

const CYAN = "#16C6D9";
const ORANGE = "#FA9628";
const W = 1600;
const H = 900;

type Tone = "cyan" | "red" | "amber" | "green";
const TONE_C: Record<Tone, string> = { cyan: CYAN, red: "#FF6B6B", amber: "#F6AE2D", green: "#2BD4A4" };

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

const d = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

function Bg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: "#050F1C" }}>
      <div className="aurora absolute -right-40 -top-56 size-[900px] rounded-full opacity-50 blur-[120px]" style={{ background: "radial-gradient(circle, #0E6E86, transparent 65%)" }} />
      <div className="aurora-2 absolute -bottom-72 -left-52 size-[900px] rounded-full opacity-45 blur-[120px]" style={{ background: "radial-gradient(circle, #0B315A, transparent 65%)" }} />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative size-full overflow-hidden text-white">
      <Bg />
      <div className="relative size-full">{children}</div>
    </div>
  );
}

function Kicker({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div className="rise mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-4 py-1.5 text-[15px] font-semibold tracking-wide text-white/85 backdrop-blur" style={d(delay)}>
      <span className="size-2 rounded-full" style={{ background: CYAN, boxShadow: `0 0 12px ${CYAN}` }} />
      {children}
    </div>
  );
}

function Title({ children, size = 60, delay = 80 }: { children: ReactNode; size?: number; delay?: number }) {
  return (
    <h1 className="rise font-extrabold leading-[1.04] tracking-[-0.03em]" style={{ fontSize: size, ...d(delay) }}>
      {children}
    </h1>
  );
}

function Glass({ children, className = "", delay = 0, glow }: { children: ReactNode; className?: string; delay?: number; glow?: string }) {
  return (
    <div
      className={`rise relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.045] backdrop-blur-md ${className}`}
      style={{ ...d(delay), boxShadow: glow ? `0 20px 60px -30px ${glow}, inset 0 1px 0 rgba(255,255,255,.06)` : "inset 0 1px 0 rgba(255,255,255,.06)" }}
    >
      {glow && <span className="absolute inset-x-6 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${glow}, transparent)` }} />}
      {children}
    </div>
  );
}

/** Animates the numeric part of "2.430 TL", "%96,8", "45 / 48" etc. */
function CountUp({ value }: { value: string }) {
  const m = /^([^\d]*)(\d[\d.,]*)(.*)$/.exec(value);
  const skip = !m || value.includes(":") || /\d\s*\/\s*\d/.test(value) || value.includes("–");
  const target = skip ? 0 : Number(m![2].replace(/\./g, "").replace(",", "."));
  const decimals = skip ? 0 : (m![2].split(",")[1] ?? "").length;
  const [v, setV] = useState(skip ? target : 0);
  const raf = useRef(0);
  useEffect(() => {
    if (skip) return;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [skip, target]);
  if (skip) return <>{value}</>;
  const s = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);
  return (
    <>
      {m![1]}
      {s}
      {m![3]}
    </>
  );
}

function Kpi({ v, l, tone = "cyan", delay = 0, big }: { v: string; l: string; tone?: Tone; delay?: number; big?: boolean }) {
  const c = TONE_C[tone];
  return (
    <Glass delay={delay} glow={c} className="px-6 py-5">
      <div className="font-mono font-bold leading-none tracking-tight" style={{ color: c, fontSize: big ? 48 : 38 }}>
        <CountUp value={v} />
      </div>
      <div className="mt-2.5 text-[15px] leading-snug text-white/65">{l}</div>
    </Glass>
  );
}

/** Notification image; until it is uploaded shows a placeholder with the file name. */
function Img({ inc, className = "" }: { inc: Incident; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div className={`flex aspect-video w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(135deg,#0b1520,#16222f)] text-center ${className}`}>
        <span className="font-mono text-[12px] text-white/50">{inc.cam}</span>
        <span className="px-4 text-[16px] font-semibold text-white/80">{inc.title}</span>
        <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[11px] text-white/55">public{inc.img}</span>
      </div>
    );
  return <img src={inc.img} alt={inc.title} onError={() => setFailed(true)} className={`aspect-video w-full object-cover ${className}`} draggable={false} />;
}

function Pic({ inc, onZoom, className = "", delay = 0, compact }: { inc: Incident; onZoom: (i: Incident) => void; className?: string; delay?: number; compact?: boolean }) {
  return (
    <button
      onClick={() => onZoom(inc)}
      className={`rise group relative block overflow-hidden rounded-[20px] bg-black text-left ring-1 ring-white/12 transition hover:ring-[#16C6D9]/70 ${className}`}
      style={{ ...d(delay), boxShadow: "0 30px 70px -35px rgba(22,198,217,.55)" }}
    >
      <Img inc={inc} className="transition duration-500 group-hover:scale-[1.03]" />
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent ${compact ? "px-3 pb-2 pt-8" : "px-4 pb-3 pt-12"}`}>
        <div className={`flex items-center gap-2 font-bold text-white ${compact ? "text-[12.5px]" : "text-[15px]"}`}>
          <span className="grid size-6 shrink-0 place-items-center rounded-md font-mono text-[12px] text-[#04161a]" style={{ background: CYAN }}>
            {inc.no}
          </span>
          <span className="truncate">{inc.title}</span>
        </div>
        {!compact && (
          <div className="mt-0.5 font-mono text-[12.5px] text-white/65">
            {inc.cam} · {hhmmss(inc.at)}
          </div>
        )}
      </div>
    </button>
  );
}

function Steps({ items, delay = 0 }: { items: string[]; delay?: number }) {
  return (
    <ol className="space-y-2.5">
      {items.map((b, k) => (
        <li key={b} className="rise flex items-start gap-3.5 text-[19px] leading-snug text-white/85" style={d(delay + k * 90)}>
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/[0.06] font-mono text-[13px] font-bold" style={{ color: CYAN }}>
            {k + 1}
          </span>
          <span>{b}</span>
        </li>
      ))}
    </ol>
  );
}

function Output({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div className="rise relative overflow-hidden rounded-[20px] p-[1px]" style={{ ...d(delay), background: `linear-gradient(120deg, ${CYAN}, rgba(22,198,217,.1) 60%, ${ORANGE})` }}>
      <div className="rounded-[19px] bg-[#071A2C] px-5 py-4">
        <div className="mb-1 text-[12px] font-bold uppercase tracking-[0.22em]" style={{ color: CYAN }}>
          Çıktı
        </div>
        <div className="text-[17px] leading-snug text-white/90">{children}</div>
      </div>
    </div>
  );
}

type ModuleProps = {
  kicker: string;
  title: ReactNode;
  lead: string;
  steps: string[];
  kpis: { v: string; l: string; tone?: Tone }[];
  output: ReactNode;
  imgs: number[];
  onZoom: (i: Incident) => void;
};

/** Module slide: story left, hero notification image + thumbnails right. */
function ModuleSlide({ kicker, title, lead, steps, kpis, output, imgs, onZoom }: ModuleProps) {
  const incs = imgs.map(incidentByNo);
  const [hero, ...rest] = incs;
  return (
    <Frame>
      <div className="grid size-full grid-cols-[560px_1fr] gap-14 px-20 pb-[76px] pt-[92px]">
        <div className="flex min-h-0 flex-col">
          <div>
            <Kicker>{kicker}</Kicker>
          </div>
          <Title size={46}>{title}</Title>
          <p className="rise mb-5 mt-4 text-[18px] leading-relaxed text-white/60" style={d(160)}>
            {lead}
          </p>
          <Steps items={steps} delay={240} />
          <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
            {kpis.map((k, i) => (
              <Kpi key={k.l} {...k} delay={420 + i * 80} />
            ))}
          </div>
          <div className="mt-3">
            <Output delay={600}>{output}</Output>
          </div>
        </div>

        {incs.length === 2 ? (
          <div className="grid content-center justify-items-center gap-4">
            {incs.map((i, k) => (
              <Pic key={i.id} inc={i} onZoom={onZoom} className="w-[610px]" delay={200 + k * 120} />
            ))}
          </div>
        ) : incs.length === 4 ? (
          <div className="grid content-center grid-cols-2 gap-4">
            {incs.map((i, k) => (
              <Pic key={i.id} inc={i} onZoom={onZoom} delay={200 + k * 100} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-4">
            <Pic inc={hero} onZoom={onZoom} delay={200} />
            {rest.length > 0 && (
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${rest.length}, minmax(0,1fr))` }}>
                {rest.map((i, k) => (
                  <Pic key={i.id} inc={i} onZoom={onZoom} delay={320 + k * 100} compact />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/*  Slides                                                             */
/* ------------------------------------------------------------------ */

type SlideFn = (zoom: (i: Incident) => void, go: (to: string) => void) => ReactNode;

const PHASES = [
  { t: "Giriş", steps: ["Araç girdi · plaka", "Araç cinsi", "Pompaya yanaştı"], mod: "Araç analitiği · kuyruk", kpi: "Giren araç · bekleme" },
  { t: "Pompa hizmeti", steps: ["Personel karşıladı", "Dolum", "Cam silme · katkı"], mod: "Pompa operasyonu · hizmet", kpi: "Hizmet ≤ 04:30" },
  { t: "Market", steps: ["Markete giriş", "Reyon", "Kasa"], mod: "Market kasa · ısı haritası", kpi: "Kasa kuyruğu · dönüşüm" },
  { t: "Ödeme & çıkış", steps: ["Tabanca kapandı", "Ödeme", "Çıkış · plaka"], mod: "Pompa işgali · drive-off", kpi: "İşgal ≤ 03:00 · ödemesiz çıkış" },
  { t: "Saha güvenliği", steps: ["Tanker boşaltma", "Yangın / duman", "Yasaklı alan"], mod: "Tanker · İSG · gece", kpi: "Emniyet uyumu · anlık bildirim" },
];

const MODULES = [
  ["⛽", "Pompa operasyon & servis süreleri"],
  ["🧽", "Cam silme & hizmet kalitesi"],
  ["🚗", "Pompa kuyruğu & doluluk"],
  ["👷", "Personel – yoğunluk dengesi"],
  ["⏱️", "Pompa işgali uyarısı"],
  ["🦺", "Kıyafet & yelek uyumu"],
  ["🚛", "Tanker dolum takibi"],
  ["🚧", "Tanker boşaltma emniyeti"],
  ["🔥", "Yangın & duman erken uyarı"],
  ["⛔", "Yasaklı alan ihlali"],
  ["📋", "Saha düzeni denetimi"],
  ["🌙", "Gece & kapanış güvenliği"],
  ["💸", "Ödemeden kaçma (drive-off)"],
  ["👥", "Araç & müşteri analitiği"],
  ["🛒", "Market kasa & kuyruk"],
  ["🗺️", "Market ısı haritası"],
  ["🧹", "Lavabo temizlik takibi"],
  ["🚿", "Oto yıkama & hava-su"],
  ["📊", "Merkezi yönetim paneli"],
  ["🏢", "Çoklu istasyon karşılaştırma"],
  ["📷", "Kamera sağlığı"],
  ["📱", "Mobil uygulama"],
];

const SLIDES: { name: string; section: string; render: SlideFn }[] = [
  {
    name: "Kapak",
    section: "",
    render: () => {
      const stack = [26, 14, 3].map(incidentByNo);
      return (
        <Frame>
          <div className="grid size-full grid-cols-[1fr_640px] gap-6 px-24 py-20">
            <div className="flex flex-col">
              <div className="rise flex items-center gap-5">
                <img src="/logo-white.png" alt="Hype Vision" className="h-11 w-auto" />
                <span className="text-[26px] font-light text-white/40">×</span>
                <POLogo height={30} />
              </div>
              <div className="my-auto">
                <Kicker delay={120}>Fuel Station Intelligence · Akaryakıt İstasyonları için Yapay Zekâ</Kicker>
                <Title size={86} delay={200}>
                  İstasyon kameralarınız
                  <br />
                  artık <span className="text-grad">sahayı ölçüyor.</span>
                </Title>
                <p className="rise mt-8 max-w-[760px] text-[23px] leading-relaxed text-white/65" style={d(320)}>
                  Mevcut kameralarınızı yapay zekâ ile analiz ederek saha operasyonunu, hizmet kalitesini, tanker dolumunu, güvenliği ve market performansını ölçülebilir hâle getiriyoruz.
                </p>
                <div className="rise mt-10 flex gap-3" style={d(440)}>
                  {["22 modül · tek sistem", "On-Prem · mevcut kameralar", "Tüm istasyonlara aynı standart"].map((t) => (
                    <span key={t} className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-[16px] font-semibold text-white/80">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rise text-[16px] text-white/45" style={d(520)}>
                Hype Vision · Petrol Ofisi İstasyonları · Ekim 2026
              </div>
            </div>
            <div className="relative" style={{ perspective: 1600 }}>
              {stack.map((inc, k) => (
                <div
                  key={inc.id}
                  className="rise absolute w-[560px] overflow-hidden rounded-[22px] ring-1 ring-white/15"
                  style={{
                    top: 70 + k * 190,
                    left: 40 + (k % 2) * 60,
                    transform: `rotateY(-16deg) rotateX(6deg) rotateZ(${k === 1 ? 2 : -2}deg)`,
                    boxShadow: "0 40px 90px -30px rgba(0,0,0,.8), 0 0 60px -20px rgba(22,198,217,.35)",
                    ...d(300 + k * 150),
                  }}
                >
                  <Img inc={inc} />
                </div>
              ))}
            </div>
          </div>
        </Frame>
      );
    },
  },
  {
    name: "Hype Vision",
    section: "Biz kimiz",
    render: () => (
      <Frame>
        <div className="grid size-full grid-cols-[1fr_560px] gap-14 px-24 pb-[76px] pt-[92px]">
          <div className="flex flex-col">
            <div>
              <Kicker>Hype Vision</Kicker>
            </div>
            <Title size={60}>
              2020'den beri görüntü işleme ile <span className="text-grad">operasyon zekâsı</span>
            </Title>
            <p className="rise mt-6 text-[21px] leading-relaxed text-white/65" style={d(160)}>
              Sahadaki IP kameralardan gelen görüntüyü yapay zekâ ile analiz ediyor; güvenlik, hizmet kalitesi, personel verimliliği ve operasyon süreçlerini otomatikleştiriyoruz. Ham video yerine{" "}
              <b className="text-white">anlamlandırılmış veri</b> üretiyoruz: alarm, metrik, kanıt ve rapor.
            </p>
            <div className="mt-auto grid grid-cols-2 gap-4">
              {[
                ["📹", "Mevcut kameralarınız", "Yeni kamera yok · marka bağımsız (ONVIF / RTSP)"],
                ["🏠", "On-Prem", "Sistem sizin altyapınızda çalışır; kamera adedinden bağımsız"],
                ["🔒", "KVKK uyumlu", "Kişi tanıma yok · demografi anonim istatistik"],
                ["🔗", "Entegrasyon", "Pompa / POS · mobil · Telegram / WhatsApp"],
              ].map(([e, t, x], k) => (
                <Glass key={t} delay={260 + k * 80} className="flex gap-4 p-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/[0.07] text-[24px]">{e}</span>
                  <span>
                    <span className="block text-[19px] font-bold">{t}</span>
                    <span className="mt-1 block text-[15px] leading-snug text-white/60">{x}</span>
                  </span>
                </Glass>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <Kpi v="2020+" l="Saha deneyimi · endüstriyel yapay zekâ" delay={200} big />
            <Kpi v="7/24" l="Otomatik AI denetim — insan gözünün yetmediği yerde" delay={300} big tone="green" />
            <Kpi v="0,1–3 sn" l="Olay anından bildirime tespit süresi" delay={400} big tone="amber" />
            <Glass delay={500} className="p-5 text-[17px] leading-relaxed text-white/70">
              Fabrika ve restoranlarda kurduğumuz platformu <b className="text-white">akaryakıt istasyonu operasyonuna</b> uyarladık.
            </Glass>
          </div>
        </div>
      </Frame>
    ),
  },
  {
    name: "Problem",
    section: "Neden şimdi",
    render: () => (
      <Frame>
        <div className="size-full px-24 pb-[76px] pt-[92px]">
          <Kicker>Neden şimdi</Kicker>
          <Title size={56}>
            Bir istasyonda en pahalı kayıplar <span className="text-grad">görünmez.</span>
          </Title>
          <div className="mt-10 grid grid-cols-4 gap-4">
            {[
              ["⏱️", "Uzayan servis", "Pompada bekleyen araç sıradakini kaçırıyor."],
              ["🚗", "Pompa işgali", "Araç pompada bırakılıp markete gidiliyor."],
              ["👷", "Yanlış personel planı", "Zirve saatte saha eksik, sakin saatte fazla."],
              ["🧽", "Atlanan hizmet", "Cam silme ve katkı teklifi ölçülmüyor."],
              ["🚛", "Tanker emniyeti", "Koni, söndürücü, gözetim kâğıt üstünde kalıyor."],
              ["🔥", "Yangın riski", "Duman ve alev saniyeler içinde fark edilmeli."],
              ["💸", "Drive-off", "Ödemeden çıkan araç vardiya sonunda fark ediliyor."],
              ["📷", "Kör kamera", "Kirlenen ya da kayan kamera fark edilmiyor."],
            ].map(([e, t, x], k) => (
              <Glass key={t} delay={180 + k * 60} className="p-6">
                <div className="text-[34px]">{e}</div>
                <div className="mt-3 text-[21px] font-bold">{t}</div>
                <div className="mt-1.5 text-[15.5px] leading-snug text-white/58">{x}</div>
              </Glass>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-[18px]">
            <Glass delay={700} className="p-5 text-white/55">
              <b className="text-white/85">Manuel denetim —</b> örneklemeli ziyaret, kör noktalar, saatler sonra rapor, kanıt yok.
            </Glass>
            <Glass delay={780} glow={CYAN} className="p-5 text-white/85">
              <b style={{ color: CYAN }}>Hype Vision —</b> 7/24 tam kapsama, anlık bildirim, zaman damgalı kanıt, tüm istasyonlarda aynı KPI.
            </Glass>
          </div>
        </div>
      </Frame>
    ),
  },
  {
    name: "Nasıl çalışır",
    section: "Mimari",
    render: () => (
      <Frame>
        <div className="size-full px-24 pb-[76px] pt-[92px]">
          <Kicker>Mimari</Kicker>
          <Title size={58}>
            Kamera → yapay zekâ → <span className="text-grad">panel → aksiyon</span>
          </Title>
          <div className="relative mt-16">
            <div className="grow-x absolute left-[8%] right-[8%] top-[64px] h-[2px]" style={{ background: `linear-gradient(90deg, ${CYAN}, rgba(22,198,217,.2), ${ORANGE})`, ...d(300) }} />
            <div className="relative grid grid-cols-4 gap-6">
              {[
                ["📹", "Mevcut IP kameralar", "Pompa adaları, tanker alanı, tank sahası, market, kasa, giriş / çıkış", "RTSP / ONVIF"],
                ["🧠", "Hype Vision AI · On-Prem", "Araç & kişi takibi, plaka OCR, servis süresi, yangın / duman, ROI", "İstasyonda işleme"],
                ["🔗", "Pompa / POS entegrasyonu", "Tabanca durumu ve ödeme eşleme; drive-off ve işgal tespiti", "REST API"],
                ["📲", "Panel & bildirim", "Görüntülü bildirim, KPI, rapor · mobil, Telegram, WhatsApp", "Anlık"],
              ].map(([e, t, x, tag], k) => (
                <div key={t} className="flex flex-col items-center text-center">
                  <div className="rise grid size-32 place-items-center rounded-[32px] border border-white/15 bg-[#0A2238] text-[56px]" style={{ ...d(200 + k * 140), boxShadow: `0 0 0 8px #050F1C, 0 0 60px -10px ${CYAN}` }}>
                    {e}
                  </div>
                  <Glass delay={300 + k * 140} className="mt-6 w-full p-6">
                    <div className="text-[22px] font-bold">{t}</div>
                    <div className="mt-2 text-[16px] leading-snug text-white/60">{x}</div>
                    <div className="mt-4 inline-block rounded-full px-3 py-1 text-[13px] font-bold text-[#04161a]" style={{ background: CYAN }}>
                      {tag}
                    </div>
                  </Glass>
                </div>
              ))}
            </div>
          </div>
          <p className="rise mt-12 text-center text-[21px] text-white/60" style={d(900)}>
            Tüm veriler, raporlar ve kanıt görüntüleri <b className="text-white">Petrol Ofisi'ne aittir</b> — Hype Vision onay olmadan erişmez.
          </p>
        </div>
      </Frame>
    ),
  },
  {
    name: "Akış",
    section: "İstasyon akışı",
    render: () => (
      <Frame>
        <div className="size-full px-20 pb-[76px] pt-[92px]">
          <Kicker>Petrol Ofisi istasyonu için düşündüğümüz akış</Kicker>
          <Title size={52}>
            Araç girişinden <span className="text-grad">çıkışa ve saha güvenliğine</span> kadar
          </Title>
          <div className="relative mt-12 grid grid-cols-5 gap-4">
            {PHASES.map((p, i) => (
              <Glass key={p.t} delay={200 + i * 110} glow={i >= 3 ? ORANGE : CYAN} className="flex flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[40px] font-bold leading-none text-white/15">0{i + 1}</span>
                  <span className="text-[23px] font-bold">{p.t}</span>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  {p.steps.map((s) => (
                    <span key={s} className="flex items-center gap-2 rounded-xl bg-black/25 px-3 py-2 text-[16px] text-white/85">
                      <span className="size-1.5 rounded-full" style={{ background: CYAN }} />
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-auto space-y-3 pt-6">
                  <div>
                    <div className="text-[11.5px] font-bold uppercase tracking-[0.2em]" style={{ color: CYAN }}>
                      Modül
                    </div>
                    <div className="text-[16px] text-white/85">{p.mod}</div>
                  </div>
                  <div>
                    <div className="text-[11.5px] font-bold uppercase tracking-[0.2em]" style={{ color: CYAN }}>
                      KPI
                    </div>
                    <div className="text-[16px] text-white/65">{p.kpi}</div>
                  </div>
                </div>
              </Glass>
            ))}
          </div>
        </div>
      </Frame>
    ),
  },
  {
    name: "22 modül",
    section: "Modüller",
    render: () => (
      <Frame>
        <div className="size-full px-20 pb-[76px] pt-[92px]">
          <Kicker>Modül listesi</Kicker>
          <Title size={52}>
            22 modül, <span className="text-grad">tek sistem</span> — ihtiyaca göre paketler
          </Title>
          <div className="mt-10 grid grid-cols-4 gap-3">
            {MODULES.map(([e, t], k) => (
              <div key={t} className="rise flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3" style={d(150 + k * 35)}>
                <span className="font-mono text-[13px] font-bold" style={{ color: CYAN }}>
                  {String(k + 1).padStart(2, "0")}
                </span>
                <span className="text-[20px]">{e}</span>
                <span className="text-[16px] font-semibold text-white/85">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    ),
  },
  {
    name: "Pompa operasyonu",
    section: "Operasyon",
    render: (z) => (
      <ModuleSlide
        onZoom={z}
        kicker="⛽ Pompa operasyon ve servis süreleri"
        title={
          <>
            Her aracın servisi <span className="text-grad">saniye saniye</span>
          </>
        }
        lead="Yanaşma, karşılama, dolum ve tabanca sonrası bekleme araç bazlı ölçülür; hatalı yanaşma ve bekleyen araç anında görünür."
        steps={["P4 · araç yanaşma alanının 1,4 m dışında", "P2 · hizmet süresi 06:42 (hedef 04:30)", "P5 · araç 02:36 bekledi, personel gelmedi"]}
        kpis={[
          { v: "04:34", l: "Ortalama hizmet süresi", tone: "amber" },
          { v: "%92,4", l: "Doğru yanaşma oranı", tone: "green" },
        ]}
        output="Pompa, personel ve vardiya bazlı servis raporu; SLA aşımında vardiya sorumlusuna bildirim."
        imgs={[2, 1, 5]}
      />
    ),
  },
  {
    name: "Pompa işgali",
    section: "Operasyon",
    render: (z) => (
      <ModuleSlide
        onZoom={z}
        kicker="⏱️ Pompa işgali uyarısı"
        title={
          <>
            Pompada bırakılan araç — <span className="text-grad">iki kamerada tek zincir</span>
          </>
        }
        lead="Tabanca kapandıktan sonra araç tanımlı süreden uzun kalırsa sürücü takip edilir ve kasaya bildirim gider."
        steps={["18:12 · P6 yakıt alımı tamamlandı", "18:13 · sürücü Track 418 markete girdi", "18:21 · tabanca sonrası 09:18 işgal, arkada 2 araç"]}
        kpis={[
          { v: "09:18", l: "Tabanca sonrası işgal", tone: "red" },
          { v: "7", l: "Bugünkü işgal uyarısı", tone: "amber" },
        ]}
        output="Kasiyer sürücüyü uyarır; pompa kapasitesi zirve saatte boşa harcanmaz."
        imgs={[3, 4]}
      />
    ),
  },
  {
    name: "Cam silme",
    section: "Hizmet kalitesi",
    render: (z) => (
      <ModuleSlide
        onZoom={z}
        kicker="🧽 Cam silme ve hizmet kalitesi"
        title={
          <>
            Hizmet standardı <span className="text-grad">araç bazlı ölçülür</span>
          </>
        }
        lead="Personelin ilgilendiği araç, sildiği cam, kendi camını silen müşteri ve yakıt katkısı alan araçlar sayılır."
        steps={["S-01 · ön cam 48 sn'de silindi", "P3 · müşteri camını kendisi sildi", "S-03 · araca yakıt katkısı uygulandı"]}
        kpis={[
          { v: "%53", l: "Cam silinen araç", tone: "cyan" },
          { v: "37", l: "Kendi camını silen müşteri", tone: "amber" },
        ]}
        output="Personel ve ada bazlı hizmet kalitesi raporu; eğitim ihtiyacı veriyle belirlenir."
        imgs={[6, 7, 8]}
      />
    ),
  },
  {
    name: "Kuyruk & personel",
    section: "Kuyruk & personel",
    render: (z) => (
      <ModuleSlide
        onZoom={z}
        kicker="🚗 Kuyruk · 👷 Personel – yoğunluk dengesi"
        title={
          <>
            Doğru saatte, <span className="text-grad">doğru sayıda personel</span>
          </>
        }
        lead="Pompa başına kuyruk ve doluluk saatlik ölçülür; sahadaki personel sayısı araç yoğunluğuyla karşılaştırılır."
        steps={["Ada 2 · P3'te 5 araç kuyrukta, Ada 3 boşta", "17:00–18:00 · 4 pompacı · 132 araç", "Öneri: 17–19 arası +2 pompacı"]}
        kpis={[
          { v: "33", l: "Zirvede araç / personel", tone: "red" },
          { v: "%93", l: "P3 doluluk oranı", tone: "amber" },
        ]}
        output="Saatlik ısı haritası ve vardiya planlama önerisi."
        imgs={[10, 9]}
      />
    ),
  },
  {
    name: "Kıyafet & saha düzeni",
    section: "Saha standardı",
    render: (z) => (
      <ModuleSlide
        onZoom={z}
        kicker="🦺 Kıyafet & yelek · 📋 Saha düzeni"
        title={
          <>
            İstasyon standardı <span className="text-grad">her vardiyada</span>
          </>
        }
        lead="Firma kıyafeti ve reflektörlü yelek kontrol edilir; pompaya eşya asma ve pompa dibinde oturma anında raporlanır."
        steps={["S-02 · yeleksiz çalışıyor · 1:56", "S-04 · sivil mont", "P4 · pompaya mont asıldı", "S-04 · P6 dibinde 07:52 oturdu"]}
        kpis={[
          { v: "%86", l: "Yelek uyumu", tone: "amber" },
          { v: "4", l: "Kanıtlı uygunsuzluk", tone: "red" },
        ]}
        output="Zaman damgalı kanıt görüntüsü ile panel, mobil ve WhatsApp bildirimi."
        imgs={[11, 12, 23, 24]}
      />
    ),
  },
  {
    name: "Tanker",
    section: "Tanker dolum",
    render: (z) => (
      <ModuleSlide
        onZoom={z}
        kicker="🚛 Tanker dolum takibi & boşaltma emniyeti"
        title={
          <>
            Tanker girişinden çıkışına — <span className="text-grad">her dakika kayıtlı</span>
          </>
        }
        lead="Geliş / çıkış, plaka ve boşaltma süresi kaydedilir; koni, söndürücü ve personel varlığı boşaltma boyunca izlenir."
        steps={["14:02 · 34 TNK 905 giriş · OCR %98", "14:09 · koni / şerit kurulmadan boşaltma", "14:10 · yangın söndürücü yerinde değil", "14:24 · alan 04:12 personelsiz"]}
        kpis={[
          { v: "36 dk", l: "Boşaltma süresi" },
          { v: "3", l: "Emniyet ihlali", tone: "red" },
        ]}
        output="İstasyon ve tarih bazlı dolum geçmişi; emniyet ihlalinde anlık bildirim."
        imgs={[14, 15, 16, 13]}
      />
    ),
  },
  {
    name: "Yangın",
    section: "Güvenlik & İSG",
    render: (z) => (
      <ModuleSlide
        onZoom={z}
        kicker="🔥 Yangın ve duman erken uyarı"
        title={
          <>
            Duman görüldüğü an <span className="text-grad">herkes haberdar</span>
          </>
        }
        lead="Pompa adaları, tanker alanı, market ve depoda alev ve duman tespit edilir; bildirim saniyeler içinde gider."
        steps={["12:51 · market arkasında alev · güven %88", "Bildirim 3 sn'de panel + mobil + WhatsApp", "Personel 01:40'ta söndürücüyle müdahale etti"]}
        kpis={[
          { v: "3 sn", l: "Tespitten bildirime", tone: "green" },
          { v: "01:40", l: "Müdahale süresi", tone: "amber" },
        ]}
        output="Zaman damgalı kanıt klibi ve yetkililere anlık bildirim."
        imgs={[19]}
      />
    ),
  },
  {
    name: "Yasaklı alan & gece",
    section: "Güvenlik & İSG",
    render: (z) => (
      <ModuleSlide
        onZoom={z}
        kicker="⛔ Yasaklı alan · 🌙 Gece & kapanış güvenliği"
        title={
          <>
            Kısıtlı alanlara <span className="text-grad">sanal sınır</span>
          </>
        }
        lead="Tank sahası, boşaltma alanı, elektrik / jeneratör odası ve depoya giriş; mesai dışı şüpheli bekleme tespit edilir."
        steps={["16:58 · tank sahasına yeleksiz giriş · 02:14", "15:37 · depo kapısı 06:20 açık", "03:12 · market arkasında araç + 2 kişi · 11:40"]}
        kpis={[
          { v: "5", l: "Tanımlı yasaklı alan (ROI)" },
          { v: "3", l: "Bugünkü ihlal", tone: "red" },
        ]}
        output="Giriş ve uzun bekleme uyarısı, kanıt klibi güvenlik birimiyle paylaşılır."
        imgs={[20, 22, 21]}
      />
    ),
  },
  {
    name: "Drive-off",
    section: "Drive-off",
    render: (z) => (
      <ModuleSlide
        onZoom={z}
        kicker="💸 Ödemeden kaçma (drive-off) tespiti"
        title={
          <>
            Ödemeden çıkan araç — <span className="text-grad">plaka ve klip hazır</span>
          </>
        }
        lead="Dolumu tamamlanan araç kasaya uğramadan çıkarsa çıkış kamerası plakayı okur, pompa / POS verisiyle eşleştirilir."
        steps={["17:52 · P2 · 2.850 TL dolum · sürücü araçta", "17:53 · 06 BZK 341 ödeme yapmadan çıktı", "POS eşleşmesi yok · kanıt paketi oluşturuldu"]}
        kpis={[
          { v: "2.850 TL", l: "Risk tutarı", tone: "red" },
          { v: "78 sn", l: "Dolumdan çıkışa" },
        ]}
        output="Plaka + klip kanıt paketi; emniyete iletilmek üzere hazır."
        imgs={[26, 25]}
      />
    ),
  },
  {
    name: "Müşteri & market",
    section: "Müşteri & market",
    render: (z) => (
      <ModuleSlide
        onZoom={z}
        kicker="👥 Araç & müşteri · 🛒 Market · 🧹 Lavabo"
        title={
          <>
            Pompadan markete <span className="text-grad">müşteri hunisi</span>
          </>
        }
        lead="Giren araç, yakıt alan, araç cinsi, markete giren ve alışveriş yapan; kasa kuyruğu, reyon ilgisi ve lavabo temizliği. Kişi tanıma yapılmaz."
        steps={["1.494 araç girdi · %85 yakıt aldı", "Markete 830 kişi · 513 alışveriş", "Kasa 1'de 6 kişi kuyruk · Kasa 2 kapalı", "Lavabo temizliği 60 dk gecikti"]}
        kpis={[
          { v: "%62", l: "Market dönüşüm oranı", tone: "green" },
          { v: "%25", l: "Kadın müşteri oranı" },
        ]}
        output="Vardiya bazlı anonim istatistik; kampanya standı ilgisi ve kasa planlaması."
        imgs={[30, 27, 29, 31]}
      />
    ),
  },
  {
    name: "Kamera sağlığı",
    section: "Kamera sağlığı",
    render: (z) => (
      <ModuleSlide
        onZoom={z}
        kicker="📷 Kamera sağlığı"
        title={
          <>
            Kör kalan kamerayı <span className="text-grad">biz fark ederiz</span>
          </>
        }
        lead="Analizde kullanılan her kamera sürekli kontrol edilir: açı kayması, kararma / kirlenme, bağlantı kopması."
        steps={["18:02 · CAM-14 bağlantısı koptu", "17:04 · CAM-07 açısı kaydı · eşleşme %61", "15:22 · CAM-04 lens kirli · netlik %54"]}
        kpis={[
          { v: "21 / 24", l: "Analitiği sağlıklı kamera" },
          { v: "3", l: "Bugünkü kamera sorunu", tone: "amber" },
        ]}
        output="Teknik ekibe bildirim; kameralar haftalarca kör kalmaz."
        imgs={[34, 32, 33]}
      />
    ),
  },
  {
    name: "Yönetim & mobil",
    section: "Yönetim",
    render: () => (
      <Frame>
        <div className="size-full px-24 pb-[76px] pt-[92px]">
          <Kicker>📊 Merkezi panel · 🏢 Çoklu istasyon · 📱 Mobil</Kicker>
          <Title size={56}>
            Genel müdürlükten vardiyaya <span className="text-grad">herkes kendi ekranında</span>
          </Title>
          <div className="mt-10 grid grid-cols-3 gap-5">
            {[
              ["📊", "Merkezi yönetim paneli", ["Vardiya / pompa / personel / araç raporları", "KPI ve trend analizi", "Geriye dönük denetim ve kanıt", "Excel / CSV / PDF"]],
              ["🏢", "Çoklu istasyon karşılaştırma", ["Aynı KPI seti tüm istasyonlarda", "İstasyon ve bölge sıralaması", "En iyi / en zayıf istasyonlar", "Bölge müdürü özet ekranı"]],
              ["📱", "Mobil uygulama", ["iOS ve Android · anlık push", "İstasyon ve bölge raporları", "Kanıt görüntüsü / klip izleme", "Yetkiye göre görünüm"]],
            ].map(([e, t, xs], k) => (
              <Glass key={t as string} delay={200 + k * 120} glow={k === 1 ? ORANGE : CYAN} className="p-7">
                <div className="text-[40px]">{e}</div>
                <div className="mt-3 text-[24px] font-bold">{t}</div>
                <ul className="mt-4 space-y-2.5">
                  {(xs as string[]).map((x) => (
                    <li key={x} className="flex items-start gap-2.5 text-[17px] text-white/75">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: CYAN }} />
                      {x}
                    </li>
                  ))}
                </ul>
              </Glass>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-4 gap-4">
            {["Genel Müdürlük", "Bölge Müdürü", "İstasyon Müdürü", "Vardiya Sorumlusu"].map((r, k) => (
              <div key={r} className="rise rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-center text-[17px] font-semibold text-white/80" style={d(700 + k * 80)}>
                {r}
              </div>
            ))}
          </div>
        </div>
      </Frame>
    ),
  },
  {
    name: "Veri & KVKK",
    section: "Veri & yetkilendirme",
    render: () => (
      <Frame>
        <div className="grid size-full grid-cols-[1fr_520px] gap-14 px-24 pb-[76px] pt-[92px]">
          <div className="flex flex-col">
            <div>
              <Kicker>Veri, raporlama ve yetkilendirme</Kicker>
            </div>
            <Title size={56}>
              Veri sizin, <span className="text-grad">altyapı sizin.</span>
            </Title>
            <div className="mt-10 space-y-3">
              {[
                "Sistem tarafından üretilen tüm veriler, raporlar ve kanıt görüntüleri müşteriye aittir.",
                "Kullanıcı rolleri ve yetkileri müşteri tarafından tanımlanır; herkes yalnızca yetkili olduğu istasyonları görür.",
                "Raporlar web panel ve mobil uygulamada; Excel, CSV ve PDF olarak dışa aktarılabilir.",
                "Sistem müşterinin kendi altyapısında (On-Prem) çalışır; Hype Vision onay olmadan verilere erişmez.",
                "Kişi tanıma yapılmaz; demografik analizler anonim istatistik olarak üretilir (KVKK uyumu).",
              ].map((t, k) => (
                <div key={t} className="rise flex items-start gap-3.5 text-[19px] leading-snug text-white/80" style={d(200 + k * 90)}>
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/[0.06] text-[14px]" style={{ color: CYAN }}>
                    ✓
                  </span>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <Kpi v="On-Prem" l="Mevcut kamera altyapınız üzerinde" delay={300} big />
            <Kpi v="0" l="Kişi tanıma · yüz verisi" delay={400} big tone="green" />
            <Kpi v="22" l="Modül · kamera adedinden bağımsız" delay={500} big tone="amber" />
          </div>
        </div>
      </Frame>
    ),
  },
  {
    name: "Panele geçiş",
    section: "",
    render: (_z, go) => (
      <Frame>
        <div className="flex size-full flex-col items-center justify-center px-24 text-center">
          <div className="rise flex items-center gap-5">
            <img src="/logo-white.png" alt="Hype Vision" className="h-12 w-auto" />
            <span className="text-[26px] font-light text-white/40">×</span>
            <POLogo height={30} />
          </div>
          <div className="mt-14">
            <Title size={80} delay={150}>
              Şimdi paneli <span className="text-grad">birlikte inceleyelim.</span>
            </Title>
          </div>
          <p className="rise mt-6 text-[22px] text-white/60" style={d(280)}>
            Merkezi panel · Bildirimler · Pompa · Tanker · Yangın · Drive-off · Market · Kamera sağlığı
          </p>
          <div className="rise mt-12 flex gap-4" style={d(400)}>
            <button onClick={() => go("/")} className="rounded-2xl px-9 py-4 text-[21px] font-bold text-[#04161a] transition hover:brightness-110" style={{ background: CYAN, boxShadow: `0 20px 50px -15px ${CYAN}` }}>
              Panele geç →
            </button>
            <button onClick={() => go("/notifications")} className="rounded-2xl border border-white/25 bg-white/[0.04] px-9 py-4 text-[21px] font-bold text-white transition hover:bg-white/10">
              Bildirimlerle başla
            </button>
          </div>
          <div className="rise mt-16 text-[17px] text-white/45" style={d(500)}>
            Hype Vision · Petrol Ofisi İstasyonları · Ekim 2026
          </div>
        </div>
      </Frame>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Player                                                             */
/* ------------------------------------------------------------------ */

function readHash() {
  const m = /^#(\d+)$/.exec(window.location.hash);
  return m ? Math.min(SLIDES.length - 1, Math.max(0, Number(m[1]) - 1)) : 0;
}

export default function Presentation() {
  const nav = useNavigate();
  const [i, setI] = useState(readHash);
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState<Incident | null>(null);

  const go = useCallback((to: string) => nav(to), [nav]);
  const move = useCallback((dlt: number) => setI((x) => Math.min(SLIDES.length - 1, Math.max(0, x + dlt))), []);

  useEffect(() => {
    window.history.replaceState(null, "", `#${i + 1}`);
  }, [i]);

  useEffect(() => {
    const onHash = () => setI(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, (window.innerHeight - 52) / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoom) {
        if (e.key === "Escape") setZoom(null);
        return;
      }
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        move(1);
      } else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) {
        e.preventDefault();
        move(-1);
      } else if (e.key === "Home") setI(0);
      else if (e.key === "End") setI(SLIDES.length - 1);
      else if (e.key === "Escape") nav("/");
      else if (e.key.toLowerCase() === "f") document.documentElement.requestFullscreen?.().catch(() => {});
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, nav, zoom]);

  const s = SLIDES[i];
  const chrome = i > 0 && i < SLIDES.length - 1;

  return (
    <div className="fixed inset-0 flex flex-col bg-[#02070D] text-white">
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "center" }} className="relative shrink-0 overflow-hidden rounded-xl shadow-[0_40px_120px_-40px_rgba(0,0,0,.9)]">
          <div key={i} className="slide-in size-full">
            {s.render(setZoom, go)}
          </div>

          {/* in-slide chrome */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-white/5">
            <div className="h-full transition-all duration-500" style={{ width: `${((i + 1) / SLIDES.length) * 100}%`, background: `linear-gradient(90deg, ${CYAN}, ${ORANGE})` }} />
          </div>
          {chrome && (
            <>
              <div className="pointer-events-none absolute left-20 top-8 flex items-center gap-3">
                <img src="/logo-white.png" alt="" className="h-[22px] w-auto opacity-90" />
                <span className="text-white/30">×</span>
                <POLogo height={16} />
              </div>
              <div className="pointer-events-none absolute right-20 top-8 flex items-center gap-3 font-mono text-[14px] text-white/45">
                <span className="uppercase tracking-[0.18em]">{s.section}</span>
                <span className="text-white/80">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-white/35"> / {SLIDES.length}</span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* control bar */}
      <div className="flex h-[52px] shrink-0 items-center gap-3 border-t border-white/[0.06] bg-[#040C15] px-4">
        <div className="mx-auto flex items-center gap-1.5">
          {SLIDES.map((sl, k) => (
            <button
              key={sl.name}
              title={`${k + 1}. ${sl.name}`}
              onClick={() => setI(k)}
              className="h-1.5 rounded-full transition-all"
              style={{ width: k === i ? 28 : 8, background: k === i ? CYAN : k < i ? "rgba(22,198,217,.45)" : "rgba(255,255,255,.18)" }}
            />
          ))}
        </div>
        <span className="font-mono text-[12px] text-white/50">
          {i + 1} / {SLIDES.length} · {s.name}
        </span>
        <button onClick={() => move(-1)} disabled={i === 0} className="grid size-8 place-items-center rounded-lg bg-white/[0.07] hover:bg-white/15 disabled:opacity-30" aria-label="Önceki">
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => move(1)} disabled={i === SLIDES.length - 1} className="grid size-8 place-items-center rounded-lg bg-white/[0.07] hover:bg-white/15 disabled:opacity-30" aria-label="Sonraki">
          <ChevronRight size={16} />
        </button>
        <button onClick={() => document.documentElement.requestFullscreen?.().catch(() => {})} className="grid size-8 place-items-center rounded-lg bg-white/[0.07] hover:bg-white/15" aria-label="Tam ekran" title="Tam ekran (F)">
          <Maximize size={15} />
        </button>
        <button onClick={() => nav("/")} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12px] font-bold text-[#04161a]" style={{ background: CYAN }}>
          <LayoutDashboard size={14} /> Panele geç
        </button>
      </div>

      {zoom && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/92 p-6 backdrop-blur" onClick={() => setZoom(null)}>
          <img src={zoom.img} alt={zoom.title} className="max-h-[86vh] max-w-full rounded-2xl" />
          <div className="mt-3 text-center text-[15px] font-semibold">
            {zoom.no}. {zoom.title} · {zoom.cam} · {hhmmss(zoom.at)}
          </div>
          <button className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/10" aria-label="Kapat">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
