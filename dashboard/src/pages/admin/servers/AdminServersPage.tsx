import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "components/common/Loader";
import ServerList from "components/ServerList";
import { AdminFilterPanel } from "pages/admin/styles";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button, Card, Form, InputGroup, Stack } from "react-bootstrap";
import { useLazyFetchAdminServersQuery } from "store/api/admin";

const PAGE_SIZE = 10;

const AdminServersPage = () => {
  const [searchServer, setSearchServer] = useState("");
  const [page, setPage] = useState(1);
  const [fetchServers, serversQuery] = useLazyFetchAdminServersQuery();

  const buildQuery = useCallback(
    (nextPage = page) => ({
      search: searchServer.trim() || undefined,
      page: nextPage,
      pageSize: PAGE_SIZE,
    }),
    [page, searchServer]
  );

  const refetchServers = useCallback(
    (nextPage = page) => {
      fetchServers(buildQuery(nextPage));
    },
    [buildQuery, fetchServers, page]
  );

  useEffect(() => {
    refetchServers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    refetchServers(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    refetchServers(nextPage);
  };

  if (serversQuery.isFetching && !serversQuery.data) {
    return (
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
    );
  }

  const servers = serversQuery.data?.items ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((serversQuery.data?.total ?? 0) / PAGE_SIZE)
  );

  return (
    <Stack gap={3}>
      <AdminFilterPanel>
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="search">
              <Form.Label>Search</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  aria-describedby="search-help"
                  placeholder="Search servers"
                  value={searchServer}
                  onChange={(e) => setSearchServer(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  <FontAwesomeIcon icon={faRefresh} />
                </Button>
              </InputGroup>
            </Form.Group>
          </Form>
        </Card.Body>
      </AdminFilterPanel>

      <ServerList
        servers={servers}
        page={page}
        pages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
        onServerLeave={() => refetchServers(page)}
      />
    </Stack>
  );
};

export default AdminServersPage;
