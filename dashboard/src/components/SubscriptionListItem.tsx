import SubscriptionDelete from "components/SubscriptionDelete";
import SubscriptionStatusBadge from "components/subscriptions/SubscriptionStatusBadge";
import { getSubscriptionStatus } from "helpers/subscriptions";
import { getSubscriptionUrl } from "helpers/stripe";
import {
  AdminDetailLabel,
  AdminDetailRow,
  AdminDetailSecondary,
  AdminDetailValue,
} from "pages/admin/styles";
import { Button, Card, Col, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ISubscription } from "types/subscription";

interface SubscriptionListItemProps {
  subscription: ISubscription;
  onDelete?: () => void;
}

const formatExpiryText = (subscription: ISubscription) => {
  if (subscription.expires === "never") return null;

  const isActive =
    new Date(subscription.expires).getTime() > new Date().getTime();

  return `${isActive ? "Active until" : "Expired at"} ${new Date(
    subscription.expires
  ).toLocaleString()}`;
};

const SubscriptionListItem = ({
  subscription,
  onDelete,
}: SubscriptionListItemProps) => {
  const expiryText = formatExpiryText(subscription);

  return (
    <Card className="p-3">
      <Row className="gy-2">
        <Col
          xs={12}
          xl={8}
          className="d-flex flex-column justify-content-center"
        >
          <Stack gap={2}>
            <AdminDetailRow>
              <AdminDetailLabel>Owner</AdminDetailLabel>
              <AdminDetailValue>{subscription.owner}</AdminDetailValue>
            </AdminDetailRow>

            <AdminDetailRow>
              <AdminDetailLabel>Status</AdminDetailLabel>
              <SubscriptionStatusBadge
                status={getSubscriptionStatus(subscription)}
              />
              {expiryText && (
                <AdminDetailSecondary>{expiryText}</AdminDetailSecondary>
              )}
            </AdminDetailRow>

            {subscription.server && (
              <AdminDetailRow>
                <AdminDetailLabel>Server</AdminDetailLabel>
                <AdminDetailValue>{subscription.server}</AdminDetailValue>
              </AdminDetailRow>
            )}

            {subscription.stripe && (
              <AdminDetailRow>
                <AdminDetailLabel>Stripe</AdminDetailLabel>
                <AdminDetailValue>
                  <a
                    href={getSubscriptionUrl(subscription.stripe)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {subscription.stripe}
                  </a>
                </AdminDetailValue>
              </AdminDetailRow>
            )}
          </Stack>
        </Col>

        <Col
          xs={12}
          xl={4}
          className="actions d-flex align-items-start justify-content-end"
        >
          <Stack
            gap={2}
            direction="horizontal"
            className="flex-wrap justify-content-end"
          >
            <Link to={`/admin/subscriptions/${subscription.id}`}>
              <Button variant="primary">Manage</Button>
            </Link>
            {subscription.server && (
              <Link to={`/dashboard/${subscription.server}`}>
                <Button variant="primary">Dashboard</Button>
              </Link>
            )}
            <SubscriptionDelete
              subscription={subscription}
              onDelete={onDelete}
            />
          </Stack>
        </Col>
      </Row>
    </Card>
  );
};

export default SubscriptionListItem;
