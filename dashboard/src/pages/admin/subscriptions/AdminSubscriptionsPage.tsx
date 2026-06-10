import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "components/common/Loader";
import SubscriptionList from "components/SubscriptionList";
import SubscriptionAdd from "components/subscriptions/SubscriptionAdd";
import { useAppDispatch, useAppSelector } from "helpers/hooks";
import {
  AdminDropdownMenu,
  AdminFilterFooter,
  AdminFilterPanel,
} from "pages/admin/styles";
import { useCallback, useEffect } from "react";
import { Button, Card, Col, Dropdown, Form, Row, Stack } from "react-bootstrap";
import {
  setSubscriptionOwner,
  setSubscriptionServer,
  setSubscriptionStatus,
  setSubscriptionStripe,
} from "store/admin";
import { useGetConstantsQuery } from "store/api";
import { useLazyFetchAdminSubscriptionsQuery } from "store/api/admin";

const AdminSubscriptionsPage = () => {
  const constants = useGetConstantsQuery();
  const [search, { isFetching, data }] = useLazyFetchAdminSubscriptionsQuery();
  const dispatch = useAppDispatch();
  const { server, owner, status, stripe } = useAppSelector(
    (state) => state.admin.subscription
  );

  const buildQuery = useCallback(() => {
    const query: Record<string, string> = {};
    if (server) query.server = server;
    if (owner) query.owner = owner;
    if (status !== "All") query.status = status;
    if (stripe) query.stripe = stripe;
    return query;
  }, [server, owner, status, stripe]);

  const refetchSubscriptions = useCallback(() => {
    search(buildQuery());
  }, [search, buildQuery]);

  useEffect(() => {
    const query = buildQuery();
    if (Object.keys(query).length > 0) search(query, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (constants.isFetching || !constants.data) return <Loader />;
  const { subscriptionStatuses } = constants.data;

  return (
    <Stack gap={3}>
      <Form
        onSubmit={(e) => {
          e?.preventDefault();

          search(buildQuery());
        }}
      >
        <AdminFilterPanel>
          <Card.Body>
            <Stack gap={2}>
              <Row className="gy-2">
                <Form.Group controlId="owner" as={Col} xs={12} lg="auto">
                  <Form.Label>Owner</Form.Label>
                  <Form.Control
                    type="text"
                    value={owner}
                    onChange={(e) =>
                      dispatch(setSubscriptionOwner(e.target.value))
                    }
                  />
                </Form.Group>

                <Form.Group controlId="server" as={Col} xs={12} lg="auto">
                  <Form.Label>Server</Form.Label>
                  <Form.Control
                    type="text"
                    value={server}
                    onChange={(e) =>
                      dispatch(setSubscriptionServer(e.target.value))
                    }
                  />
                </Form.Group>

                <Form.Group controlId="stripe" as={Col} xs={12} lg="auto">
                  <Form.Label>Stripe</Form.Label>
                  <Form.Control
                    type="text"
                    value={stripe}
                    onChange={(e) =>
                      dispatch(setSubscriptionStripe(e.target.value))
                    }
                  />
                </Form.Group>

                <Form.Group controlId="status" as={Col} xs="auto">
                  <Form.Label>Status</Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" className="w-100">
                      {status}
                    </Dropdown.Toggle>
                    <Dropdown.Menu as={AdminDropdownMenu}>
                      <Dropdown.Item
                        onClick={() => dispatch(setSubscriptionStatus("All"))}
                      >
                        All
                      </Dropdown.Item>
                      {subscriptionStatuses.map((statusOption: string) => (
                        <Dropdown.Item
                          key={statusOption}
                          onClick={() =>
                            dispatch(setSubscriptionStatus(statusOption))
                          }
                        >
                          {statusOption}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </Row>
            </Stack>
          </Card.Body>

          <AdminFilterFooter>
            <SubscriptionAdd />
            <Button variant="primary" type="submit">
              <FontAwesomeIcon icon={faSearch} />
              <span>Search</span>
            </Button>
          </AdminFilterFooter>
        </AdminFilterPanel>
      </Form>

      {isFetching ? (
        <Loader width={500} height={500}>
          <rect x="160" y="10" rx="0" ry="0" width="210" height="15" />
          <rect x="15" y="45" rx="5" ry="5" width="475" height="40" />
          <rect x="15" y="95" rx="5" ry="5" width="475" height="40" />
          <rect x="15" y="145" rx="5" ry="5" width="475" height="40" />
          <rect x="15" y="195" rx="5" ry="5" width="475" height="40" />
          <rect x="15" y="245" rx="5" ry="5" width="475" height="40" />
          <rect x="15" y="295" rx="5" ry="5" width="475" height="40" />
          <rect x="15" y="345" rx="5" ry="5" width="475" height="40" />
          <rect x="15" y="395" rx="5" ry="5" width="475" height="40" />
          <rect x="15" y="445" rx="5" ry="5" width="475" height="40" />
        </Loader>
      ) : (
        <SubscriptionList
          subscriptions={data}
          onDelete={refetchSubscriptions}
        />
      )}
    </Stack>
  );
};

export default AdminSubscriptionsPage;
