import { BellRing, Film, LineChart, Lock, Smartphone } from "lucide-react";
import { AIInsight, KpiCard, KpiGrid } from "../components/kit";
import { Badge, Card, CardHead, PageHead } from "../components/ui";
import { Shot } from "../components/incident";
import { INCIDENTS, SEV_META } from "../data/incidents";
import { STATION } from "../data/station";
import { DAY } from "../data/series";
import { hhmm, n } from "../lib/util";

const FEATURES = [
  { icon: BellRing, t: "Anlık bildirim (push)", d: "Kritik olaylar saniyeler içinde telefona düşer." },
  { icon: LineChart, t: "KPI ve trend ekranları", d: "İstasyon ve bölge raporları cepte." },
  { icon: Film, t: "Kanıt görüntüsü / klip", d: "Bildirime dokun, CCTV karesini ve klibi izle." },
  { icon: Lock, t: "Yetkiye göre görünüm", d: "Her kullanıcı yalnızca yetkili olduğu istasyonları görür." },
];

export default function Mobile() {
  const feed = INCIDENTS.filter((i) => i.sev !== "info").sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 6);
  return (
    <div className="fade-up">
      <PageHead title="Mobil Uygulama" sub="Modül 22 · iOS ve Android · bildirimler, raporlar ve kanıt görüntüleri" />

      <KpiGrid cols="xl:grid-cols-4">
        <KpiCard label="Aktif kullanıcı" value="14" sub="GM · bölge · istasyon · vardiya" icon={Smartphone} />
        <KpiCard label="Bugün gönderilen push" value="26" icon={BellRing} tone="accent" />
        <KpiCard label="Ort. okunma süresi" value="48" unit="sn" icon={BellRing} tone="ok" />
        <KpiCard label="İzlenen klip" value="19" icon={Film} />
      </KpiGrid>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="mx-auto w-full max-w-[360px] rounded-[42px] border-[10px] border-[#0d1520] bg-bg p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between px-2 text-[11px] font-bold text-ink">
            <span className="num">18:40</span>
            <span className="h-5 w-24 rounded-full bg-[#0d1520]" />
            <span>5G</span>
          </div>
          <div className="rounded-2xl bg-panel p-3">
            <div className="text-[10px] font-bold uppercase tracking-wide text-mute">{STATION.full}</div>
            <div className="mt-1 grid grid-cols-3 gap-1.5 text-center">
              <div className="rounded-lg bg-panel2 py-1.5"><div className="num text-[14px] font-bold text-ink">{n(DAY.cars)}</div><div className="text-[9px] text-mute">araç</div></div>
              <div className="rounded-lg bg-danger/10 py-1.5"><div className="num text-[14px] font-bold text-danger">{INCIDENTS.filter((i) => i.sev === "critical").length}</div><div className="text-[9px] text-mute">kritik</div></div>
              <div className="rounded-lg bg-panel2 py-1.5"><div className="num text-[14px] font-bold text-ink">04:34</div><div className="text-[9px] text-mute">hizmet</div></div>
            </div>
          </div>
          <div className="mt-2 max-h-[520px] space-y-2 overflow-y-auto">
            {feed.map((i) => (
              <div key={i.id} className="overflow-hidden rounded-2xl bg-panel">
                <Shot inc={i} zoom={false} className="rounded-none border-0" />
                <div className="p-2.5">
                  <div className="flex items-center gap-1.5">
                    <Badge tone={SEV_META[i.sev].tone}>{SEV_META[i.sev].label}</Badge>
                    <span className="num text-[10.5px] text-mute">{hhmm(i.at)}</span>
                  </div>
                  <div className="mt-1 text-[12.5px] font-bold leading-snug text-ink">{i.title}</div>
                  <div className="text-[11px] text-mute">{i.lines[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <AIInsight>Mobil uygulama web panelle aynı veriyi kullanır. Kritik olaylar ayrıca **Telegram / WhatsApp** gruplarına da iletilebilir.</AIInsight>
          <div className="grid gap-3 md:grid-cols-2">
            {FEATURES.map((f) => (
              <Card key={f.t}>
                <CardHead title={f.t} sub={f.d} icon={f.icon} />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
