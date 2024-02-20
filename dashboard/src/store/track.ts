import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITrackItem, ITrackList, TRACK_TYPE } from "types/track";

interface ITrackState extends ITrackList {
  changed: boolean;
}

const initialState: ITrackState = {
  players: [],
  guilds: [],
  alliances: [],
  changed: false,
};

export const trackslice = createSlice({
  name: "track",
  initialState,
  reducers: {
    loadTrack: (state, { payload }: PayloadAction<ITrackList>) => {
      state.players = payload.players;
      state.guilds = payload.guilds;
      state.alliances = payload.alliances;
      state.changed = false;
    },
    trackPlayer: (
      state,
      { payload }: PayloadAction<ITrackList["players"][number]>
    ) => {
      if (state.players.find(({ id }) => id === payload.id)) return;
      state.players.push(payload);
      state.changed = true;
    },
    trackGuild: (
      state,
      { payload }: PayloadAction<ITrackList["guilds"][number]>
    ) => {
      if (state.guilds.find(({ id }) => id === payload.id)) return;
      state.guilds.push(payload);
      state.changed = true;
    },
    trackAlliance: (
      state,
      { payload }: PayloadAction<ITrackList["alliances"][number]>
    ) => {
      if (state.alliances.find(({ id }) => id === payload.id)) return;
      state.alliances.push(payload);
      state.changed = true;
    },
    setItemKillsChannel: (
      state,
      {
        payload,
      }: PayloadAction<{
        type: TRACK_TYPE;
        item: ITrackItem;
        channel?: string;
      }>
    ) => {
      const item = state[payload.type].find(
        (item) =>
          item.server === payload.item.server && item.id === payload.item.id
      );

      if (item) {
        item.kills = {
          ...item.kills,
          channel: payload.channel,
        };
        state.changed = true;
      }
    },
    setItemDeathsChannel: (
      state,
      {
        payload,
      }: PayloadAction<{
        type: TRACK_TYPE;
        item: ITrackItem;
        channel?: string;
      }>
    ) => {
      const item = state[payload.type].find(
        (item) =>
          item.server === payload.item.server && item.id === payload.item.id
      );

      if (item) {
        item.deaths = {
          ...item.deaths,
          channel: payload.channel,
        };
        state.changed = true;
      }
    },
    untrackPlayer: (state, { payload }: PayloadAction<string>) => {
      const i = state.players.findIndex(({ id }) => id === payload);
      if (i < 0) return;
      state.players.splice(i, 1);
      state.changed = true;
    },
    untrackGuild: (state, { payload }: PayloadAction<string>) => {
      const i = state.guilds.findIndex(({ id }) => id === payload);
      if (i < 0) return;
      state.guilds.splice(i, 1);
      state.changed = true;
    },
    untrackAlliance: (state, { payload }: PayloadAction<string>) => {
      const i = state.alliances.findIndex(({ id }) => id === payload);
      if (i < 0) return;
      state.alliances.splice(i, 1);
      state.changed = true;
    },
  },
});

export const {
  loadTrack,
  trackPlayer,
  trackGuild,
  trackAlliance,
  setItemKillsChannel,
  setItemDeathsChannel,
  untrackPlayer,
  untrackGuild,
  untrackAlliance,
} = trackslice.actions;

export default trackslice.reducer;
