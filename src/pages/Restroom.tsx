import { AlarmClock, Brush, CalendarCheck, Users } from "lucide-react";
import { AlertGrid } from "../components/incident";
import { AIInsight, KpiCard, KpiGrid, SectionTitle } from "../components/kit";
import { Badge, Card, CardHead, Insight, PageHead, Table, Td, Tr } from "../components/ui";
import { incByCat } from "../data/incidents";
import { STATION } from "../data/station";
import { CLEANING, RESTROOM } from "../data/series";

export default function Restroom() {
  const ok = CLEANING.filter((c) => c.ok).length;
  return (
    <div className="fade-up">
      <PageHead title="Lavabo Temizlik Takibi" sub={`Modül 17 · ${STATION.full} · yalnızca giriş koridoru kamerası kullanılır`} />

      <KpiGrid cols="xl:grid-cols-4">
        <KpiCard label="Temizlik girişi" value={`${CLEANING.filter((c) => c.done !== "—").length}`} sub="son 16:02" icon={Brush} />
        <KpiCard label="Çizelgeye uyum" value={`%${Math.round((ok / CLEANING.length) * 100)}`} sub={`${ok}/${CLEANING.length} planlı temizlik`} icon={CalendarCheck} tone="warn" />
        <KpiCard label="Geciken temizlik" value="1" sub="17:00 · 100 dk" icon={AlarmClock} tone="danger" alert />
        <KpiCard label="Kullanım" value={`${RESTROOM.reduce((a, r) => a + r.value, 0)}`} sub="son temizlikten beri 214" icon={Users} />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight tone="warn">17:00 planlı temizlik yapılmadı; son temizlikten bu yana **214 kullanım** sayıldı. 14:00 temizliği 26 dk gecikmeli yapıldı.</AIInsight>
      </div>

      <Card className="mb-5">
        <CardHead title="Temizlik çizelgesi" sub="Planlanan ve tespit edilen giriş" icon={CalendarCheck} />
        <Table head={["Planlanan", "Tespit edilen giriş", "Durum"]}>
          {CLEANING.map((c) => (
            <Tr key={c.plan}>
              <Td className="num font-semibold text-ink">{c.plan}</Td>
              <Td className="num">{c.done}</Td>
              <Td><Badge tone={c.ok ? "ok" : c.done === "—" ? "danger" : "warn"}>{c.ok ? "Zamanında" : c.done === "—" ? "Yapılmadı" : "Gecikmeli"}</Badge></Td>
            </Tr>
          ))}
        </Table>
        <div className="mt-3">
          <Insight>Lavabo içinde kamera yoktur; yalnızca koridordaki giriş hareketi sayılır.</Insight>
        </div>
      </Card>

      <SectionTitle>Lavabo bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("restroom")} />
    </div>
  );
}
