import {
  faChartBar,
  faCrown,
  faDungeon,
  faGear,
  faGlobe,
  faImages,
  faList,
  faPeopleGroup,
  faSackDollar,
  faSkull,
  faSkullCrossbones,
  faTrophy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface HomeFeature {
  name: string;
  icon: IconDefinition;
  description: string;
  new?: boolean;
  premium?: boolean;
}

const HOME_FEATURES: HomeFeature[] = [
  {
    new: true,
    name: "Combined Kill Image",
    icon: faImages,
    description:
      "Append victim inventory to kill report images instead of a separate follow-up image.",
  },
  {
    new: true,
    name: "Damage & Healing Bars",
    icon: faChartBar,
    description:
      "Kill report images show participant damage and healing bars at a glance.",
  },
  {
    name: "Notification List",
    icon: faList,
    description:
      "Track players, guilds, and alliances to receive notifications for.",
  },
  {
    name: "Kills",
    icon: faSkull,
    description:
      "Configure kill notification channels, display mode, and link provider.",
  },
  {
    name: "Assists",
    icon: faUsers,
    description:
      "Get notified when tracked entities assist in kills, with damage share.",
  },
  {
    name: "Deaths",
    icon: faSkullCrossbones,
    description: "Configure death notification channels and display mode.",
  },
  {
    premium: true,
    name: "Juicy Kills",
    icon: faSackDollar,
    description:
      "Premium feed of the most expensive kills, with configurable thresholds.",
  },
  {
    premium: true,
    name: "Depths Kills",
    icon: faDungeon,
    description:
      "Premium notifications for kills that happened in Depths.",
  },
  {
    name: "Battles",
    icon: faPeopleGroup,
    description:
      "Battle summaries with configurable player, guild, and alliance thresholds.",
  },
  {
    name: "Rankings",
    icon: faTrophy,
    description: "Daily, weekly, and monthly PvP ranking notifications.",
  },
  {
    name: "All Albion Servers",
    icon: faGlobe,
    description:
      "Track entities on Americas, Asia, and Europe from a single dashboard.",
  },
  {
    name: "Dashboard",
    icon: faGear,
    description:
      "Configure notifications, languages, display options, and subscriptions per server.",
  },
  {
    name: "Premium",
    icon: faCrown,
    description:
      "Unlock juicy kills and higher tracking limits with a premium subscription.",
  },
];

export const homeFeatures: HomeFeature[] = [...HOME_FEATURES].sort(
  (a, b) => Number(Boolean(b.new)) - Number(Boolean(a.new))
);
