import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminNavItem } from "constants/adminNav";
import {
  AdminPageDescription,
  AdminPageHeaderContent,
  AdminPageHeaderRoot,
  AdminPageTitle,
  AdminPageTitleIcon,
  AdminPageTitleRow,
} from "./styles";

interface AdminPageHeaderProps {
  item?: AdminNavItem;
}

const AdminPageHeader = ({ item }: AdminPageHeaderProps) => {
  return (
    <AdminPageHeaderRoot>
      <AdminPageHeaderContent>
        <AdminPageTitleRow>
          {item?.icon && (
            <AdminPageTitleIcon aria-hidden="true">
              <FontAwesomeIcon icon={item.icon} />
            </AdminPageTitleIcon>
          )}
          <AdminPageTitle>{item?.name ?? "Admin"}</AdminPageTitle>
        </AdminPageTitleRow>

        {item?.description && (
          <AdminPageDescription>{item.description}</AdminPageDescription>
        )}
      </AdminPageHeaderContent>
    </AdminPageHeaderRoot>
  );
};

export default AdminPageHeader;
