import { getAdminNavItem } from "constants/adminNav";
import { useAdminNavMobile } from "helpers/adminNavMobile";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminNavContent from "./AdminNavContent";
import AdminPageHeader from "./AdminPageHeader";
import {
  AdminContentPanel,
  AdminContentStack,
  AdminLayoutRoot,
  AdminMainColumn,
  AdminMobileNavOffcanvas,
  AdminSidebarColumn,
  AdminSidebarPanel,
} from "./styles";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const adminNavMobile = useAdminNavMobile();
  const [showNav, setShowNav] = useState(false);
  const activeItem = getAdminNavItem(location.pathname);
  const closeNav = () => setShowNav(false);

  useEffect(() => {
    adminNavMobile?.registerOpenHandler(() => setShowNav(true));
    return () => adminNavMobile?.registerOpenHandler(null);
  }, [adminNavMobile]);

  return (
    <>
      <AdminLayoutRoot>
        <AdminSidebarColumn>
          <AdminSidebarPanel>
            <AdminNavContent />
          </AdminSidebarPanel>
        </AdminSidebarColumn>

        <AdminMainColumn>
          <AdminContentPanel>
            <AdminPageHeader item={activeItem} />
            <AdminContentStack>{children}</AdminContentStack>
          </AdminContentPanel>
        </AdminMainColumn>
      </AdminLayoutRoot>

      <AdminMobileNavOffcanvas
        show={showNav}
        onHide={closeNav}
        placement="start"
        className="d-lg-none"
      >
        <AdminMobileNavOffcanvas.Header closeButton>
          <AdminMobileNavOffcanvas.Title>
            Administration
          </AdminMobileNavOffcanvas.Title>
        </AdminMobileNavOffcanvas.Header>
        <AdminMobileNavOffcanvas.Body>
          <AdminNavContent onNavigate={closeNav} />
        </AdminMobileNavOffcanvas.Body>
      </AdminMobileNavOffcanvas>
    </>
  );
};

export default AdminLayout;
