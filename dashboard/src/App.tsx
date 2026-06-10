import Footer from "components/Footer";
import Paper from "components/Paper";
import Toasts from "components/Toasts";
import Header from "components/common/Header";
import { AdminNavMobileProvider } from "helpers/adminNavMobile";
import { ServerNavMobileProvider } from "helpers/serverNavMobile";
import { CookieNotice } from "react-cookienotice";
import { Outlet, useLocation } from "react-router-dom";
import Container, { HomePaper, ServerDashboardOutlet } from "styles/App";

export const App = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isPremium = location.pathname === "/premium";
  const useAmbientPaper = isHome || isPremium;
  const isServerDashboard = /^\/dashboard\/[^/]+/.test(location.pathname);

  return (
    <ServerNavMobileProvider>
      <AdminNavMobileProvider>
        <Container>
          <Header />
          <Paper elevation={24} className="content">
            {useAmbientPaper ? (
              <HomePaper elevation={0}>
                <Outlet />
              </HomePaper>
            ) : isServerDashboard ? (
              <ServerDashboardOutlet>
                <Outlet />
              </ServerDashboardOutlet>
            ) : (
              <div className="container">
                <Outlet />
              </div>
            )}
          </Paper>
          <Footer />
          <CookieNotice />
          <Toasts />
        </Container>
      </AdminNavMobileProvider>
    </ServerNavMobileProvider>
  );
};

export default App;
