import NotificationChannelSettings from "components/dashboard/NotificationChannelSettings";
import { useAppDispatch, useAppSelector } from "helpers/hooks";
import { capitalize } from "helpers/utils";
import { Form, Stack } from "react-bootstrap";
import {
  setAssistsChannel,
  setAssistsEnabled,
  setAssistsMode,
  setAssistsProvider,
  setDeathsChannel,
  setDeathsEnabled,
  setDeathsMode,
  setDeathsProvider,
  setDepthsChannel,
  setDepthsEnabled,
  setDepthsMode,
  setDepthsProvider,
  setKillsChannel,
  setKillsEnabled,
  setKillsMode,
  setKillsProvider,
} from "store/settings";
import { IConstants } from "types/constants";
import { IChannel } from "types/server";

export type NotificationSettingsType = "kills" | "assists" | "deaths" | "depths";

interface NotificationSettingsFormProps {
  type: NotificationSettingsType;
  serverId: string;
  channels: IChannel[];
  modes: IConstants["modes"];
  providers: IConstants["providers"];
  disabled?: boolean;
}

const notificationConfig = {
  kills: {
    channelAriaLabel: "Kills channel",
    setEnabled: setKillsEnabled,
    setChannel: setKillsChannel,
    setMode: setKillsMode,
    setProvider: setKillsProvider,
  },
  assists: {
    channelAriaLabel: "Assists channel",
    setEnabled: setAssistsEnabled,
    setChannel: setAssistsChannel,
    setMode: setAssistsMode,
    setProvider: setAssistsProvider,
  },
  deaths: {
    channelAriaLabel: "Deaths channel",
    setEnabled: setDeathsEnabled,
    setChannel: setDeathsChannel,
    setMode: setDeathsMode,
    setProvider: setDeathsProvider,
  },
  depths: {
    channelAriaLabel: "Depths channel",
    setEnabled: setDepthsEnabled,
    setChannel: setDepthsChannel,
    setMode: setDepthsMode,
    setProvider: setDepthsProvider,
  },
} as const;

const NotificationSettingsForm = ({
  type,
  serverId,
  channels,
  modes,
  providers,
  disabled = false,
}: NotificationSettingsFormProps) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings[type]);
  const config = notificationConfig[type];

  return (
    <Stack gap={2}>
      <NotificationChannelSettings
        idPrefix={type}
        channelAriaLabel={config.channelAriaLabel}
        enabled={settings.enabled}
        onEnabledChange={(enabled) => dispatch(config.setEnabled(enabled))}
        channel={settings.channel}
        onChannelChange={(channelId) => dispatch(config.setChannel(channelId))}
        channels={channels}
        serverId={serverId}
        notificationType={type}
        testMode={settings.mode}
        disabled={disabled}
      />

      <Form.Group controlId={`${type}-mode`}>
        <Form.Label>Mode</Form.Label>
        <Form.Select
          aria-label="Notification mode"
          disabled={disabled || !settings.enabled}
          value={settings.mode}
          onChange={(e) => dispatch(config.setMode(e.target.value))}
        >
          {modes.map((mode) => (
            <option key={mode} value={mode}>
              {capitalize(mode)}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId={`${type}-provider`}>
        <Form.Label>Link Provider</Form.Label>
        <Form.Select
          aria-label="Links provider"
          disabled={disabled || !settings.enabled}
          value={settings.provider}
          onChange={(e) => dispatch(config.setProvider(e.target.value))}
        >
          {providers
            .filter((provider) => provider.events)
            .map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
        </Form.Select>
      </Form.Group>
    </Stack>
  );
};

export default NotificationSettingsForm;
