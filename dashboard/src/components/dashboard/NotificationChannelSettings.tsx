import ChannelInput from "components/dashboard/ChannelInput";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTestNotificationSettingsMutation } from "store/api";
import { IChannel } from "types/server";

interface NotificationChannelSettingsProps {
  idPrefix: string;
  channelAriaLabel: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  channel: string;
  onChannelChange: (channelId: string) => void;
  channels: IChannel[];
  serverId: string;
  notificationType: string;
  testMode?: string;
  disabled?: boolean;
}

const NotificationChannelSettings = ({
  idPrefix,
  channelAriaLabel,
  enabled,
  onEnabledChange,
  channel,
  onChannelChange,
  channels,
  serverId,
  notificationType,
  testMode,
  disabled = false,
}: NotificationChannelSettingsProps) => {
  const [dispatchTestNotification, testNotification] =
    useTestNotificationSettingsMutation();

  return (
    <>
      <Form.Group controlId={`${idPrefix}-enabled`}>
        <Form.Check
          type="switch"
          label="Enabled"
          checked={enabled}
          disabled={disabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
        />
      </Form.Group>

      <Row className="g-2 align-items-end">
        <Col xs={12} md={true}>
          <Form.Group controlId={`${idPrefix}-channel`}>
            <Form.Label>Notification Channel</Form.Label>
            <ChannelInput
              aria-label={channelAriaLabel}
              disabled={disabled || !enabled}
              availableChannels={channels}
              value={channel}
              onChannelChange={onChannelChange}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md="auto">
          <Button
            disabled={disabled || !enabled || testNotification.isLoading}
            variant="secondary"
            type="button"
            onClick={() => {
              dispatchTestNotification({
                serverId,
                type: notificationType,
                channelId: channel,
                ...(testMode ? { mode: testMode } : {}),
              });
            }}
          >
            Test Notification
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default NotificationChannelSettings;
