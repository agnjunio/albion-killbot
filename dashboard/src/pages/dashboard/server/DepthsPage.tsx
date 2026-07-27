import LoadError from "components/LoadError";
import Settings from "components/Settings";
import Loader from "components/common/Loader";
import NotificationSettingsForm from "components/dashboard/NotificationSettingsForm";
import { isSubscriptionActive } from "helpers/subscriptions";
import { Link, useParams } from "react-router-dom";
import { useFetchServerQuery, useGetConstantsQuery } from "store/api";
import { useGetServerSubscriptionQuery } from "store/api/server";

const DepthsPage = () => {
  const { serverId = "" } = useParams();
  const constants = useGetConstantsQuery();
  const server = useFetchServerQuery(serverId);
  const subscription = useGetServerSubscriptionQuery({ serverId });

  if (server.isFetching || constants.isFetching || subscription.isFetching) {
    return <Loader />;
  }

  if (!server.data || !constants.data) {
    return <LoadError />;
  }

  const isPremium =
    subscription.data && isSubscriptionActive(subscription.data);

  return (
    <Settings
      alerts={[
        {
          show: !isPremium,
          variant: "danger",
          message: (
            <>
              This is a Premium feature. To enable, please check the
              <Link to="/premium"> Premium</Link> page to buy assign a
              subscription.
            </>
          ),
        },
      ]}
    >
      <NotificationSettingsForm
        type="depths"
        serverId={serverId}
        channels={server.data.channels}
        modes={constants.data.modes}
        providers={constants.data.providers}
        disabled={!isPremium}
      />
    </Settings>
  );
};

export default DepthsPage;
