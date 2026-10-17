import { createContext, useContext, useEffect, useMemo, useState } from "react";

/** Route keys used both by the sidebar and by role based access. */
export type NavKey =
  | "dashboard"
  | "notifications"
  | "incidents"
  | "pumps"
  | "service"
  | "queue"
  | "staffing"
  | "uniform"
  | "tanker"
  | "fire"
  | "restricted"
  | "order"
  | "driveoff"
  | "vehicles"
  | "market"
  | "restroom"
  | "carwash"
  | "cameras"
  | "mobile"
  | "reports"
  | "settings"
  | "branches";

export type DemoRole = {
  id: string;
  name: string;
  title: string;
  scope: string;
  email: string;
  initials: string;
  /** "*" means every page */
  allowed: NavKey[] | "*";
};

export const DEMO_ROLES: DemoRole[] = [
  {
    id: "hq",
    name: "Deniz Arslan",
    title: "Genel Müdürlük",
    scope: "Tüm istasyonlar · KPI · karşılaştırma · raporlar",
    email: "genelmudurluk@hypevision.ai",
    initials: "GM",
    allowed: "*",
  },
  {
    id: "region",
    name: "Murat Yıldız",
    title: "Bölge Müdürü",
    scope: "İstanbul Avrupa bölgesi · tüm modüller",
    email: "bolge.avrupa@hypevision.ai",
    initials: "BM",
    allowed: "*",
  },
  {
    id: "station",
    name: "Elif Koç",
    title: "İstasyon Müdürü",
    scope: "Örnek İstasyon · tüm modüller",
    email: "mudur.ornek@hypevision.ai",
    initials: "İM",
    allowed: ["dashboard", "notifications", "incidents", "pumps", "service", "queue", "staffing", "uniform", "tanker", "fire", "restricted", "order", "driveoff", "vehicles", "market", "restroom", "carwash", "cameras", "mobile", "reports", "settings"],
  },
  {
    id: "shift",
    name: "Hasan Öztürk",
    title: "Vardiya Sorumlusu",
    scope: "Pompa · personel · tanker · saha düzeni",
    email: "vardiya.ornek@hypevision.ai",
    initials: "VS",
    allowed: ["dashboard", "notifications", "incidents", "pumps", "service", "queue", "staffing", "uniform", "tanker", "order", "restroom", "cameras", "mobile"],
  },
  {
    id: "security",
    name: "Selin Aksoy",
    title: "Güvenlik & İSG",
    scope: "Yangın · yasaklı alan · drive-off · kanıt merkezi",
    email: "isg.ornek@hypevision.ai",
    initials: "İS",
    allowed: ["dashboard", "notifications", "incidents", "tanker", "fire", "restricted", "order", "driveoff", "cameras", "mobile", "reports"],
  },
];

type Ctx = {
  user: DemoRole | null;
  login: (roleId: string) => void;
  logout: () => void;
  can: (k: NavKey) => boolean;
};

const AuthCtx = createContext<Ctx>(null as unknown as Ctx);

function readRole() {
  try {
    return localStorage.getItem("hvp.role");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [roleId, setRoleId] = useState<string | null>(readRole);

  useEffect(() => {
    try {
      if (roleId) localStorage.setItem("hvp.role", roleId);
      else localStorage.removeItem("hvp.role");
    } catch {
      /* private mode */
    }
  }, [roleId]);

  const user = useMemo(() => DEMO_ROLES.find((r) => r.id === roleId) ?? null, [roleId]);

  const value = useMemo<Ctx>(
    () => ({
      user,
      login: setRoleId,
      logout: () => setRoleId(null),
      can: (k) => (!user ? false : user.allowed === "*" || user.allowed.includes(k)),
    }),
    [user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
