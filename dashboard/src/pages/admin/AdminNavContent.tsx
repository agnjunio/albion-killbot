import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ADMIN_NAV_ITEMS } from "constants/adminNav";
import {
  AdminNavItemLabel,
  AdminNavItemLink,
  AdminNavSections,
  AdminSidebarHeader,
} from "./styles";

interface AdminNavContentProps {
  onNavigate?: () => void;
}

const AdminNavContent = ({ onNavigate }: AdminNavContentProps) => {
  return (
    <>
      <AdminSidebarHeader>Administration</AdminSidebarHeader>

      <AdminNavSections>
        {ADMIN_NAV_ITEMS.map((item) => (
          <AdminNavItemLink key={item.path} to={item.path} onClick={onNavigate}>
            <FontAwesomeIcon icon={item.icon} className="nav-icon" />
            <AdminNavItemLabel>{item.name}</AdminNavItemLabel>
          </AdminNavItemLink>
        ))}
      </AdminNavSections>
    </>
  );
};

export default AdminNavContent;
