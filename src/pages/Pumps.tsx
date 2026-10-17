import { AlarmClock, Car, Clock3, Fuel, Hourglass, MoveHorizontal, Timer } from "lucide-react";
import { RankBars } from "../components/charts";
import { AlertGrid } from "../components/incident";
import { AIInsight, DataTable, KpiCard, KpiGrid, SectionTitle, type Col } from "../components/kit";
import { Badge, Card, CardHead, PageHead } from "../components/ui";
import { incByCat } from "../data/incidents";
import { PUMPS, PUMP_STATE_TONE, STATION, type Pump } from "../data/station";
import { SERVICE, SERVICE_STAGES } from "../data/series";
import { cx, mmss, n } from "../lib/util";

const OCCUPY_LIMIT = 180;

const cols: Col<Pump>[] = [
  { key: "id", label: "Pompa", render: (r) => <span className="num font-bold text-ink">{r.id}</span>, sort: (r) => r.id },
  { key: "ada", label: "Ada", render: (r) => `Ada ${r.island}` },
  { key: "st", label: "Durum", render: (r) => <Badge tone={PUMP_STATE_TONE[r.state]}>{r.state}</Badge> },
  { key: "v", label: "Araç", render: (r) => <span className="num">{r.vehicles}</span>, sort: (r) => r.vehicles, align: "right" },
  { key: "s", label: "Ort. hizmet", render: (r) => <span className={cx("num", r.service > SERVICE.slaTarget + 60 && "font-semibold text-warn")}>{mmss(r.service)}</span>, sort: (r) => r.service, align: "right" },
  { key: "an", label: "Tabanca sonrası", render: (r) => <span className={cx("num", r.afterNozzle > OCCUPY_LIMIT && "font-bold text-danger")}>{mmss(r.afterNozzle)}</span>, sort: (r) => r.afterNozzle, align: "right" },
  { key: "oa", label: "İşgal uyarısı", render: (r) => <span className={cx("num", r.occupyAlerts > 1 && "text-danger")}>{r.occupyAlerts}</span>, sort: (r) => r.occupyAlerts, align: "right" },
  { key: "bd", label: "Hatalı yanaşma", render: (r) => <span className="num">{r.badDocking}</span>, sort: (r) => r.badDocking, align: "right" },
];

export default function Pumps() {
  return (
    <div className="fade-up">
      <PageHead title="Pompa Operasyon ve Servis Süreleri" sub={`Modül 1 & 5 · ${STATION.full} · araç bazlı servis süreci ve pompa işgali`} />

      <KpiGrid>
        <KpiCard label="Ort. hizmet süresi" value={mmss(SERVICE.avgService)} sub={`hedef ${mmss(SERVICE.slaTarget)}`} icon={Timer} tone="warn" />
        <KpiCard label="Pompada kalma" value={mmss(SERVICE.avgDwell)} sub="yanaşmadan çıkışa" icon={Clock3} />
        <KpiCard label="Tabanca sonrası bekleme" value={mmss(SERVICE.afterNozzle)} sub={`eşik ${mmss(OCCUPY_LIMIT)}`} icon={Hourglass} />
        <KpiCard label="Doğru yanaşma" value={`%${n(SERVICE.docking, 1)}`} sub={`${PUMPS.reduce((a, p) => a + p.badDocking, 0)} hatalı yanaşma`} icon={MoveHorizontal} tone="ok" />
        <KpiCard label="Pompa işgali uyarısı" value={`${PUMPS.reduce((a, p) => a + p.occupyAlerts, 0)}`} sub="P6 · şu an 09:18" icon={AlarmClock} tone="danger" alert />
        <KpiCard label="Hizmet verilen araç" value={n(PUMPS.reduce((a, p) => a + p.vehicles, 0))} icon={Car} />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight tone="warn">
          **P2** ortalama hizmet süresi 06:42'ye kadar çıktı; Ada 2'de tek pompacı iki aracı aynı anda karşılıyor. **P6**'da sürücüler aracı pompada bırakıp markete gidiyor: bugün 3 işgal uyarısı, şu an tabanca sonrası **09:18**.
        </AIInsight>
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-[1fr_1.6fr]">
        <Card>
          <CardHead title="Servis süreci adımları" sub="Araç başı ortalama saniye" icon={Timer} />
          <RankBars items={SERVICE_STAGES.map((s) => ({ label: s.label, value: s.v, tone: s.v > 60 && s.label.startsWith("Tabanca") ? "warn" : "accent" }))} formatter={mmss} />
        </Card>
        <Card>
          <CardHead title="Pompa bazlı servis raporu" sub="Bugün 06:00–18:40" icon={Fuel} />
          <DataTable rows={PUMPS} cols={cols} rowKey={(r) => r.id} />
        </Card>
      </div>

      <SectionTitle>Pompa operasyonu ve işgal bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("pump", "occupy")} />
    </div>
  );
}
