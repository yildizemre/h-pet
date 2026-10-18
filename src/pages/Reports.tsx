import { useState } from "react";
import { CalendarDays, Download, FileBarChart, FileSpreadsheet, FileText, Mail, Sparkles } from "lucide-react";
import { Chart, Legend } from "../components/charts";
import { Chip, DataTable, FilterBar, FilterGroup, Seg, StateBox, type Col } from "../components/kit";
import { Badge, Btn, Card, CardHead, PageHead, RichText } from "../components/ui";
import { CAM_STATS } from "../data/station";
import { INCIDENTS } from "../data/incidents";
import { DAY, HOURLY, MARKET, SERVICE, STATIONS, WASH, WEEK, type StationRow } from "../data/series";
import { mmss, n, pct, tl } from "../lib/util";

type Period = "shift" | "week" | "station";
const SECTIONS = ["Pompa", "Hizmet", "Personel", "Tanker", "Güvenlik", "Market", "Kamera"] as const;

const DAY_SUMMARY = [
  `Bugün **${n(DAY.cars)} araç** girdi, **${n(DAY.fueled)}**'i yakıt aldı (${pct((DAY.fueled / DAY.cars) * 100, 1)}).`,
  `Ortalama hizmet süresi **${mmss(SERVICE.avgService)}** (hedef ${mmss(SERVICE.slaTarget)}); SLA başarısı ${pct(SERVICE.slaHit, 1)}.`,
  "**16:00–18:00** arası personel ihtiyacın altında kaldı; zirvede personel başına 33 araç.",
  `Cam silme oranı **${pct((WASH.windows / WASH.served) * 100)}**; ${WASH.selfWash} müşteri camını kendi sildi.`,
  "Tanker boşaltmasında **3 emniyet ihlali** (koni, söndürücü, personel) kayıt altına alındı.",
  `**1 drive-off** (${tl(2850)}), **1 yangın**, **2 yasaklı alan** ve **1 gece güvenliği** olayı oluştu.`,
  "CAM-14 bağlantısı koptu; CAM-07 açı kayması ve CAM-04 kirlenme uyarısı aktif.",
];

const SECTION_ROWS: Record<(typeof SECTIONS)[number], [string, string, string][]> = {
  Pompa: [["Ort. hizmet", mmss(SERVICE.avgService), "+00:08"], ["Pompada kalma", mmss(SERVICE.avgDwell), "+00:11"], ["İşgal uyarısı", "7", "+3"]],
  Hizmet: [["Cam silme", pct((WASH.windows / WASH.served) * 100), "-2 puan"], ["Kendi silen", `${WASH.selfWash}`, "+6"], ["Katkı alan", `${WASH.additive}`, "+4"]],
  Personel: [["Eksik saat", "2", "—"], ["Yelek uyumu", "%86", "-14 puan"], ["Saha düzeni ihlali", "2", "+1"]],
  Tanker: [["Dolum", "1", "—"], ["Süre", "36 dk", "+2 dk"], ["Emniyet ihlali", "3", "+3"]],
  Güvenlik: [["Yangın / duman", "1", "+1"], ["Yasaklı alan", "2", "+1"], ["Drive-off", "1", "+1"]],
  Market: [["Markete giren", n(MARKET.entered), "+%5"], ["Alışveriş", n(MARKET.bought), "+%3"], ["Ort. kasa bekleme", mmss(MARKET.avgWait), "+00:14"]],
  Kamera: [["Online", `${CAM_STATS.online}/${CAM_STATS.total}`, "-1"], ["Analitik sağlıklı", `${CAM_STATS.analyticsHealthy}`, "-3"], ["Uyarı", `${CAM_STATS.warning}`, "+3"]],
};

const scols: Col<StationRow>[] = [
  { key: "name", label: "İstasyon", render: (r) => <span className="font-semibold text-ink">{r.name}</span>, sort: (r) => r.name },
  { key: "c", label: "Araç", render: (r) => <span className="num">{n(r.cars)}</span>, sort: (r) => r.cars, align: "right" },
  { key: "s", label: "Hizmet", render: (r) => <span className="num">{mmss(r.service)}</span>, sort: (r) => r.service, align: "right" },
  { key: "w", label: "Cam silme", render: (r) => <span className="num">%{r.wash}</span>, sort: (r) => r.wash, align: "right" },
  { key: "sf", label: "Emniyet", render: (r) => <span className="num">{r.safety}</span>, sort: (r) => r.safety, align: "right" },
  { key: "sc", label: "Skor", render: (r) => <span className="num font-bold text-ink">{r.score}</span>, sort: (r) => r.score, align: "right" },
];

export default function Reports() {
  const [period, setPeriod] = useState<Period>("shift");
  const [secs, setSecs] = useState<string[]>([...SECTIONS]);
  const [sending, setSending] = useState<"idle" | "loading" | "done">("idle");
  const toggle = (s: string) => setSecs((xs) => (xs.includes(s) ? xs.filter((x) => x !== s) : [...xs, s]));

  return (
    <div className="fade-up">
      <PageHead
        title="Raporlar"
        sub={`Vardiya · pompa · personel · araç bazlı raporlar · ${INCIDENTS.length} olay kanıtıyla`}
        right={
          <>
            <Btn icon={FileSpreadsheet}>Excel</Btn>
            <Btn icon={FileText}>CSV</Btn>
            <Btn icon={Download} variant="solid">
              PDF indir
            </Btn>
          </>
        }
      />

      <FilterBar
        right={
          <Btn
            icon={Mail}
            variant="outline"
            onClick={() => {
              setSending("loading");
              setTimeout(() => setSending("done"), 900);
            }}
          >
            {sending === "loading" ? "Planlanıyor…" : sending === "done" ? "Planlandı · her vardiya sonu" : "E-posta ile planla"}
          </Btn>
        }
      >
        <Seg
          value={period}
          onChange={setPeriod}
          options={[
            { v: "shift", label: "Günlük / vardiya" },
            { v: "week", label: "Haftalık" },
            { v: "station", label: "İstasyon karşılaştırması" },
          ]}
        />
        <FilterGroup label="Bölümler">
          {SECTIONS.map((s) => (
            <Chip key={s} active={secs.includes(s)} onClick={() => toggle(s)}>
              {s}
            </Chip>
          ))}
        </FilterGroup>
      </FilterBar>

      <Card className="mb-4 border-accent/30">
        <CardHead title="AI RAPOR ÖZETİ" sub={period === "shift" ? "17 Ekim 2026 · 06:00–18:40" : period === "week" ? "12–18 Ekim 2026" : "8 istasyon · bugün"} icon={Sparkles} right={<Badge tone="accent">AI ile üretildi</Badge>} />
        {period === "shift" ? (
          <ul className="space-y-1.5">
            {DAY_SUMMARY.map((s) => (
              <li key={s} className="flex gap-2 text-[13px] leading-relaxed text-dim">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                <RichText value={s} />
              </li>
            ))}
          </ul>
        ) : period === "week" ? (
          <RichText className="text-[13px] leading-relaxed text-dim" value="Hafta boyunca **9.525 araç**; en yoğun gün **Cuma** (1.528). Ortalama hizmet süresi en yüksek Cuma (04:41). Olayların **%41'i** 16:00–19:00 arasında oluştu." />
        ) : (
          <RichText className="text-[13px] leading-relaxed text-dim" value="**Tuzla TEM** hizmet süresi ve emniyet ihlallerinde ağın gerisinde. **Başakşehir** ve **Bornova** en yüksek skorlu istasyonlar." />
        )}
      </Card>

      {period === "station" ? (
        <Card>
          <CardHead title="İstasyon karşılaştırması" icon={FileBarChart} />
          <DataTable rows={STATIONS} cols={scols} rowKey={(r) => r.id} initialSort={{ key: "sc", dir: "desc" }} />
        </Card>
      ) : (
        <>
          <Card className="mb-4">
            <CardHead title={period === "shift" ? "Saatlik araç" : "Günlük araç"} icon={CalendarDays} right={<Legend series={[{ key: "a", name: "Araç", color: "#18d5e8" }, { key: "b", name: period === "shift" ? "Yakıt alan" : "Olay", color: "#16c79a" }]} />} />
            {period === "shift" ? (
              <Chart data={HOURLY} series={[{ key: "cars", name: "Araç", color: "#18d5e8", type: "bar", barSize: 20 }, { key: "fueled", name: "Yakıt alan", color: "#16c79a", type: "line" }]} height={240} />
            ) : (
              <Chart data={WEEK} series={[{ key: "cars", name: "Araç", color: "#18d5e8", type: "bar", barSize: 26 }, { key: "events", name: "Olay", color: "#16c79a", type: "line" }]} height={240} />
            )}
          </Card>
          {secs.length ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {SECTIONS.filter((s) => secs.includes(s)).map((s) => (
                <Card key={s}>
                  <div className="mb-2 text-[12.5px] font-bold text-ink">{s}</div>
                  <div className="space-y-1.5">
                    {SECTION_ROWS[s].map(([k, v, d]) => (
                      <div key={k} className="flex items-center justify-between gap-2 text-[12px]">
                        <span className="text-mute">{k}</span>
                        <span className="num font-semibold text-ink">{v}</span>
                        <span className="num w-20 text-right text-[11px] text-mute">{d}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <StateBox kind="empty" text="Rapora en az bir bölüm ekleyin." />
          )}
        </>
      )}
    </div>
  );
}
