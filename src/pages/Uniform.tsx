import { Camera, HardHat, Shirt, ShieldCheck } from "lucide-react";
import { AlertGrid } from "../components/incident";
import { AIInsight, KpiCard, KpiGrid, SectionTitle } from "../components/kit";
import { Badge, Card, CardHead, PageHead, Table, Td, Tr } from "../components/ui";
import { incByCat } from "../data/incidents";
import { STAFF, STATION } from "../data/station";

export default function Uniform() {
  const field = STAFF.filter((s) => s.role === "Pompacı" || s.role === "Vardiya Sorumlusu");
  const vest = field.filter((s) => s.vest).length;
  const uni = field.filter((s) => s.uniform).length;
  return (
    <div className="fade-up">
      <PageHead title="Kıyafet ve Yelek Uyumu" sub={`Modül 6 · ${STATION.full} · firma kıyafeti ve reflektörlü yelek kontrolü`} />

      <KpiGrid cols="xl:grid-cols-4">
        <KpiCard label="Yelek uyumu" value={`%${Math.round((vest / field.length) * 100)}`} sub={`${vest}/${field.length} saha personeli`} icon={HardHat} tone="warn" />
        <KpiCard label="Firma kıyafeti uyumu" value={`%${Math.round((uni / field.length) * 100)}`} sub={`${uni}/${field.length}`} icon={Shirt} tone="warn" />
        <KpiCard label="Uygunsuzluk" value="2" sub="S-02 yelek · S-04 mont" icon={ShieldCheck} tone="danger" alert />
        <KpiCard label="Kanıt görüntüsü" value="2" sub="zaman damgalı" icon={Camera} />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight tone="warn">**S-02** vardiya başından beri yeleksiz çalışıyor (1 sa 56 dk). **S-04** firma montu yerine sivil mont giyiyor. İki uygunsuzluk da zaman damgalı kanıt görüntüsüyle kayıtlı.</AIInsight>
      </div>

      <Card className="mb-5">
        <CardHead title="Saha personeli uyum tablosu" icon={Shirt} />
        <Table head={["Personel", "Rol", "Alan", "Firma kıyafeti", "Reflektörlü yelek"]}>
          {field.map((s) => (
            <Tr key={s.id}>
              <Td className="num font-bold text-ink">{s.id}</Td>
              <Td>{s.role}</Td>
              <Td>{s.area}</Td>
              <Td><Badge tone={s.uniform ? "ok" : "danger"}>{s.uniform ? "UYGUN" : "UYUMSUZ"}</Badge></Td>
              <Td><Badge tone={s.vest ? "ok" : "danger"}>{s.vest ? "VAR" : "YOK"}</Badge></Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <SectionTitle>Kıyafet & yelek bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("uniform")} />
    </div>
  );
}
