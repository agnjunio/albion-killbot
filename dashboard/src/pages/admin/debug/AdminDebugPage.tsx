import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "components/common/Loader";
import UnsavedChangesBar from "components/dashboard/UnsavedChangesBar";
import { formatAllyGuildName } from "helpers/albion";
import {
  AdminDebugPanel,
  AdminDetailSecondary,
  AdminDropdownMenu,
  AdminFilterFooter,
  AdminFilterPanel,
  AdminKillListHint,
  AdminKillListItem,
  AdminKillListItemContent,
  AdminKillListItemMeta,
  AdminKillListItemPrimary,
  AdminKillListVictimName,
  AdminPlayerListItemId,
  AdminPlayerListItemName,
} from "pages/admin/styles";
import { FormEvent, useEffect, useState } from "react";
import { Button, Card, Dropdown, Form, Stack } from "react-bootstrap";
import { useGetConstantsQuery, useLazySearchQuery } from "store/api";
import {
  useLazyFetchAdminPlayerKillsQuery,
  usePublishAdminEventsMutation,
} from "store/api/admin";
import { IAlbionServer } from "types/constants";
import { ITrackItem } from "types/track";

const formatFame = (value: number) => value.toLocaleString();

const formatTimestamp = (value: string) => new Date(value).toLocaleString();

const AdminDebugPage = () => {
  const constants = useGetConstantsQuery();
  const [query, setQuery] = useState("");
  const [server, setServer] = useState<IAlbionServer>();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<Set<number>>(
    new Set()
  );
  const [searchPlayers, searchQuery] = useLazySearchQuery();
  const [fetchPlayerKills, killsQuery] = useLazyFetchAdminPlayerKillsQuery();
  const [publishEvents, publishMutation] = usePublishAdminEventsMutation();

  useEffect(() => {
    if (constants.data?.servers?.[0]) setServer(constants.data.servers[0]);
  }, [constants.data?.servers]);

  useEffect(() => {
    const players = searchQuery.data?.players ?? [];
    setSelectedPlayerId(players[0]?.id ?? null);
    setSelectedEventIds(new Set());
  }, [searchQuery.data]);

  useEffect(() => {
    if (!selectedPlayerId || !server) return;

    fetchPlayerKills({ playerId: selectedPlayerId, server: server.id });
    setSelectedEventIds(new Set());
  }, [selectedPlayerId, server, fetchPlayerKills]);

  if (constants.isLoading || !constants.data) return <Loader />;

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    if (!server || !query.trim()) return;

    searchPlayers({ query: query.trim(), server: server.id });
  };

  const toggleKillSelection = (eventId: number) => {
    setSelectedEventIds((current) => {
      const next = new Set(current);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const handlePublish = async () => {
    if (!server || selectedEventIds.size === 0) return;

    await publishEvents({
      server: server.id,
      eventIds: [...selectedEventIds],
    }).unwrap();

    setSelectedEventIds(new Set());
  };

  const players = searchQuery.data?.players ?? [];
  const kills = killsQuery.data?.kills ?? [];
  const searchNotFound =
    !searchQuery.isFetching &&
    !searchQuery.isUninitialized &&
    players.length === 0;
  const selectedCount = selectedEventIds.size;
  const isSearching = searchQuery.isFetching;
  const isLoadingKills = killsQuery.isFetching;

  const renderPlayerRow = (item: ITrackItem) => {
    const isSelected = selectedPlayerId === item.id;

    return (
      <AdminKillListItem
        key={item.id}
        $compact
        $selected={isSelected}
        role="radio"
        tabIndex={0}
        aria-checked={isSelected}
        aria-label={`Select player ${item.name}`}
        onClick={() => setSelectedPlayerId(item.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectedPlayerId(item.id);
          }
        }}
      >
        <Form.Check
          type="radio"
          name="debug-player"
          checked={isSelected}
          readOnly
          tabIndex={-1}
          aria-hidden
        />
        <AdminKillListItemContent>
          <AdminPlayerListItemName>{item.name}</AdminPlayerListItemName>
          <AdminPlayerListItemId>{item.id}</AdminPlayerListItemId>
        </AdminKillListItemContent>
      </AdminKillListItem>
    );
  };

  return (
    <Stack gap={3}>
      <Form onSubmit={handleSearch}>
        <AdminFilterPanel>
          <Card.Body>
            <Stack gap={2}>
              <Form.Group controlId="player-query">
                <Form.Label>Player</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by name or ID"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="player-server">
                <Form.Label>Server</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" className="w-100">
                    {server?.name ?? "Select server"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu as={AdminDropdownMenu}>
                    {constants.data.servers.map((serverOption) => (
                      <Dropdown.Item
                        key={serverOption.id}
                        onClick={() => setServer(serverOption)}
                      >
                        {serverOption.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Stack>
          </Card.Body>

          <AdminFilterFooter>
            <Button
              variant="primary"
              type="submit"
              disabled={!query.trim() || !server || isSearching}
            >
              <FontAwesomeIcon icon={faSearch} />
              <span>Search</span>
            </Button>
          </AdminFilterFooter>
        </AdminFilterPanel>
      </Form>

      {isSearching && <Loader />}

      {searchNotFound && (
        <AdminDebugPanel>
          <Card.Body>
            <AdminDetailSecondary>
              No players found for that query on {server?.name}.
            </AdminDetailSecondary>
          </Card.Body>
        </AdminDebugPanel>
      )}

      {players.length > 0 && (
        <>
          <AdminDebugPanel>
            <Card.Header className="d-flex flex-wrap justify-content-between align-items-baseline gap-2">
              <span>Players</span>
              <AdminKillListHint>Click to load recent kills</AdminKillListHint>
            </Card.Header>
            <Card.Body className="p-0">
              <div>{players.map(renderPlayerRow)}</div>
            </Card.Body>
          </AdminDebugPanel>

          {isLoadingKills && <Loader />}

          {killsQuery.isError && !isLoadingKills && (
            <AdminDebugPanel>
              <Card.Body>
                <AdminDetailSecondary>
                  Unable to load kills for the selected player.
                </AdminDetailSecondary>
              </Card.Body>
            </AdminDebugPanel>
          )}

          {selectedPlayerId && killsQuery.isSuccess && !isLoadingKills && (
            <>
              <AdminDebugPanel>
                <Card.Header className="d-flex flex-wrap justify-content-between align-items-baseline gap-2">
                  <span>Recent kills</span>
                  <AdminKillListHint>
                    Click to select for publishing
                  </AdminKillListHint>
                </Card.Header>
                <Card.Body className="p-0">
                  {kills.length === 0 ? (
                    <div className="p-3">
                      <AdminDetailSecondary>
                        No recent kills returned by the Albion API.
                      </AdminDetailSecondary>
                    </div>
                  ) : (
                    <div>
                      {kills.map((kill) => {
                        const victimGuild = formatAllyGuildName(kill.victim);
                        const isSelected = selectedEventIds.has(kill.id);

                        return (
                          <AdminKillListItem
                            key={kill.id}
                            $compact
                            $selected={isSelected}
                            role="checkbox"
                            tabIndex={0}
                            aria-checked={isSelected}
                            aria-label={`Select kill on ${kill.victim.name}`}
                            onClick={() => toggleKillSelection(kill.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                toggleKillSelection(kill.id);
                              }
                            }}
                          >
                            <Form.Check
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              tabIndex={-1}
                              aria-hidden
                            />
                            <AdminKillListItemContent>
                              <AdminKillListItemPrimary>
                                <AdminKillListVictimName>
                                  {kill.victim.name}
                                </AdminKillListVictimName>
                                {victimGuild && <span>{victimGuild}</span>}
                                <span>{formatFame(kill.fame)} fame</span>
                                <span>{Math.round(kill.victim.ip)} IP</span>
                              </AdminKillListItemPrimary>
                              <AdminKillListItemMeta>
                                {formatTimestamp(kill.timestamp)} · {kill.id}
                              </AdminKillListItemMeta>
                            </AdminKillListItemContent>
                          </AdminKillListItem>
                        );
                      })}
                    </div>
                  )}
                </Card.Body>
              </AdminDebugPanel>

              <UnsavedChangesBar
                show={selectedCount > 0}
                isSaving={publishMutation.isLoading}
                onReset={() => setSelectedEventIds(new Set())}
                onSave={handlePublish}
                title={`${selectedCount} kill${
                  selectedCount === 1 ? "" : "s"
                } selected`}
                description="Publish selected kills to Discord."
                saveLabel="Publish"
                savingLabel="Publishing..."
                resetLabel="Clear"
              />
            </>
          )}
        </>
      )}
    </Stack>
  );
};

export default AdminDebugPage;
