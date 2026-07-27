import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCrown,
  faDungeon,
  faGear,
  faList,
  faPeopleGroup,
  faSackDollar,
  faSkull,
  faSkullCrossbones,
  faTrophy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export interface ServerNavItem {
  path: string;
  name: string;
  icon: IconDefinition;
  description: string;
  premium?: boolean;
}

export interface ServerNavSection {
  id: string;
  label: string;
  items: ServerNavItem[];
}

export const SERVER_NAV_SECTIONS: ServerNavSection[] = [
  {
    id: "tracking",
    label: "Tracking",
    items: [
      {
        path: "track",
        name: "Notification List",
        icon: faList,
        description:
          "Manage players, guilds, and alliances to receive notifications for.",
      },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    items: [
      {
        path: "kills",
        name: "Kills",
        icon: faSkull,
        description:
          "Configure kill notification channels, mode, and link provider.",
      },
      {
        path: "assists",
        name: "Assists",
        icon: faUsers,
        description: "Configure assist notification channels and display mode.",
      },
      {
        path: "deaths",
        name: "Deaths",
        icon: faSkullCrossbones,
        description: "Configure death notification channels and display mode.",
      },
      {
        path: "juicy",
        name: "Juicy Kills",
        icon: faSackDollar,
        description:
          "Configure premium juicy kill notifications and thresholds.",
        premium: true,
      },
      {
        path: "depths",
        name: "Depths Kills",
        icon: faDungeon,
        description:
          "Configure premium notifications for kills that happened in Depths.",
        premium: true,
      },
      {
        path: "battles",
        name: "Battles",
        icon: faPeopleGroup,
        description: "Configure battle summary notifications and thresholds.",
      },
      {
        path: "rankings",
        name: "Rankings",
        icon: faTrophy,
        description:
          "Configure daily, weekly, and monthly PvP ranking notifications.",
      },
    ],
  },
  {
    id: "general",
    label: "Settings",
    items: [
      {
        path: "settings",
        name: "General",
        icon: faGear,
        description: "Language, display options, and global bot preferences.",
      },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    items: [
      {
        path: "subscription",
        name: "Subscription",
        icon: faCrown,
        description: "View and manage your server subscription.",
      },
    ],
  },
];

export const SERVER_NAV_ITEMS: ServerNavItem[] = SERVER_NAV_SECTIONS.flatMap(
  (section) => section.items
);

export const getServerNavItem = (
  pathname: string,
  serverId: string
): ServerNavItem | undefined => {
  const basePath = `/dashboard/${serverId}/`;
  const relativePath = pathname.startsWith(basePath)
    ? pathname.slice(basePath.length).split("/")[0]
    : pathname.split("/").pop() ?? "";

  return SERVER_NAV_ITEMS.find((item) => item.path === relativePath);
};
