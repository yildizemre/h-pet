import { Car, Droplet, FlaskConical, Sparkles, UserRound } from "lucide-react";
import { Donut, RankBars } from "../components/charts";
import { AlertGrid } from "../components/incident";
import { AIInsight, DataTable, KpiCard, KpiGrid, SectionTitle, type Col } from "../components/kit";
import { Card, CardHead, PageHead } from "../components/ui";
import { incByCat } from "../data/incidents";
import { PUMP_ATTENDANTS, STATION, type Staff } from "../data/station";
import { WASH } from "../data/series";
import { n } from "../lib/util";

const cols: Col<Staff>[] = [
  { key: "id", label: "Personel", render: (r) => <span className="num font-bold text-ink">{r.id}</span> },
  { key: "a", label: "Alan", render: (r) => r.area },
  { key: "v", label: "Baktığı araç", render: (r) => <span className="num">{r.vehicles}</span>, sort: (r) => r.vehicles, align: "right" },
  { key: "w", label: "Sildiği cam", render: (r) => <span className="num">{r.windows}</span>, sort: (r) => r.windows, align: "right" },
  { key: "r", label: "Cam oranı", render: (r) => <span className="num font-semibold text-ink">%{Math.round((r.windows / r.vehicles) * 100)}</span>, sort: (r) => r.windows / r.vehicles, align: "right" },
  { key: "ad", label: "Katkı verilen", render: (r) => <span className="num">{r.additiveSold}</span>, sort: (r) => r.additiveSold, align: "right" },
];

export default function ServiceQuality() {
  const rate = Math.round((WASH.windows / WASH.served) * 100);
  return (
    <div className="fade-up">
      <PageHead title="Cam Silme ve Hizmet Kalitesi" sub={`Modül 2 · ${STATION.full} · araç bazlı cam silme ve yakıt katkı takibi`} />

      <KpiGrid cols="xl:grid-cols-5">
        <KpiCard label="Personelin baktığı araç" value={n(WASH.served)} icon={Car} />
        <KpiCard label="Silinen cam" value={n(WASH.windows)} sub={`%${rate} araç`} icon={Sparkles} tone="violet" />
        <KpiCard label="Kendi camını silen" value={`${WASH.selfWash}`} sub="22'si Ada 2'de" icon={UserRound} tone="warn" />
        <KpiCard label="Katkı alan araç" value={`${WASH.additive}`} sub={`%${Math.round((WASH.additive / WASH.served) * 100)} araç`} icon={FlaskConical} tone="ok" />
        <KpiCard label="Katkı almayan" value={n(WASH.served - WASH.additive)} icon={Droplet} tone="mute" />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight>
          Cam silme oranı **%{rate}**. **S-03** %76 ile en yüksek, **S-02** %36 ile en düşük oranda — S-02 Ada 2'de en yoğun pompalara tek başına bakıyor. Kendi camını silen 37 müşterinin 22'si Ada 2'de.
        </AIInsight>
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-[1fr_1fr_1.6fr]">
        <Card>
          <CardHead title="Cam silme oranı" icon={Sparkles} />
          <div className="grid place-items-center py-2">
            <Donut value={rate} max={100} tone="violet" center={<div><div className="num text-[24px] font-bold text-ink">%{rate}</div><div className="text-[11px] text-mute">araç</div></div>} />
          </div>
        </Card>
        <Card>
          <CardHead title="Kim sildi?" sub="Bugün" icon={UserRound} />
          <RankBars items={[{ label: "Personel sildi", value: WASH.windows, tone: "violet" }, { label: "Müşteri kendi sildi", value: WASH.selfWash, tone: "warn" }, { label: "Silinmedi", value: WASH.served - WASH.windows - WASH.selfWash, tone: "mute" }]} />
        </Card>
        <Card>
          <CardHead title="Personel bazlı hizmet" icon={Car} />
          <DataTable rows={PUMP_ATTENDANTS} cols={cols} rowKey={(r) => r.id} initialSort={{ key: "r", dir: "desc" }} />
        </Card>
      </div>

      <SectionTitle>Hizmet kalitesi bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("wash")} />
    </div>
  );
}
