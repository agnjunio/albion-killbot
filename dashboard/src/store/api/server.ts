import api from "./index";
import { IGetSubscriptionRequest, IGetSubscriptionResponse } from "./types";

const server = api.injectEndpoints({
  endpoints: (builder) => ({
    getServerSubscription: builder.query<
      IGetSubscriptionResponse,
      IGetSubscriptionRequest
    >({
      query: ({ serverId }) => ({
        url: `/servers/${serverId}/subscription`,
      }),
      providesTags: (subscription) => [
        { type: "Subscription", id: subscription?.id },
      ],
    }),
  }),
});

export const { useGetServerSubscriptionQuery } = server;

export default server;
