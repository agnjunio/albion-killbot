import ChannelInput from "components/ChannelInput";
import Loader from "components/Loader";
import { useAppDispatch, useAppSelector } from "helpers/hooks";
import { capitalize, getLocaleName } from "helpers/utils";
import { useEffect } from "react";
import { Button, Card, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useFetchServerQuery, useUpdateSettingsMutation } from "store/api";
import {
  loadSettings,
  setBattlesChannel,
  setBattlesEnabled,
  setDeathsChannel,
  setDeathsEnabled,
  setDeathsMode,
  setKillsChannel,
  setKillsEnabled,
  setKillsMode,
  setLang,
  setRankingsChannel,
  setRankingsEnabled,
  setRankingsGuildRanking,
  setRankingsPvpRanking,
} from "store/settings";

const languages = ["en", "pt", "es", "fr", "ru"];
const notificationModes = ["image", "text"];
const rankingModes = ["off", "hourly", "daily"];

const Settings = () => {
  const { serverId = "" } = useParams();
  const server = useFetchServerQuery(serverId);
  const [dispatchUpdateSettings, updateSettings] = useUpdateSettingsMutation();
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (server?.data?.settings) {
      dispatch(loadSettings(server.data.settings));
    }
  }, [dispatch, server.data]);

  if (server.isFetching || updateSettings.isLoading) return <Loader />;
  if (!server.data || !server.data.settings)
    return (
      <div className="p-2 d-flex justify-content-center">No data found</div>
    );

  const renderLanguageOptions = (lang: string) => {
    return (
      <option key={lang} value={lang}>
        {getLocaleName(lang)}
      </option>
    );
  };

  const renderNotificationModeOptions = (killMode: string) => {
    return (
      <option key={killMode} value={killMode}>
        {capitalize(killMode)}
      </option>
    );
  };

  const renderRankingModeOptions = (rankingMode: string) => {
    return (
      <option key={rankingMode} value={rankingMode}>
        {capitalize(rankingMode)}
      </option>
    );
  };

  const { channels } = server.data;
  const { lang, kills, deaths, battles, rankings } = settings;

  return (
    <Card>
      <Form
        onSubmit={async () => {
          await dispatchUpdateSettings({ serverId, settings });
        }}
      >
        <Tabs fill={true}>
          <Tab eventKey="general" title="General" className="px-3">
            <Form.Group controlId="language" className="mt-3">
              <Form.Label>Language</Form.Label>
              <Form.Select
                aria-label="Language select"
                value={lang}
                onChange={(e) => dispatch(setLang(e.target.value))}
              >
                {languages.map(renderLanguageOptions)}
              </Form.Select>
            </Form.Group>
          </Tab>

          <Tab eventKey="kills" title="Kills" className="px-3">
            <Form.Group controlId="kills-enabled" className="mt-3">
              <Form.Check
                type="switch"
                label="Enabled"
                checked={kills.enabled}
                onChange={(e) => dispatch(setKillsEnabled(e.target.checked))}
              />
            </Form.Group>
            <Form.Group controlId="kills-channel" className="py-2">
              <Form.Label>Notification Channel</Form.Label>
              <ChannelInput
                aria-label="Kills channel"
                disabled={!kills.enabled}
                availableChannels={channels}
                value={kills.channel}
                onChannelChange={(channelId) =>
                  dispatch(setKillsChannel(channelId))
                }
              />
            </Form.Group>
            <Form.Group controlId="kills-mode" className="py-2">
              <Form.Label>Mode</Form.Label>
              <Form.Select
                aria-label="Notification mode"
                disabled={!kills.enabled}
                value={kills.mode}
                onChange={(e) => dispatch(setKillsMode(e.target.value))}
              >
                {notificationModes.map(renderNotificationModeOptions)}
              </Form.Select>
            </Form.Group>
          </Tab>

          <Tab eventKey="deaths" title="Deaths" className="px-3">
            <Form.Group controlId="kills-enabled" className="mt-3">
              <Form.Check
                type="switch"
                label="Enabled"
                checked={deaths.enabled}
                onChange={(e) => dispatch(setDeathsEnabled(e.target.checked))}
              />
            </Form.Group>
            <Form.Group controlId="kills-channel" className="py-2">
              <Form.Label>Notification Channel</Form.Label>
              <ChannelInput
                aria-label="Deaths channel"
                disabled={!deaths.enabled}
                availableChannels={channels}
                value={deaths.channel}
                onChannelChange={(channelId) =>
                  dispatch(setDeathsChannel(channelId))
                }
              />
            </Form.Group>
            <Form.Group controlId="deaths-mode" className="py-2">
              <Form.Label>Mode</Form.Label>
              <Form.Select
                aria-label="Notification mode"
                disabled={!deaths.enabled}
                value={deaths.mode}
                onChange={(e) => dispatch(setDeathsMode(e.target.value))}
              >
                {notificationModes.map(renderNotificationModeOptions)}
              </Form.Select>
            </Form.Group>
          </Tab>

          <Tab eventKey="battles" title="Battles" className="px-3">
            <Form.Group controlId="kills-enabled" className="mt-3">
              <Form.Check
                type="switch"
                label="Enabled"
                checked={battles.enabled}
                onChange={(e) => dispatch(setBattlesEnabled(e.target.checked))}
              />
            </Form.Group>
            <Form.Group controlId="battles-channel" className="py-2">
              <Form.Label>Notification Channel</Form.Label>
              <ChannelInput
                aria-label="Battles channel"
                disabled={!battles.enabled}
                availableChannels={channels}
                value={battles.channel}
                onChannelChange={(channelId) =>
                  dispatch(setBattlesChannel(channelId))
                }
              />
            </Form.Group>
          </Tab>

          <Tab eventKey="rankings" title="Rankings" className="px-3">
            <Form.Group controlId="kills-enabled" className="mt-3">
              <Form.Check
                type="switch"
                label="Enabled"
                checked={rankings.enabled}
                onChange={(e) => dispatch(setRankingsEnabled(e.target.checked))}
              />
            </Form.Group>
            <Form.Group controlId="rankings-channel" className="py-2">
              <Form.Label>Notification Channel</Form.Label>
              <ChannelInput
                aria-label="Rankings channel"
                disabled={!rankings.enabled}
                availableChannels={channels}
                value={rankings.channel}
                onChannelChange={(channelId) =>
                  dispatch(setRankingsChannel(channelId))
                }
              />
            </Form.Group>
            <Row>
              <Col sm={6}>
                <Form.Group controlId="rankings-pvp-mode" className="py-2">
                  <Form.Label>PvP Ranking Mode</Form.Label>
                  <Form.Select
                    aria-label="PvP ranking mode select"
                    disabled={!rankings.enabled}
                    value={rankings.pvpRanking}
                    onChange={(e) =>
                      dispatch(setRankingsPvpRanking(e.target.value))
                    }
                  >
                    {rankingModes.map(renderRankingModeOptions)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="rankings-guild-mode" className="py-2">
                  <Form.Label>Guild Ranking Mode</Form.Label>
                  <Form.Select
                    aria-label="Guild ranking mode select"
                    disabled={!rankings.enabled}
                    value={rankings.guildRanking}
                    onChange={(e) =>
                      dispatch(setRankingsGuildRanking(e.target.value))
                    }
                  >
                    {rankingModes.map(renderRankingModeOptions)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Tab>
        </Tabs>

        <div className="p-3">
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={() => {
                if (server?.data?.settings)
                  dispatch(loadSettings(server.data.settings));
              }}
            >
              Reset
            </Button>
            <div className="px-2" />
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default Settings;
