import {
  EmptyStateRoot,
  EmptyStateText,
  EmptyStateTitle,
} from "components/layout/ContentPanel";
import { useAppDispatch } from "helpers/hooks";
import { useEffect, useState } from "react";
import { Button, Pagination, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  setSubscriptionOwner,
  setSubscriptionServer,
  setSubscriptionStatus,
  setSubscriptionStripe,
} from "store/admin";
import { ServerPartial } from "types/server";
import LeaveServer from "./LeaveServer";
import ServerCard from "./ServerCard";

interface ServerListProps {
  className?: string;
  page?: number;
  pages?: number;
  pageSize?: number;
  servers: ServerPartial[];
  onPageChange?: (page: number) => void;
  onServerLeave?: () => void;
}

const ServerList = ({
  servers,
  className,
  page: controlledPage,
  pages: controlledPages,
  pageSize = 10,
  onPageChange,
  onServerLeave,
}: ServerListProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isServerPaginated =
    controlledPage !== undefined && onPageChange !== undefined;

  const [width, setWidth] = useState(window.innerWidth);
  const PAGE_GAP = 2 + Math.floor(width / 450);

  const [page, setPage] = useState(1);
  const currentPage = isServerPaginated ? controlledPage : page;
  const pages = isServerPaginated
    ? Math.max(1, controlledPages ?? 1)
    : Math.ceil(servers.length / pageSize);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setWidth]);

  useEffect(() => {
    if (isServerPaginated) return;
    if (page < 1) setPage(1);
    else if (page > pages && pages > 0) setPage(pages);
  }, [isServerPaginated, page, pages]);

  const items = isServerPaginated
    ? servers
    : servers.slice(
        (currentPage - 1) * pageSize,
        (currentPage - 1) * pageSize + pageSize
      );

  const changePage = (nextPage: number) => {
    if (isServerPaginated) onPageChange(nextPage);
    else setPage(nextPage);
  };

  let startPage = currentPage - PAGE_GAP;
  let endPage = currentPage + PAGE_GAP;

  while (startPage < 1) {
    startPage++;
    endPage++;
  }

  while (endPage > pages) {
    endPage--;
    startPage--;
  }

  if (startPage < 1) startPage = 1;
  if (endPage > pages) endPage = pages;

  const pageList = [];
  for (let i = startPage; i <= endPage; i++) {
    pageList.push(i);
  }

  if (servers.length === 0)
    return (
      <EmptyStateRoot>
        <EmptyStateTitle>No servers to display</EmptyStateTitle>
        <EmptyStateText>
          Try adjusting your search or refresh the list.
        </EmptyStateText>
      </EmptyStateRoot>
    );

  const navigateServerSubscriptions = (serverId: string) => {
    dispatch(setSubscriptionServer(serverId));
    dispatch(setSubscriptionOwner(""));
    dispatch(setSubscriptionStatus("All"));
    dispatch(setSubscriptionStripe(""));

    navigate("/admin/subscriptions");
  };

  return (
    <Stack gap={3} className={className}>
      {items.map((server) => (
        <ServerCard key={server.id} server={server} list>
          <Stack gap={2} direction="horizontal">
            <Button
              variant="primary"
              onClick={() => navigateServerSubscriptions(server.id)}
            >
              Subscriptions
            </Button>

            <Link to={`/dashboard/${server.id}`}>
              <Button variant="primary">Dashboard</Button>
            </Link>

            <LeaveServer server={server} onLeave={onServerLeave} />
          </Stack>
        </ServerCard>
      ))}

      <div className="mw-w100 d-flex justify-content-center">
        <Pagination>
          <Pagination.First onClick={() => changePage(1)} />

          {pageList.map((i) => (
            <Pagination.Item
              key={i}
              active={currentPage === i}
              onClick={() => changePage(i)}
            >
              {i}
            </Pagination.Item>
          ))}

          <Pagination.Last onClick={() => changePage(pages)} />
        </Pagination>
      </div>
    </Stack>
  );
};

export default ServerList;
