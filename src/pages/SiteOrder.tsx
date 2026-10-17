import { Armchair, BellRing, Camera, Shirt } from "lucide-react";
import { AlertGrid } from "../components/incident";
import { AIInsight, KpiCard, KpiGrid, SectionTitle } from "../components/kit";
import { PageHead } from "../components/ui";
import { incByCat } from "../data/incidents";
import { STATION } from "../data/station";

export default function SiteOrder() {
  return (
    <div className="fade-up">
      <PageHead title="Saha Düzeni Denetimi" sub={`Modül 11 · ${STATION.full} · pompa ve ekipman üzerine eşya asma, pompa dibinde oturma`} />

      <KpiGrid cols="xl:grid-cols-4">
        <KpiCard label="Eşya asma tespiti" value="1" sub="P4 · mont · 2:19" icon={Shirt} tone="warn" alert />
        <KpiCard label="Pompa dibinde oturma" value="1" sub="S-04 · P6 · 07:52" icon={Armchair} tone="warn" alert />
        <KpiCard label="Anlık bildirim" value="2" sub="panel · mobil · WhatsApp" icon={BellRing} />
        <KpiCard label="Kanıt görüntüsü" value="2" sub="zaman damgalı" icon={Camera} />
      </KpiGrid>

      <div className="mb-5">
        <AIInsight tone="warn">**P4** pompa gövdesine asılan mont 2 saattir yerinde duruyor. **S-04** P6 dibinde yaklaşık 8 dakika oturdu; aynı anda P5'te hizmet bekleyen bir araç vardı.</AIInsight>
      </div>

      <SectionTitle>Saha düzeni bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("order")} cols="md:grid-cols-2" />
    </div>
  );
}
