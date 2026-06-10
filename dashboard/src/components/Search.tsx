import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Card, Dropdown, Form, InputGroup } from "react-bootstrap";
import { useGetConstantsQuery, useLazySearchQuery } from "store/api";
import { IAlbionServer } from "types/constants";
import { Limits } from "types/limits";
import SearchResults from "./SearchResults";
import Loader from "./common/Loader";

interface ISearchProps {
  limits: Limits;
}

const Search = ({ limits }: ISearchProps) => {
  const constants = useGetConstantsQuery();
  const [query, setQuery] = useState("");
  const [server, setServer] = useState<IAlbionServer>();
  const [search, searchResults] = useLazySearchQuery();

  useEffect(() => {
    if (constants.data?.servers) setServer(constants.data.servers[0]);
  }, [constants.data?.servers]);

  if (constants.isLoading || !constants.data) return <Loader />;
  const { servers } = constants.data;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (!server) return;

    e?.preventDefault();
    search({ server: server.id, query }, true);
  };

  return (
    <Card id="track-search">
      <Card.Body className="p-2">
        <Form onSubmit={handleSearch} className="search-form">
          <Form.Group controlId="search-albion" className="px-2 mb-0">
            <div className="search-form-field">
              <Form.Label>Add to notification list</Form.Label>
              <InputGroup className="search-input-group">
                <Form.Control
                  type="text"
                  size="sm"
                  aria-describedby="search-help"
                  placeholder="Search Albion Online by name or ID"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="search-input-actions">
                  <Dropdown className="search-server-dropdown">
                    <Dropdown.Toggle
                      className="search-server-toggle"
                      variant="primary"
                      size="sm"
                    >
                      {server?.name}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {servers.map((server) => (
                        <Dropdown.Item
                          key={server.id}
                          onClick={() => setServer(server)}
                        >
                          {server.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button
                    className="search-input-submit"
                    variant="primary"
                    size="sm"
                    type="submit"
                    aria-label="Search"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </div>
              </InputGroup>
            </div>
            <Form.Text id="search-help" muted>
              For alliances, only search by <b>ID</b> is working
            </Form.Text>
          </Form.Group>
        </Form>
      </Card.Body>

      {!searchResults.isUninitialized && (
        <Card.Footer className="search-results-panel p-0">
          <div className="search-results-panel-header px-3 py-2">
            Search results
          </div>
          <div className="px-2 pb-2 pt-1">
            {searchResults.isFetching ? (
              <Loader width={500} height={250}>
                <rect x="5" y="10" rx="5" ry="5" width="490" height="70" />
                <rect x="5" y="90" rx="5" ry="5" width="490" height="70" />
                <rect x="5" y="170" rx="5" ry="5" width="490" height="70" />
              </Loader>
            ) : (
              <SearchResults
                limits={limits}
                searchResults={searchResults.data}
              />
            )}
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default Search;
