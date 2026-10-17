import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth, type NavKey } from "./auth";
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Incidents from "./pages/Incidents";
import Pumps from "./pages/Pumps";
import ServiceQuality from "./pages/ServiceQuality";
import Queue from "./pages/Queue";
import Staffing from "./pages/Staffing";
import Uniform from "./pages/Uniform";
import Tanker from "./pages/Tanker";
import Fire from "./pages/Fire";
import Restricted from "./pages/Restricted";
import SiteOrder from "./pages/SiteOrder";
import DriveOff from "./pages/DriveOff";
import Vehicles from "./pages/Vehicles";
import Market from "./pages/Market";
import Restroom from "./pages/Restroom";
import CarWash from "./pages/CarWash";
import Cameras from "./pages/Cameras";
import Mobile from "./pages/Mobile";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import Branches from "./pages/Branches";
import NotFound from "./pages/NotFound";

function Guard({ k, children }: { k: NavKey; children: React.ReactNode }) {
  const { can } = useAuth();
  return can(k) ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const page = (k: NavKey, el: React.ReactNode) => <Guard k={k}>{el}</Guard>;

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notifications" element={page("notifications", <Notifications />)} />
        <Route path="/incidents" element={page("incidents", <Incidents />)} />
        <Route path="/pumps" element={page("pumps", <Pumps />)} />
        <Route path="/service-quality" element={page("service", <ServiceQuality />)} />
        <Route path="/queue" element={page("queue", <Queue />)} />
        <Route path="/staffing" element={page("staffing", <Staffing />)} />
        <Route path="/uniform" element={page("uniform", <Uniform />)} />
        <Route path="/tanker" element={page("tanker", <Tanker />)} />
        <Route path="/fire" element={page("fire", <Fire />)} />
        <Route path="/restricted" element={page("restricted", <Restricted />)} />
        <Route path="/site-order" element={page("order", <SiteOrder />)} />
        <Route path="/driveoff" element={page("driveoff", <DriveOff />)} />
        <Route path="/vehicles" element={page("vehicles", <Vehicles />)} />
        <Route path="/market" element={page("market", <Market />)} />
        <Route path="/restroom" element={page("restroom", <Restroom />)} />
        <Route path="/carwash" element={page("carwash", <CarWash />)} />
        <Route path="/cameras" element={page("cameras", <Cameras />)} />
        <Route path="/mobile" element={page("mobile", <Mobile />)} />
        <Route path="/reports" element={page("reports", <Reports />)} />
        <Route path="/settings" element={page("settings", <SettingsPage />)} />
        <Route path="/branches" element={page("branches", <Branches />)} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
