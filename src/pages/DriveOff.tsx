import { Banknote, Link2, ScanLine, ShieldCheck } from "lucide-react";
import { ChainTimeline, useOpenIncident } from "../components/incident";
import { AIInsight, KpiCard, KpiGrid } from "../components/kit";
import { Badge, Card, CardHead, PageHead, Table, Td, Tr } from "../components/ui";
import { chainOf, incidentByNo } from "../data/incidents";
import { STATION } from "../data/station";
import { tl } from "../lib/util";

const HISTORY = [
  { date: "17.10.2026 17:53", plate: "06 BZK 341", pump: "P2", amount: 2850, status: "Doğrulandı" },
  { date: "02.10.2026 22:41", plate: "34 FHT 208", pump: "P7", amount: 4120, status: "Tahsil edildi" },
  { date: "21.09.2026 06:12", plate: "OKUNAMADI", pump: "P1", amount: 1340, status: "Emniyete iletildi" },
];

export default function DriveOff() {
  const open = useOpenIncident();
  const chain = chainOf(incidentByNo(26));
  return (
    <div className="fade-up">
      <PageHead title="Ödemeden Kaçma (Drive-off) Tespiti" sub={`Modül 13 · ${STATION.full} · ödeme yapmadan ayrılan araçlar`} />

      <KpiGrid cols="xl:grid-cols-4">
        <KpiCard label="Bugün drive-off" value="1" sub="06 BZK 341 · P2" icon={Banknote} tone="danger" alert />
        <KpiCard label="Risk tutarı" value={tl(2850)} icon={Banknote} tone="danger" />
        <KpiCard label="Plaka kanıtı" value="%100" sub="giriş + çıkış kamerası" icon={ScanLine} tone="ok" />
        <KpiCard label="POS eşleştirme" value="Aktif" sub="entegrasyon gerektirir" icon={Link2} />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight tone="danger">06 BZK 341 plakalı araç 17:52'de P2'de **2.850 TL** dolum yaptı, sürücü araçtan inmedi ve **17:53**'te ödeme yapmadan çıktı. POS kaydı ile eşleşme bulunamadı; plaka ve klip kanıt paketi hazır.</AIInsight>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHead title="Olay zinciri" sub="Dolum → çıkış" icon={ShieldCheck} tone="danger" />
          <ChainTimeline chain={chain} onPick={open} />
        </Card>
        <Card>
          <CardHead title="Drive-off geçmişi" sub="Son 30 gün" icon={Banknote} />
          <Table head={["Tarih", "Plaka", "Pompa", "Tutar", "Durum"]}>
            {HISTORY.map((h) => (
              <Tr key={h.date}>
                <Td className="num">{h.date}</Td>
                <Td className="num font-semibold text-ink">{h.plate}</Td>
                <Td className="num">{h.pump}</Td>
                <Td className="num">{tl(h.amount)}</Td>
                <Td><Badge tone={h.status === "Tahsil edildi" ? "ok" : "warn"}>{h.status}</Badge></Td>
              </Tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
}
