import { Bath, Car, Fuel, ShoppingBag, ShoppingCart, Truck, UserRound, UsersRound } from "lucide-react";
import { Chart, FlowPath, Legend, RankBars } from "../components/charts";
import { AlertGrid } from "../components/incident";
import { AIInsight, ChartCard, KpiCard, KpiGrid, SectionTitle } from "../components/kit";
import { Card, CardHead, Insight, PageHead, Table, Td, Tr } from "../components/ui";
import { incByCat } from "../data/incidents";
import { STATION } from "../data/station";
import { DAY, HOURLY, MARKET, RESTROOM, SHIFTS, VEHICLE_TYPES } from "../data/series";
import { n } from "../lib/util";

const S = [
  { key: "cars", name: "Giren araç", color: "#18d5e8", type: "area" as const },
  { key: "fueled", name: "Yakıt alan", color: "#16c79a", type: "line" as const },
];

export default function Vehicles() {
  return (
    <div className="fade-up">
      <PageHead title="Araç ve Müşteri Analitiği" sub={`Modül 14 · ${STATION.full} · vardiya bazlı anonim istatistik — kişi tanıma yapılmaz`} />

      <KpiGrid>
        <KpiCard label="Giren araç" value={n(DAY.cars)} icon={Car} />
        <KpiCard label="Yakıt alan" value={n(DAY.fueled)} sub={`%${Math.round((DAY.fueled / DAY.cars) * 100)}`} icon={Fuel} tone="ok" />
        <KpiCard label="Araç başı kişi" value={n(MARKET.perCar, 2)} icon={UsersRound} />
        <KpiCard label="Kadın müşteri oranı" value={`%${MARKET.women}`} icon={UserRound} tone="violet" />
        <KpiCard label="Markete giren" value={n(MARKET.entered)} sub={`${n(MARKET.bought)} alışveriş`} icon={ShoppingCart} />
        <KpiCard label="Tuvalet kullanımı" value={n(RESTROOM.reduce((a, r) => a + r.value, 0))} sub="bay · bayan · çocuk" icon={Bath} />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight>Yakıt alan araçların **%{Math.round((MARKET.entered / DAY.fueled) * 100 / MARKET.perCar)}**'inden en az bir kişi markete girdi; markete girenlerin **%{Math.round((MARKET.bought / MARKET.entered) * 100)}**'i alışveriş yaptı. Akşam vardiyasında araç başı kişi sayısı (1,7) ve kadın müşteri oranı (%27) daha yüksek.</AIInsight>
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard title="Saatlik araç akışı" icon={Car} right={<Legend series={S} />}>
          <Chart data={HOURLY} series={S} height={230} />
        </ChartCard>
        <Card>
          <CardHead title="Araç cinsi" sub="Bugün" icon={Truck} />
          <RankBars items={VEHICLE_TYPES.map((v) => ({ label: v.label, value: v.value }))} />
        </Card>
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr]">
        <Card>
          <CardHead title="Vardiya kırılımı" icon={UsersRound} />
          <Table head={["Vardiya", "Araç", "Yakıt", "Market", "Alışveriş", "Kadın", "Kişi/araç"]}>
            {SHIFTS.map((s) => (
              <Tr key={s.t}>
                <Td className="font-semibold text-ink">{s.t}</Td>
                <Td className="num">{s.cars}</Td>
                <Td className="num">{s.fueled}</Td>
                <Td className="num">{s.market}</Td>
                <Td className="num">{s.buy}</Td>
                <Td className="num">%{s.women}</Td>
                <Td className="num">{n(s.perCar, 1)}</Td>
              </Tr>
            ))}
          </Table>
        </Card>
        <Card>
          <CardHead title="Müşteri hunisi" icon={ShoppingBag} />
          <FlowPath steps={[{ label: "Giren araç", value: DAY.cars }, { label: "Yakıt alan", value: DAY.fueled, tone: "ok" }, { label: "Markete giren", value: MARKET.entered, tone: "violet" }, { label: "Alışveriş", value: MARKET.bought, tone: "warn" }]} />
        </Card>
        <Card>
          <CardHead title="Tuvalet kullanımı" icon={Bath} />
          <RankBars items={RESTROOM.map((r) => ({ label: r.label, value: r.value, tone: r.label === "Bayan" ? "violet" : r.label === "Çocuk" ? "warn" : "accent" }))} />
          <div className="mt-3">
            <Insight>Demografik analizler anonim istatistik olarak üretilir (KVKK).</Insight>
          </div>
        </Card>
      </div>

      <SectionTitle>Müşteri bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("customer")} />
    </div>
  );
}
