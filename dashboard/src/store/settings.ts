import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISettings } from "types/settings";

interface ISettingsState extends ISettings {
  changed: boolean;
}

const defaultSettings: ISettings = {
  server: "",
  general: {
    locale: "en",
    showAttunement: false,
    guildTags: false,
    splitLootValue: false,
    combinedEventImage: true,
  },
  kills: {
    enabled: true,
    channel: "",
    mode: "image",
  },
  deaths: {
    enabled: true,
    channel: "",
    mode: "image",
  },
  assists: {
    enabled: false,
    channel: "",
    mode: "image",
  },
  depths: {
    enabled: false,
    channel: "",
    mode: "image",
  },
  juicy: {
    enabled: {
      americas: false,
      asia: false,
    },
    good: {
      channel: "",
    },
    insane: {
      channel: "",
    },
    mode: "image",
  },
  battles: {
    enabled: true,
    channel: "",
    threshold: {
      players: 0,
      guilds: 0,
      alliances: 0,
    },
  },
  rankings: {
    enabled: true,
    channel: "",
    daily: "off",
    weekly: "off",
    monthly: "off",
  },
};

const initialState: ISettingsState = {
  ...defaultSettings,
  changed: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    loadSettings: (state, action: PayloadAction<ISettings>) => {
      state.server = action.payload.server;
      state.general = action.payload.general;
      state.kills = action.payload.kills;
      state.deaths = action.payload.deaths;
      state.assists = action.payload.assists ?? defaultSettings.assists;
      state.depths = action.payload.depths ?? defaultSettings.depths;
      state.juicy = action.payload.juicy;
      state.battles = action.payload.battles;
      state.rankings = action.payload.rankings;
      state.changed = false;
    },
    setGeneralLocale: (state, action: PayloadAction<string>) => {
      state.general.locale = action.payload;
      state.changed = true;
    },
    setGeneralShowAttunement: (state, action: PayloadAction<boolean>) => {
      state.general.showAttunement = action.payload;
      state.changed = true;
    },
    setGeneralGuildTags: (state, action: PayloadAction<boolean>) => {
      state.general.guildTags = action.payload;
      state.changed = true;
    },
    setGeneralSplitLootValue: (state, action: PayloadAction<boolean>) => {
      state.general.splitLootValue = action.payload;
      state.changed = true;
    },
    setGeneralCombinedEventImage: (state, action: PayloadAction<boolean>) => {
      state.general.combinedEventImage = action.payload;
      state.changed = true;
    },
    setKillsEnabled: (state, action: PayloadAction<boolean>) => {
      state.kills.enabled = action.payload;
      state.changed = true;
    },
    setKillsChannel: (state, action: PayloadAction<string>) => {
      state.kills.channel = action.payload;
      state.changed = true;
    },
    setKillsMode: (state, action: PayloadAction<string>) => {
      state.kills.mode = action.payload;
      state.changed = true;
    },
    setKillsProvider: (state, action: PayloadAction<string>) => {
      state.kills.provider = action.payload;
      state.changed = true;
    },
    setDeathsEnabled: (state, action: PayloadAction<boolean>) => {
      state.deaths.enabled = action.payload;
      state.changed = true;
    },
    setDeathsChannel: (state, action: PayloadAction<string>) => {
      state.deaths.channel = action.payload;
      state.changed = true;
    },
    setDeathsMode: (state, action: PayloadAction<string>) => {
      state.deaths.mode = action.payload;
      state.changed = true;
    },
    setDeathsProvider: (state, action: PayloadAction<string>) => {
      state.deaths.provider = action.payload;
      state.changed = true;
    },
    setAssistsEnabled: (state, action: PayloadAction<boolean>) => {
      state.assists.enabled = action.payload;
      state.changed = true;
    },
    setAssistsChannel: (state, action: PayloadAction<string>) => {
      state.assists.channel = action.payload;
      state.changed = true;
    },
    setAssistsMode: (state, action: PayloadAction<string>) => {
      state.assists.mode = action.payload;
      state.changed = true;
    },
    setAssistsProvider: (state, action: PayloadAction<string>) => {
      state.assists.provider = action.payload;
      state.changed = true;
    },
    setDepthsEnabled: (state, action: PayloadAction<boolean>) => {
      state.depths.enabled = action.payload;
      state.changed = true;
    },
    setDepthsChannel: (state, action: PayloadAction<string>) => {
      state.depths.channel = action.payload;
      state.changed = true;
    },
    setDepthsMode: (state, action: PayloadAction<string>) => {
      state.depths.mode = action.payload;
      state.changed = true;
    },
    setDepthsProvider: (state, action: PayloadAction<string>) => {
      state.depths.provider = action.payload;
      state.changed = true;
    },
    setJuicyEnabled: (
      state,
      action: PayloadAction<{ serverId: string; enabled: boolean }>
    ) => {
      state.juicy.enabled[action.payload.serverId] = action.payload.enabled;
      state.changed = true;
    },
    setJuicyChannel: (
      state,
      action: PayloadAction<{ type: "good" | "insane"; channel: string }>
    ) => {
      state.juicy[action.payload.type].channel = action.payload.channel;
      state.changed = true;
    },
    setJuicyMode: (state, action: PayloadAction<string>) => {
      state.juicy.mode = action.payload;
      state.changed = true;
    },
    setJuicyProvider: (state, action: PayloadAction<string>) => {
      state.juicy.provider = action.payload;
      state.changed = true;
    },
    setBattlesEnabled: (state, action: PayloadAction<boolean>) => {
      state.battles.enabled = action.payload;
      state.changed = true;
    },
    setBattlesChannel: (state, action: PayloadAction<string>) => {
      state.battles.channel = action.payload;
      state.changed = true;
    },
    setBattlesThresholdPlayers: (state, action: PayloadAction<number>) => {
      state.battles.threshold = {
        ...state.battles.threshold,
        players: Math.max(0, action.payload),
      };
      state.changed = true;
    },
    setBattlesThresholdGuilds: (state, action: PayloadAction<number>) => {
      state.battles.threshold = {
        ...state.battles.threshold,
        guilds: Math.max(0, action.payload),
      };
      state.changed = true;
    },
    setBattlesThresholdAlliances: (state, action: PayloadAction<number>) => {
      state.battles.threshold = {
        ...state.battles.threshold,
        alliances: Math.max(0, action.payload),
      };
      state.changed = true;
    },
    setBattlesProvider: (state, action: PayloadAction<string>) => {
      state.battles.provider = action.payload;
      state.changed = true;
    },
    setRankingsEnabled: (state, action: PayloadAction<boolean>) => {
      state.rankings.enabled = action.payload;
      state.changed = true;
    },
    setRankingsChannel: (state, action: PayloadAction<string>) => {
      state.rankings.channel = action.payload;
      state.changed = true;
    },
    setRankingsDaily: (state, action: PayloadAction<string>) => {
      state.rankings.daily = action.payload;
      state.changed = true;
    },
    setRankingsWeekly: (state, action: PayloadAction<string>) => {
      state.rankings.weekly = action.payload;
      state.changed = true;
    },
    setRankingsMonthly: (state, action: PayloadAction<string>) => {
      state.rankings.monthly = action.payload;
      state.changed = true;
    },
  },
});

export const {
  loadSettings,
  setGeneralLocale,
  setGeneralShowAttunement,
  setGeneralGuildTags,
  setGeneralSplitLootValue,
  setGeneralCombinedEventImage,
  setKillsEnabled,
  setKillsChannel,
  setKillsMode,
  setKillsProvider,
  setDeathsEnabled,
  setDeathsChannel,
  setDeathsMode,
  setDeathsProvider,
  setAssistsEnabled,
  setAssistsChannel,
  setAssistsMode,
  setAssistsProvider,
  setDepthsEnabled,
  setDepthsChannel,
  setDepthsMode,
  setDepthsProvider,
  setJuicyEnabled,
  setJuicyChannel,
  setJuicyMode,
  setJuicyProvider,
  setBattlesEnabled,
  setBattlesChannel,
  setBattlesThresholdPlayers,
  setBattlesThresholdGuilds,
  setBattlesThresholdAlliances,
  setBattlesProvider,
  setRankingsEnabled,
  setRankingsChannel,
  setRankingsDaily,
  setRankingsWeekly,
  setRankingsMonthly,
} = settingsSlice.actions;

export default settingsSlice.reducer;
