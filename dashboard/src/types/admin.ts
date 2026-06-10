export interface AdminPlayerGuild {
  id: string;
  name: string;
}

export interface AdminPlayerAlliance {
  id: string;
  tag: string;
  name: string;
}

export interface AdminPlayerEventParticipant {
  id: string;
  name: string;
  ip: number;
  killFame: number;
  deathFame: number;
  guild: AdminPlayerGuild | null;
  alliance: {
    id: string;
    tag: string;
    name: string;
  } | null;
}

export interface AdminPlayerKill {
  id: number;
  server: {
    id: string;
    name: string;
  };
  battle?: number;
  timestamp: string;
  fame: number;
  killer: AdminPlayerEventParticipant;
  victim: AdminPlayerEventParticipant;
}

export interface AdminPlayerKills {
  kills: AdminPlayerKill[];
}

export interface AdminPublishEventsRequest {
  server: string;
  eventIds: number[];
}

export interface AdminPublishEventsResponse {
  published: number;
  eventIds: number[];
  failed: number[];
}
