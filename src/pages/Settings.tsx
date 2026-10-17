import { useState } from "react";
import { BellRing, Database, Lock, PlugZap, Save, SlidersHorizontal, Users, Video } from "lucide-react";
import { DEMO_ROLES } from "../auth";
import { StateBox, Tabs } from "../components/kit";
import { Badge, Btn, Card, CardHead, PageHead } from "../components/ui";
import { CAMERAS, STATION } from "../data/station";
import { cx } from "../lib/util";

type Tab = "sla" | "notif" | "integr" | "cams" | "users" | "privacy";

const SLA_DEFAULT = [
  { k: "Hizmet süresi hedefi", v: 270, u: "sn" },
  { k: "Personel karşılama", v: 60, u: "sn" },
  { k: "Pompa işgali eşiği", v: 180, u: "sn" },
  { k: "Pompa kuyruğu uyarı", v: 4, u: "araç" },
  { k: "Kasa kuyruğu uyarı", v: 5, u: "kişi" },
  { k: "Araç / personel kritik", v: 22, u: "araç" },
  { k: "Yasaklı alan bekleme", v: 30, u: "sn" },
  { k: "Şüpheli bekleme (gece)", v: 180, u: "sn" },
  { k: "Boşaltma personelsiz", v: 60, u: "sn" },
  { k: "Lavabo temizlik gecikme", v: 20, u: "dk" },
  { k: "Pompa dibinde oturma", v: 120, u: "sn" },
  { k: "Yangın / duman güven", v: 80, u: "%" },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={cx("relative h-5 w-9 shrink-0 rounded-full transition", on ? "bg-accent" : "bg-panel3")}>
      <span className={cx("absolute top-0.5 size-4 rounded-full bg-white shadow transition-all", on ? "left-[18px]" : "left-0.5")} />
    </button>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("sla");
  const [sla, setSla] = useState(SLA_DEFAULT);
  const [saved, setSaved] = useState(false);
  const [chan, setChan] = useState({ panel: true, push: true, mail: true, telegram: false, whatsapp: true });
  const [posTest, setPosTest] = useState<"idle" | "loading" | "ok" | "error">("idle");

  return (
    <div className="fade-up">
      <PageHead title="Ayarlar" sub={`${STATION.full} · SLA eşikleri, bildirimler, entegrasyonlar ve gizlilik`} />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { v: "sla", label: "SLA eşikleri" },
          { v: "notif", label: "Bildirim kanalları" },
          { v: "integr", label: "Pompa / POS entegrasyonu" },
          { v: "cams", label: "Kamera & model" },
          { v: "users", label: "Kullanıcılar" },
          { v: "privacy", label: "Gizlilik" },
        ]}
      />

      {tab === "sla" && (
        <Card>
          <CardHead
            title="SLA ve alarm eşikleri"
            sub="Değişiklikler tüm modüllere ve bildirimlere uygulanır"
            icon={SlidersHorizontal}
            right={
              <Btn
                variant="solid"
                icon={Save}
                onClick={() => {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 1800);
                }}
              >
                {saved ? "Kaydedildi" : "Kaydet"}
              </Btn>
            }
          />
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {sla.map((s, i) => (
              <label key={s.k} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-panel2 px-3 py-2">
                <span className="text-[12.5px] text-dim">{s.k}</span>
                <span className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={s.v}
                    onChange={(e) => setSla((xs) => xs.map((x, j) => (j === i ? { ...x, v: Number(e.target.value) } : x)))}
                    className="num h-7 w-20 rounded-md border border-line bg-panel px-2 text-right text-[12px] text-ink outline-none focus:border-accent/50"
                  />
                  <span className="w-9 text-[11px] text-mute">{s.u}</span>
                </span>
              </label>
            ))}
          </div>
        </Card>
      )}

      {tab === "notif" && (
        <Card>
          <CardHead title="Bildirim kanalları" sub="Kritik olaylar her kanala, uyarılar yalnızca panele" icon={BellRing} />
          <div className="space-y-2">
            {(
              [
                ["panel", "Panel bildirimi + ses", "Tüm önem seviyeleri"],
                ["push", "Mobil push (iOS / Android)", "Kritik + uyarı"],
                ["mail", "E-posta özeti", "Saatlik · kritik anında"],
                ["telegram", "Telegram", "Kritik"],
                ["whatsapp", "WhatsApp Business", "Kritik"],
              ] as const
            ).map(([k, t, d]) => (
              <div key={k} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-panel2 px-3 py-2.5">
                <div>
                  <div className="text-[12.5px] font-semibold text-ink">{t}</div>
                  <div className="text-[11px] text-mute">{d}</div>
                </div>
                <Toggle on={chan[k]} onChange={() => setChan((c) => ({ ...c, [k]: !c[k] }))} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "integr" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHead title="Pompa otomasyonu / POS entegrasyonu" sub="Drive-off ve tabanca durumu eşlemesi için gerekli" icon={PlugZap} right={<Badge tone="ok">Bağlı</Badge>} />
            <dl className="grid grid-cols-2 gap-2 text-[12px]">
              {[
                ["Sağlayıcı", "Demo POS REST"],
                ["Son senkron", "18:39:58"],
                ["Aktif pompa", "8"],
                ["Gecikme", "1,2 sn"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-line bg-panel2 px-3 py-2">
                  <dt className="text-[10px] uppercase text-mute">{k}</dt>
                  <dd className="num font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 flex gap-2">
              <Btn
                onClick={() => {
                  setPosTest("loading");
                  setTimeout(() => setPosTest("ok"), 900);
                }}
              >
                Bağlantıyı test et
              </Btn>
              <Btn
                variant="danger"
                onClick={() => {
                  setPosTest("loading");
                  setTimeout(() => setPosTest("error"), 900);
                }}
              >
                Hata senaryosu
              </Btn>
            </div>
            <div className="mt-3">
              {posTest === "loading" && <StateBox kind="loading" text="POS uç noktası test ediliyor…" />}
              {posTest === "ok" && <StateBox kind="empty" text="Bağlantı başarılı · 8 pompa durumu okundu." />}
              {posTest === "error" && <StateBox kind="error" text="POS yanıt vermedi (timeout 5 sn). Drive-off eşleme geçici olarak kamera-only modda." onRetry={() => setPosTest("idle")} />}
            </div>
          </Card>
          <Card>
            <CardHead title="Diğer entegrasyonlar" icon={Database} />
            <div className="space-y-2">
              {[
                ["NVR / VMS", "RTSP · 24 kanal", "ok"],
                ["Personel vardiya sistemi", "Personel ID eşleme", "ok"],
                ["Telegram / WhatsApp", "Kritik olay grupları", "ok"],
                ["Tank otomasyonu (ATG)", "Tanker dolum eşleme", "warn"],
              ].map(([k, d, s]) => (
                <div key={k} className="flex items-center justify-between rounded-lg border border-line bg-panel2 px-3 py-2">
                  <div>
                    <div className="text-[12.5px] font-semibold text-ink">{k}</div>
                    <div className="text-[11px] text-mute">{d}</div>
                  </div>
                  <Badge tone={s as "ok" | "warn"}>{s === "ok" ? "Aktif" : "Kurulum"}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "cams" && (
        <Card>
          <CardHead title="Kamera → model atamaları" sub={`${CAMERAS.length} kamera`} icon={Video} />
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {CAMERAS.map((c) => (
              <div key={c.id} className="rounded-lg border border-line bg-panel2 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="num text-[12px] font-bold text-ink">{c.id}</span>
                  <span className="truncate pl-2 text-[11px] text-mute">{c.name}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {c.models.map((m) => (
                    <Badge key={m} tone="accent">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "users" && (
        <Card>
          <CardHead title="Kullanıcılar ve roller" icon={Users} />
          <div className="space-y-2">
            {DEMO_ROLES.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border border-line bg-panel2 px-3 py-2">
                <span className="num grid size-8 place-items-center rounded-md bg-accent/15 text-[11px] font-bold text-accent">{r.initials}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold text-ink">
                    {r.name} · <span className="text-mute">{r.title}</span>
                  </div>
                  <div className="truncate text-[11px] text-mute">{r.scope}</div>
                </div>
                <Badge tone={r.allowed === "*" ? "accent" : "mute"}>{r.allowed === "*" ? "Tüm modüller" : `${r.allowed.length} modül`}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "privacy" && (
        <Card>
          <CardHead title="Gizlilik ve KVKK" sub="Operasyon analitiği · kimlik tespiti yok" icon={Lock} />
          <ul className="space-y-2 text-[12.5px] leading-relaxed text-dim">
            <li>• Sistem tarafından üretilen tüm veriler, raporlar ve kanıt görüntüleri müşteriye aittir.</li>
            <li>• Kişi tanıma yapılmaz; demografik analizler anonim istatistik olarak üretilir (KVKK uyumu).</li>
            <li>• Kullanıcı rolleri (Genel Müdürlük, Bölge Müdürü, İstasyon Müdürü, Vardiya Sorumlusu…) müşteri tarafından tanımlanır; her kullanıcı yalnızca yetkili olduğu istasyonları görür.</li>
            <li>• Sistem müşterinin kendi altyapısında (On-Prem) çalışır; Hype Vision müşteri onayı olmadan verilere erişmez.</li>
            <li>• Raporlar web panel ve mobil uygulamada görüntülenir; Excel, CSV ve PDF olarak dışa aktarılabilir.</li>
          </ul>
        </Card>
      )}
    </div>
  );
}
