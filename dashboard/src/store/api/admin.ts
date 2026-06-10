import {
  AdminPlayerKills,
  AdminPublishEventsRequest,
  AdminPublishEventsResponse,
} from "types/admin";
import { PaginatedResponse } from "types/pagination";
import { ServerPartial } from "types/server";
import { ISubscription, ISubscriptionExtended } from "types/subscription";
import api from "./index";
import {
  ICreateSubscription,
  IDeleteSubscription,
  IFindAdminServers,
  IFindSubscriptions,
  IGetSubscription,
  IUpdateSubscription,
} from "./types";

const admin = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchAdminPlayerKills: builder.query<
      AdminPlayerKills,
      { playerId: string; server: string }
    >({
      query: ({ playerId, server }) => ({
        url: `/admin/debug/players/${playerId}`,
        params: { server },
      }),
      providesTags: ["Admin"],
    }),
    publishAdminEvents: builder.mutation<
      AdminPublishEventsResponse,
      AdminPublishEventsRequest
    >({
      query: (body) => ({
        url: `/admin/debug/events/publish`,
        method: "POST",
        body,
      }),
    }),
    fetchAdminServers: builder.query<
      PaginatedResponse<ServerPartial>,
      IFindAdminServers
    >({
      query: (params) => ({
        url: `/admin/servers`,
        params,
      }),
      providesTags: ["Admin", "Server"],
    }),
    doLeaveServer: builder.mutation<void, { serverId: string }>({
      query: ({ serverId }) => ({
        url: `/admin/servers/${serverId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin", "Server"],
    }),

    fetchAdminSubscriptions: builder.query<ISubscription[], IFindSubscriptions>(
      {
        query: (params) => ({
          url: `/admin/subscriptions`,
          params,
        }),
        providesTags: [{ type: "Subscription", id: "LIST" }],
      }
    ),
    getAdminSubscription: builder.query<ISubscription, IGetSubscription>({
      query: ({ id }) => ({
        url: `/admin/subscriptions/${id}`,
      }),
      providesTags: (subscription) => [
        { type: "Subscription", id: subscription?.id },
      ],
    }),
    createAdminSubscription: builder.mutation<
      ISubscriptionExtended,
      ICreateSubscription
    >({
      query: ({ subscription }) => ({
        url: `/admin/subscriptions`,
        method: "POST",
        body: subscription,
      }),
      invalidatesTags: [{ type: "Subscription", id: "LIST" }],
    }),
    updateAdminSubscription: builder.mutation<
      ISubscriptionExtended,
      IUpdateSubscription
    >({
      query: ({ subscription }) => ({
        url: `/admin/subscriptions/${subscription.id}`,
        method: "PUT",
        body: subscription,
      }),
      invalidatesTags: (subscription) => [
        { type: "Subscription", id: "LIST" },
        { type: "Subscription", id: subscription?.id },
      ],
    }),
    deleteAdminSubscription: builder.mutation<void, IDeleteSubscription>({
      query: ({ id }) => ({
        url: `/admin/subscriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Subscription", id: "LIST" }],
    }),
  }),
});

export const {
  useLazyFetchAdminPlayerKillsQuery,
  usePublishAdminEventsMutation,
  useLazyFetchAdminServersQuery,
  useDoLeaveServerMutation,

  useLazyFetchAdminSubscriptionsQuery,
  useGetAdminSubscriptionQuery,
  useCreateAdminSubscriptionMutation,
  useUpdateAdminSubscriptionMutation,
  useDeleteAdminSubscriptionMutation,
} = admin;

export default admin;
