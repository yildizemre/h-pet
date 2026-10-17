import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Ban, Check, CheckCheck, Clock3, Eye, ImageUp, Maximize2, MessageSquarePlus, Sparkles, X } from "lucide-react";
import { STATION } from "../data/station";
import { CAT_META, SEV_META, STATUS_META, chainOf, incidentById, type Incident, type Status } from "../data/incidents";
import { incidentStore, useIncidents } from "../data/store";
import { cx, hhmmss, relTime, tl } from "../lib/util";
import { Drawer, Stat } from "./kit";
import { Badge, Btn, TONE } from "./ui";

/* ------------------------------------------------------------------ */
/*  Shot — the CCTV image of a notification (overlays are baked in)    */
/* ------------------------------------------------------------------ */

export function Shot({
  inc,
  className,
  onClick,
  zoom = true,
}: {
  inc: Incident;
  className?: string;
  onClick?: () => void;
  zoom?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      onClick={onClick}
      className={cx("group relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-black", onClick && "cursor-pointer", className)}
    >
      {failed ? (
        <Placeholder inc={inc} />
      ) : (
        <img src={inc.img} alt={inc.title} decoding="async" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" draggable={false} />
      )}
      {onClick && zoom && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
          <span className="grid size-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm">
            <Maximize2 size={15} />
          </span>
        </span>
      )}
    </div>
  );
}

/** Shown until the CCTV image is uploaded to public/bildirim/. */
function Placeholder({ inc }: { inc: Incident }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-[linear-gradient(135deg,#0b1520,#16222f)] p-2.5 text-white">
      <div className="flex items-center justify-between text-[9.5px] font-bold tracking-wide text-white/70">
        <span className="flex items-center gap-1">
          <span className="rec-dot size-1.5 rounded-full bg-red-500" /> {inc.cam}
        </span>
        <span className="num">17-10-2026 {hhmmss(inc.at)}</span>
      </div>
      <div className="grid place-items-center gap-1 text-center">
        <ImageUp size={20} className="text-white/45" />
        <span className="text-[11px] font-semibold text-white/80">{inc.title}</span>
        <span className="num rounded bg-white/10 px-1.5 py-0.5 text-[9.5px] text-white/60">public{inc.img}</span>
      </div>
      <span />
    </div>
  );
}

/** Fullscreen image viewer. */
export function Lightbox({ inc, onClose }: { inc: Incident; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={onClose}>
      <img src={inc.img} alt={inc.title} className="max-h-[88vh] max-w-full rounded-lg" />
      <div className="mt-3 text-center text-[13px] font-semibold text-white">
        {inc.no}. {inc.title} · {inc.cam} · {hhmmss(inc.at)}
      </div>
      <button className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white" aria-label="kapat">
        <X size={16} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Context: open any incident from anywhere                           */
/* ------------------------------------------------------------------ */

const Ctx = createContext<{ open: (id: string) => void }>({ open: () => {} });
export const useOpenIncident = () => useContext(Ctx).open;

export function IncidentProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const value = useMemo(
    () => ({
      open: (x: string) => {
        incidentStore.markRead(x);
        setId(x);
      },
    }),
    []
  );
  return (
    <Ctx.Provider value={value}>
      {children}
      {id && <IncidentDrawer id={id} onClose={() => setId(null)} onSwitch={setId} />}
    </Ctx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Chain: related notifications of the same story, in time order      */
/* ------------------------------------------------------------------ */

export function ChainStrip({ inc, onPick }: { inc: Incident; onPick: (id: string) => void }) {
  const chain = chainOf(inc);
  if (chain.length < 2) return null;
  return (
    <div>
      <h4 className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-mute">Olay zinciri · {chain.length} kare</h4>
      <div className={cx("grid gap-2", chain.length === 2 ? "grid-cols-2" : chain.length === 3 ? "grid-cols-3" : "grid-cols-4")}>
        {chain.map((c) => (
          <button key={c.id} onClick={() => onPick(c.id)} className="text-left">
            <Shot inc={c} zoom={false} className={cx(c.id === inc.id ? "ring-2 ring-accent" : "opacity-75 hover:opacity-100")} />
            <div className="mt-1 flex items-center gap-1 text-[10.5px]">
              <span className="num font-bold text-ink">{hhmmss(c.at)}</span>
              <span className="truncate text-mute">{c.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Vertical timeline of a chain with thumbnails. */
export function ChainTimeline({ chain, onPick }: { chain: Incident[]; onPick?: (id: string) => void }) {
  return (
    <ol className="relative space-y-3 border-l border-line pl-4">
      {chain.map((c) => {
        const tone = SEV_META[c.sev].tone;
        return (
          <li key={c.id} className="relative">
            <span className="absolute -left-[21px] top-1 size-2.5 rounded-full ring-2 ring-panel" style={{ background: TONE[tone].raw }} />
            <div className="flex gap-3">
              <div className="min-w-0 flex-1">
                <div className="num text-[11px] font-bold text-mute">{hhmmss(c.at)} · {c.cam}</div>
                <div className={cx("text-[13px] font-semibold", c.sev === "critical" ? "text-danger" : "text-ink")}>{c.title}</div>
                {c.lines.map((l) => (
                  <div key={l} className="text-[11.5px] text-dim">
                    {l}
                  </div>
                ))}
              </div>
              <button onClick={onPick ? () => onPick(c.id) : undefined} className="w-44 shrink-0">
                <Shot inc={c} zoom={false} />
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/*  Operator actions                                                   */
/* ------------------------------------------------------------------ */

export function OperatorActions({ id, status }: { id: string; status: Status }) {
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const act = (s: Status) => incidentStore.setStatus(id, s);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Btn variant="solid" icon={CheckCheck} onClick={() => act("verified")} active={status === "verified"}>
          Doğrulandı
        </Btn>
        <Btn icon={Ban} onClick={() => act("false")} active={status === "false"}>
          Yanlış Alarm
        </Btn>
        <Btn icon={Clock3} onClick={() => act("review")} active={status === "review"}>
          İncelemede
        </Btn>
        <Btn icon={Check} onClick={() => act("closed")} active={status === "closed"}>
          Kapat
        </Btn>
        <Btn icon={MessageSquarePlus} variant="outline" onClick={() => setNoteOpen((v) => !v)}>
          Not Ekle
        </Btn>
      </div>
      {noteOpen && (
        <div className="flex gap-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Not yazın…"
            className="h-8.5 min-w-0 flex-1 rounded-lg border border-line bg-panel2 px-3 text-[12px] text-ink outline-none focus:border-accent/50"
          />
          <Btn
            variant="solid"
            onClick={() => {
              if (!note.trim()) return;
              incidentStore.addNote(id, `${note.trim()} — Operatör`);
              setNote("");
              setNoteOpen(false);
            }}
          >
            Kaydet
          </Btn>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Drawer                                                             */
/* ------------------------------------------------------------------ */

export function IncidentDrawer({ id, onClose, onSwitch }: { id: string; onClose: () => void; onSwitch: (id: string) => void }) {
  const all = useIncidents();
  const inc = all.find((i) => i.id === id) ?? (incidentById(id) as (typeof all)[number] | undefined);
  const nav = useNavigate();
  const [big, setBig] = useState(false);
  if (!inc) return null;
  const sev = SEV_META[inc.sev];
  const st = STATUS_META[inc.status];
  const pick = (x: string) => {
    incidentStore.markRead(x);
    onSwitch(x);
  };

  return (
    <Drawer
      open
      onClose={onClose}
      width="max-w-[980px]"
      head={
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <span className="num text-[11px] font-bold text-mute">
            #{inc.no} · {inc.id}
          </span>
          <Badge tone={sev.tone}>{sev.label}</Badge>
          <Badge tone={st.tone}>{st.label}</Badge>
          <Badge tone="mute">
            {CAT_META[inc.cat].emoji} {CAT_META[inc.cat].label}
          </Badge>
        </div>
      }
      title={inc.title}
      sub={`${inc.cam} · ${hhmmss(inc.at)} · ${relTime(inc.at)}`}
    >
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          <Shot inc={inc} onClick={() => setBig(true)} />
          <ChainStrip inc={inc} onPick={pick} />
        </div>

        <div className="space-y-3">
          {inc.amount != null && (
            <div className="rounded-xl border border-danger/35 bg-danger/8 p-3">
              <div className="text-[10.5px] font-bold uppercase tracking-wide text-danger">Risk tutarı</div>
              <div className="num mt-0.5 text-[24px] font-bold text-danger">{tl(inc.amount)}</div>
              <div className="text-[11.5px] text-dim">
                Plaka {inc.plate} · Pompa {inc.pump}
              </div>
            </div>
          )}
          <div className="rounded-xl border border-line bg-panel2 p-3">
            <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide text-mute">Görüntüden okunan</div>
            <dl className="space-y-1">
              {inc.facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 text-[12px]">
                  <dt className="text-mute">{k}</dt>
                  <dd className="num text-right font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="text-[12.5px] leading-relaxed text-dim">{inc.detail}</p>
          {inc.action !== "—" && (
            <div className={cx("rounded-xl px-3 py-2.5 ring-1", TONE.accent.bg, TONE.accent.ring)}>
              <div className="mb-1 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wide text-accent">
                <Sparkles size={11} /> Önerilen aksiyon
              </div>
              <p className="text-[12px] leading-relaxed text-dim">{inc.action}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Incident ID" value={inc.id} />
            <Stat label="İstasyon" value={STATION.name} />
            <Stat label="Kamera" value={inc.cam} />
            <Stat label="Zaman" value={hhmmss(inc.at)} sub="17.10.2026" />
            {inc.pump && <Stat label="Pompa" value={inc.pump} />}
            {inc.plate && <Stat label="Plaka" value={inc.plate} />}
            {inc.staff && <Stat label="Personel" value={inc.staff} />}
            {inc.track && <Stat label="Track ID" value={inc.track} />}
          </div>
        </div>
      </div>

      {inc.notes.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-mute">Operatör notları</h4>
          <div className="space-y-1.5">
            {inc.notes.map((n, i) => (
              <div key={i} className="rounded-lg border border-line bg-panel2 px-3 py-2 text-[12px] text-dim">
                {n}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 border-t border-line pt-4">
        <OperatorActions id={inc.id} status={inc.status} />
        <button
          onClick={() => {
            onClose();
            nav(inc.link);
          }}
          className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-accent hover:underline"
        >
          İlgili modüle git · {CAT_META[inc.cat].label} <ArrowRight size={12} />
        </button>
      </div>
      {big && <Lightbox inc={inc} onClose={() => setBig(false)} />}
    </Drawer>
  );
}

/* ------------------------------------------------------------------ */
/*  AlertCard — notification with image                                */
/* ------------------------------------------------------------------ */

export function AlertCard({ inc, compact, stacked }: { inc: Incident & { unread?: boolean }; compact?: boolean; stacked?: boolean }) {
  const open = useOpenIncident();
  const sev = SEV_META[inc.sev];

  if (stacked)
    return (
      <div className={cx("card overflow-hidden transition hover:border-accent/40", inc.unread && (inc.sev === "critical" ? "border-danger/50" : "border-warn/45"))}>
        <Shot inc={inc} onClick={() => open(inc.id)} className="rounded-none border-0" />
        <div className="p-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="num grid size-5 place-items-center rounded bg-panel3 text-[10px] font-bold text-mute">{inc.no}</span>
            <Badge tone={sev.tone}>{sev.label}</Badge>
            <span className="num text-[11px] font-bold text-ink">{hhmmss(inc.at)}</span>
            {inc.unread && <span className="rec-dot ml-auto size-2 rounded-full bg-danger" />}
          </div>
          <p className="mt-1.5 text-[13.5px] font-bold leading-snug text-ink">{inc.title}</p>
          {inc.lines.map((l, i) => (
            <p key={i} className={cx("text-[11.5px] leading-snug", i === 0 ? "font-semibold text-dim" : "text-mute")}>
              {l}
            </p>
          ))}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="truncate text-[10.5px] text-mute">
              {CAT_META[inc.cat].emoji} {inc.cam}
            </span>
            <Btn size="sm" variant={inc.sev === "critical" ? "danger" : "outline"} onClick={() => open(inc.id)}>
              {inc.linkLabel}
            </Btn>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={cx(
        "relative flex gap-3 rounded-xl border bg-panel2 p-2.5 transition hover:border-accent/40",
        inc.unread ? (inc.sev === "critical" ? "border-danger/45" : "border-warn/40") : "border-line"
      )}
    >
      {inc.unread && <span className={cx("absolute bottom-3 left-0 top-3 w-0.5 rounded-full", inc.sev === "critical" ? "bg-danger" : "bg-warn")} />}
      <button onClick={() => open(inc.id)} className={cx("shrink-0", compact ? "w-32" : "w-44 sm:w-56")}>
        <Shot inc={inc} zoom={false} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={sev.tone}>{sev.label}</Badge>
          <span className="num text-[11px] font-bold text-ink">{hhmmss(inc.at).slice(0, 5)}</span>
          <span className="text-[10.5px] text-mute">· {CAT_META[inc.cat].notif}</span>
        </div>
        <p className="mt-1 text-[13px] font-bold leading-snug text-ink">{inc.title}</p>
        {inc.lines.map((l, i) => (
          <p key={i} className={cx("text-[11.5px] leading-snug", i === 0 ? "font-semibold text-dim" : "text-mute")}>
            {l}
          </p>
        ))}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Btn size="sm" variant={inc.sev === "critical" ? "danger" : "outline"} icon={Eye} onClick={() => open(inc.id)}>
            {inc.linkLabel}
          </Btn>
        </div>
      </div>
    </div>
  );
}

/** Grid of notification cards for a module page. */
export function AlertGrid({ items, cols = "md:grid-cols-2 xl:grid-cols-3" }: { items: Incident[]; cols?: string }) {
  const all = useIncidents();
  const list = items.map((i) => all.find((x) => x.id === i.id)!);
  return (
    <div className={cx("grid grid-cols-1 gap-3", cols)}>
      {list.map((i) => (
        <AlertCard key={i.id} inc={i} stacked />
      ))}
    </div>
  );
}
