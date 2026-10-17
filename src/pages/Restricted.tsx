import { DoorOpen, Moon, ScanEye, ShieldBan, Timer } from "lucide-react";
import { AlertGrid } from "../components/incident";
import { AIInsight, KpiCard, KpiGrid, SectionTitle } from "../components/kit";
import { Badge, Card, CardHead, PageHead, Table, Td, Tr } from "../components/ui";
import { incByCat } from "../data/incidents";
import { STATION } from "../data/station";

const ROI = [
  { area: "Tank sahası", cam: "CAM-13", entries: 1, dwell: "02:14", status: "İHLAL" },
  { area: "Tanker boşaltma alanı", cam: "CAM-11", entries: 0, dwell: "—", status: "NORMAL" },
  { area: "Elektrik / jeneratör odası", cam: "CAM-14", entries: 0, dwell: "—", status: "KAMERA OFFLINE" },
  { area: "Depo", cam: "CAM-16", entries: 1, dwell: "06:20", status: "İHLAL" },
  { area: "Market arkası (mesai dışı)", cam: "CAM-15", entries: 1, dwell: "11:40", status: "ŞÜPHELİ" },
];

export default function Restricted() {
  return (
    <div className="fade-up">
      <PageHead title="Yasaklı Alan İhlali ve Gece Güvenliği" sub={`Modül 10 & 12 · ${STATION.full} · sanal sınır (ROI), mesai dışı giriş ve şüpheli bekleme`} />

      <KpiGrid cols="xl:grid-cols-5">
        <KpiCard label="Yasaklı alan girişi" value="2" sub="tank sahası · depo" icon={ShieldBan} tone="danger" alert />
        <KpiCard label="Uzun bekleme" value="1" sub="tank sahası 02:14" icon={Timer} tone="warn" />
        <KpiCard label="Mesai dışı olay" value="1" sub="03:12 · market arkası" icon={Moon} tone="danger" alert />
        <KpiCard label="Tanımlı ROI" value={`${ROI.length}`} icon={ScanEye} />
        <KpiCard label="Açık kalan kapı" value="1" sub="depo · 06:20" icon={DoorOpen} tone="warn" />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight tone="danger">Gece **03:12**'de market arkasına farları kapalı bir araç girdi; 2 kişi depo kapısı çevresinde **11:40** bekledi. Gündüz **16:58**'de yeleksiz bir kişi tank sahasına girdi. **CAM-14** offline olduğu için elektrik odası şu an izlenemiyor.</AIInsight>
      </div>

      <Card className="mb-5">
        <CardHead title="Kısıtlı alanlar" sub="Bugün" icon={ShieldBan} />
        <Table head={["Alan", "Kamera", "Giriş", "En uzun bekleme", "Durum"]}>
          {ROI.map((r) => (
            <Tr key={r.area}>
              <Td className="font-semibold text-ink">{r.area}</Td>
              <Td className="num">{r.cam}</Td>
              <Td className="num">{r.entries}</Td>
              <Td className="num">{r.dwell}</Td>
              <Td><Badge tone={r.status === "NORMAL" ? "ok" : r.status === "KAMERA OFFLINE" ? "warn" : "danger"}>{r.status}</Badge></Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <SectionTitle>Yasaklı alan & gece güvenliği bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("restricted", "night")} />
    </div>
  );
}
