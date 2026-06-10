import App from "App";
import AdminGuard from "pages/admin/AdminGuard";
import AdminPage from "pages/admin/AdminPage";
import AdminDebugPage from "pages/admin/debug/AdminDebugPage";
import AdminServersPage from "pages/admin/servers/AdminServersPage";
import AdminSubscriptionPage from "pages/admin/subscriptions/AdminSubscriptionPage";
import AdminSubscriptionsPage from "pages/admin/subscriptions/AdminSubscriptionsPage";
import Auth from "pages/auth/Auth";
import AuthGuard from "pages/auth/AuthGuard";
import DashboardPage from "pages/dashboard/DashboardPage";
import AssistsPage from "pages/dashboard/server/AssistsPage";
import BattlesPage from "pages/dashboard/server/BattlesPage";
import DeathsPage from "pages/dashboard/server/DeathsPage";
import JuicyPage from "pages/dashboard/server/JuicyPage";
import KillsPage from "pages/dashboard/server/KillsPage";
import RankingsPage from "pages/dashboard/server/RankingsPage";
import ServerPage from "pages/dashboard/server/ServerPage";
import ServerSubscriptionPage from "pages/dashboard/server/ServerSubscriptionPage";
import SettingsPage from "pages/dashboard/server/SettingsPage";
import TrackPage from "pages/dashboard/server/TrackPage";
import HomePage from "pages/home/HomePage";
import NotFoundPage from "pages/NotFoundPage";
import PremiumLoginGate from "pages/premium/PremiumLoginGate";
import PremiumPage from "pages/premium/PremiumPage";
import SubscriptionsPage from "pages/subscriptions/SubscriptionsPage";
import { createRoutesFromElements, Navigate, Route } from "react-router-dom";

const routes = createRoutesFromElements(
  <>
    <Route path="/auth" element={<Auth />} />
    <Route path="/" element={<App />}>
      <Route index element={<HomePage />} />
      <Route element={<AuthGuard redirectTo="/" />}>
        <Route path="dashboard">
          <Route index element={<DashboardPage />} />
          <Route path=":serverId" element={<ServerPage />}>
            <Route index element={<Navigate to="track" replace={true} />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="kills" element={<KillsPage />} />
            <Route path="assists" element={<AssistsPage />} />
            <Route path="deaths" element={<DeathsPage />} />
            <Route path="juicy" element={<JuicyPage />} />
            <Route path="battles" element={<BattlesPage />} />
            <Route path="rankings" element={<RankingsPage />} />
            <Route path="track" element={<TrackPage />} />
            <Route path="subscription" element={<ServerSubscriptionPage />} />
          </Route>
        </Route>
        <Route path="subscriptions">
          <Route index element={<SubscriptionsPage />} />
        </Route>
      </Route>
      <Route element={<AdminGuard redirectTo="/" />}>
        <Route path="admin" element={<AdminPage />}>
          <Route
            index
            element={<Navigate to="subscriptions" replace={true} />}
          />
          <Route path="servers" element={<AdminServersPage />} />
          <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="debug" element={<AdminDebugPage />} />
          <Route
            path="subscriptions/:subscriptionId"
            element={<AdminSubscriptionPage />}
          />
        </Route>
      </Route>
      <Route
        element={
          <AuthGuard>
            <PremiumLoginGate />
          </AuthGuard>
        }
      >
        <Route path="premium" element={<PremiumPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </>
);

export default routes;
