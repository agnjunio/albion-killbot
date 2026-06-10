import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBug, faCrown, faList } from "@fortawesome/free-solid-svg-icons";

export interface AdminNavItem {
  path: string;
  name: string;
  icon: IconDefinition;
  description: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    path: "servers",
    name: "Servers",
    icon: faList,
    description: "Browse and manage Discord servers the bot has joined.",
  },
  {
    path: "subscriptions",
    name: "Subscriptions",
    icon: faCrown,
    description: "Search, create, and manage server subscriptions.",
  },
  {
    path: "debug",
    name: "Debug",
    icon: faBug,
    description:
      "Look up Albion players by name or ID and inspect recent kills.",
  },
];

export const getAdminNavItem = (pathname: string): AdminNavItem | undefined => {
  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0];
  if (!segment) return undefined;

  return ADMIN_NAV_ITEMS.find((item) => item.path === segment);
};
