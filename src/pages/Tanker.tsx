import { Clock3, FireExtinguisher, ScanLine, ShieldAlert, Truck, TrafficCone } from "lucide-react";
import { AlertGrid, ChainTimeline, useOpenIncident } from "../components/incident";
import { AIInsight, KpiCard, KpiGrid, SectionTitle } from "../components/kit";
import { Badge, Card, CardHead, PageHead, Table, Td, Tr } from "../components/ui";
import { chainOf, incByCat, incidentByNo } from "../data/incidents";
import { STATION } from "../data/station";
import { TANKERS } from "../data/series";

const CHECKS = [
  { t: "Emniyet konisi / şerit", ok: false, v: "0 / 4 koni" },
  { t: "Yangın söndürücü yerinde", ok: false, v: "Tespit edilmedi" },
  { t: "Boşaltma başında personel", ok: false, v: "04:12 personelsiz" },
  { t: "Boşaltma alanına yetkisiz giriş", ok: true, v: "Giriş yok" },
];

export default function Tanker() {
  const open = useOpenIncident();
  const chain = chainOf(incidentByNo(13));
  return (
    <div className="fade-up">
      <PageHead title="Tanker Dolum ve Boşaltma Emniyeti" sub={`Modül 7 & 8 · ${STATION.full} · geliş / çıkış, plaka, süre ve emniyet kontrolü`} />

      <KpiGrid>
        <KpiCard label="Bugünkü tanker" value="1" sub="34 TNK 905" icon={Truck} />
        <KpiCard label="Geliş / çıkış" value="14:02" unit="→ 14:46" icon={Clock3} />
        <KpiCard label="Boşaltma süresi" value="36" unit="dk" sub="30 gün ort. 34 dk" icon={Clock3} />
        <KpiCard label="Plaka OCR" value="%98" sub="güven" icon={ScanLine} tone="ok" />
        <KpiCard label="Emniyet ihlali" value="3" sub="koni · söndürücü · personel" icon={ShieldAlert} tone="danger" alert />
        <KpiCard label="Uyum (30 gün)" value="%67" sub="6 boşaltmanın 4'ü uygun" icon={TrafficCone} tone="warn" />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight tone="danger">
          34 TNK 905 boşaltmaya **emniyet konisi ve yangın söndürücü olmadan** başladı; ayrıca boşaltma sırasında alan **04:12** boyunca personelsiz kaldı. Bu tanker için son 2 boşaltmada da ihlal kaydı var.
        </AIInsight>
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHead title="Bugünkü dolum · olay zinciri" sub="34 TNK 905 · 14:02 → 14:46" icon={Truck} />
          <ChainTimeline chain={chain} onPick={open} />
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHead title="Emniyet kontrol listesi" sub="Boşaltma süresince sürekli izlenir" icon={FireExtinguisher} tone="danger" />
            <div className="space-y-1.5">
              {CHECKS.map((c) => (
                <div key={c.t} className="flex items-center justify-between gap-2 rounded-lg border border-line bg-panel2 px-3 py-2">
                  <span className="text-[12.5px] text-ink">{c.t}</span>
                  <Badge tone={c.ok ? "ok" : "danger"}>{c.v}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="Dolum geçmişi" sub="İstasyon ve tarih bazlı" icon={Clock3} />
            <Table head={["Tarih", "Plaka", "Yakıt", "Süre", "Emniyet"]}>
              {TANKERS.map((t) => (
                <Tr key={t.date + t.plate}>
                  <Td className="num">{t.date}</Td>
                  <Td className="num font-semibold text-ink">{t.plate}</Td>
                  <Td>{t.fuel}</Td>
                  <Td className="num">{t.dur} dk</Td>
                  <Td><Badge tone={t.safety === "Uygun" ? "ok" : "danger"}>{t.safety}</Badge></Td>
                </Tr>
              ))}
            </Table>
          </Card>
        </div>
      </div>

      <SectionTitle>Tanker bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("tanker", "tanker_safety")} />
    </div>
  );
}
