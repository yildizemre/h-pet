import { useNavigate } from "react-router-dom";
import { ArrowRight, Banknote, BellRing, Car, Clock3, Download, Flame, Fuel, ListOrdered, ShoppingCart, Sparkles, Truck, UsersRound, Video } from "lucide-react";
import { Chart, Legend } from "../components/charts";
import { AlertGrid } from "../components/incident";
import { ChartCard, KpiCard, SectionTitle } from "../components/kit";
import { Badge, Btn, Card, CardHead, PageHead, RichText, TONE } from "../components/ui";
import { CAM_STATS, PUMPS, PUMP_STATE_TONE, STATION } from "../data/station";
import { INCIDENTS } from "../data/incidents";
import { DAY, HOURLY, MARKET, SERVICE, WASH } from "../data/series";
import { cx, mmss, n, pct, tl } from "../lib/util";

const sevCount = (s: string) => INCIDENTS.filter((i) => i.sev === s).length;

export const AI_BRIEF = [
  `Gün boyunca **${INCIDENTS.length} AI bildirimi** üretildi: ${sevCount("critical")} kritik, ${sevCount("warning")} uyarı, ${sevCount("info")} bilgi.`,
  `İstasyona **${n(DAY.cars)} araç** girdi, **${n(DAY.fueled)}**'i yakıt aldı (%${n((DAY.fueled / DAY.cars) * 100, 0)}). Zirve **17:00–18:00**: 132 araç, sahada yalnızca 4 pompacı.`,
  "**Drive-off:** 06 BZK 341 plakalı araç P2'den 2.850 TL yakıt alıp ödeme yapmadan çıktı — plaka ve klip kanıt paketine eklendi.",
  "**Tanker boşaltması** (34 TNK 905) emniyet konisi ve yangın söndürücü olmadan başladı; boşaltma 36 dk sürdü.",
  "**P6'da pompa işgali:** sürücü aracı bırakıp markete gitti, tabanca sonrası 09:18 işgal, arkada 2 araç.",
  "12:51'de **market arkasında alev** tespit edildi; personel 1 dk 40 sn'de müdahale etti.",
  "Kamera sağlığı: **CAM-14** bağlantısı koptu, **CAM-07** açısı kaydı, **CAM-04** lensi kirli.",
];

const ACTIONS = [
  { t: "Tank sahasına yetkisiz giriş kaydını incele", to: "/restricted", tone: "danger" as const },
  { t: "06 BZK 341 drive-off kanıt paketini ilet", to: "/driveoff", tone: "danger" as const },
  { t: "P6'daki aracı pompadan çektir", to: "/pumps", tone: "danger" as const },
  { t: "17:00–19:00 arası +2 pompacı planla", to: "/staffing", tone: "warn" as const },
  { t: "CAM-14 bağlantısını kontrol et", to: "/cameras", tone: "warn" as const },
];

const FLOW = [
  { key: "cars", name: "Giren araç", color: "#18d5e8", type: "bar" as const, barSize: 14 },
  { key: "fueled", name: "Yakıt alan", color: "#16c79a", type: "line" as const },
];

export default function Dashboard() {
  const nav = useNavigate();
  const critical = INCIDENTS.filter((i) => i.sev === "critical").sort((a, b) => b.at.getTime() - a.at.getTime());
  const queue = PUMPS.reduce((a, p) => a + p.queue, 0);

  return (
    <div className="fade-up">
      <PageHead
        title="Merkezi Yönetim Paneli"
        sub={`${STATION.full} · ${STATION.day} · 06:00–18:40 · ${CAM_STATS.total} kamera · 8 pompa`}
        right={
          <>
            <Btn icon={BellRing} variant="outline" onClick={() => nav("/notifications")}>
              {INCIDENTS.length} bildirim
            </Btn>
            <Btn icon={Download} onClick={() => nav("/reports")}>
              Rapor
            </Btn>
          </>
        }
      />

      <div className="relative mb-4 overflow-hidden rounded-2xl border border-accent/25 bg-panel p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(circle, var(--c-accent), transparent 70%)" }} />
        <div className="relative grid gap-5 xl:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
                <Sparkles size={16} />
              </span>
              <span className="text-[14px] font-bold text-ink">HypeVision AI İstasyon Özeti</span>
              <Badge tone="accent">18:40 itibarıyla</Badge>
              <Badge tone="danger">{sevCount("critical")} kritik</Badge>
            </div>
            <ul className="space-y-1.5">
              {AI_BRIEF.map((s, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-dim">
                  <span className={cx("mt-[7px] size-1.5 shrink-0 rounded-full", i === 0 ? "bg-ok" : "bg-accent/60")} />
                  <RichText value={s} />
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-panel2 p-3">
            <div className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-mute">Önerilen aksiyonlar</div>
            <div className="space-y-1.5">
              {ACTIONS.map((a) => (
                <button
                  key={a.t}
                  onClick={() => nav(a.to)}
                  className="group flex w-full items-center gap-2 rounded-lg border border-line bg-panel px-2.5 py-2 text-left text-[12px] font-medium text-ink transition hover:border-accent/40"
                >
                  <span className="size-1.5 shrink-0 rounded-full" style={{ background: TONE[a.tone].raw }} />
                  <span className="min-w-0 flex-1">{a.t}</span>
                  <ArrowRight size={13} className="shrink-0 text-mute transition group-hover:translate-x-0.5 group-hover:text-accent" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
        <KpiCard label="Giren Araç" value={n(DAY.cars)} delta={`+${n(((DAY.cars - DAY.prevCars) / DAY.prevCars) * 100, 1)}%`} good sub="geçen Cumartesi'ye göre" icon={Car} spark={HOURLY.map((h) => ({ v: h.cars }))} onClick={() => nav("/vehicles")} />
        <KpiCard label="Yakıt Alan" value={n(DAY.fueled)} sub={`oran ${pct((DAY.fueled / DAY.cars) * 100, 1)}`} icon={Fuel} tone="ok" spark={HOURLY.map((h) => ({ v: h.fueled }))} onClick={() => nav("/vehicles")} />
        <KpiCard label="Ort. Hizmet Süresi" value={mmss(SERVICE.avgService)} sub={`hedef ${mmss(SERVICE.slaTarget)} · SLA %${n(SERVICE.slaHit, 1)}`} icon={Clock3} tone="warn" onClick={() => nav("/pumps")} />
        <KpiCard label="Anlık Kuyruk" value={`${queue}`} unit="araç" sub="P3'te 5 araç · Ada 2" icon={ListOrdered} tone="warn" onClick={() => nav("/queue")} />
        <KpiCard label="Sahadaki Personel" value="5" unit="/ 6" sub="1 mola · 1 pasif" icon={UsersRound} onClick={() => nav("/staffing")} />
        <KpiCard label="Cam Silme Oranı" value={pct((WASH.windows / WASH.served) * 100, 0)} sub={`${WASH.windows} cam · ${WASH.selfWash} müşteri kendi sildi`} icon={Sparkles} tone="violet" onClick={() => nav("/service-quality")} />
        <KpiCard label="Yangın / Duman" value="1" sub="market arkası alev · müdahale 01:40" icon={Flame} tone="danger" alert onClick={() => nav("/fire")} />
        <KpiCard label="Drive-off" value="1" sub={`${tl(2850)} · 06 BZK 341`} icon={Banknote} tone="danger" alert onClick={() => nav("/driveoff")} />
        <KpiCard label="Tanker Dolum" value="1" sub="36 dk · 2 emniyet ihlali" icon={Truck} tone="warn" onClick={() => nav("/tanker")} />
        <KpiCard label="Markete Giren" value={n(MARKET.entered)} sub={`${n(MARKET.bought)} alışveriş · %${Math.round((MARKET.bought / MARKET.entered) * 100)}`} icon={ShoppingCart} onClick={() => nav("/market")} />
        <KpiCard label="Kamera Sağlığı" value={`${CAM_STATS.analyticsHealthy}`} unit={`/ ${CAM_STATS.total}`} sub="1 offline · 2 uyarı" icon={Video} tone="warn" onClick={() => nav("/cameras")} />
        <KpiCard label="AI Bildirimi" value={`${INCIDENTS.length}`} sub={`${sevCount("critical")} kritik · ${sevCount("warning")} uyarı`} icon={BellRing} onClick={() => nav("/notifications")} />
      </div>

      <SectionTitle right={<button onClick={() => nav("/notifications")} className="text-[11px] font-semibold text-accent">Tüm bildirimler →</button>}>
        Günün kritik bildirimleri · {critical.length}
      </SectionTitle>
      <div className="mb-5">
        <AlertGrid items={critical} cols="md:grid-cols-2 xl:grid-cols-4" />
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard title="Saatlik araç yoğunluğu" sub="Giren araç ve yakıt alan araç · 06:00–23:00" icon={Car} right={<Legend series={FLOW} />}>
          <Chart data={HOURLY} series={FLOW} height={250} />
        </ChartCard>
        <Card>
          <CardHead title="Pompa durumu · canlı" sub="8 pompa · 4 ada" icon={Fuel} />
          <div className="grid grid-cols-2 gap-2">
            {PUMPS.map((p) => (
              <button key={p.id} onClick={() => nav("/pumps")} className={cx("rounded-xl border bg-panel2 p-2.5 text-left transition hover:border-accent/40", p.state === "İŞGAL" ? "border-danger/50" : "border-line")}>
                <div className="flex items-center justify-between gap-1">
                  <span className="num text-[14px] font-bold text-ink">{p.id}</span>
                  <Badge tone={PUMP_STATE_TONE[p.state]}>{p.state}</Badge>
                </div>
                <div className="mt-1 text-[10.5px] text-mute">Ada {p.island} · {p.fuels}</div>
                <div className="mt-1.5 flex justify-between text-[11px]">
                  <span className="text-mute">Kuyruk <b className={cx("num", p.queue >= 3 ? "text-warn" : "text-ink")}>{p.queue}</b></span>
                  <span className="text-mute">Doluluk <b className="num text-ink">%{p.occupancy}</b></span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
