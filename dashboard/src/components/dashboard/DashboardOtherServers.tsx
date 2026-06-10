import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServerPictureUrl } from "helpers/discord";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ServerPartial } from "types/server";
import {
  DashboardSection,
  DashboardSectionCount,
  DashboardSectionHeader,
  DashboardSectionHint,
  DashboardSectionTitle,
  OtherServerIcon,
  OtherServerInfo,
  OtherServerLock,
  OtherServerMeta,
  OtherServerName,
  OtherServerRow,
  OtherServersPanel,
} from "./styles";

interface Props {
  servers: ServerPartial[];
}

const DashboardOtherServers = ({ servers }: Props) => {
  if (servers.length === 0) return null;

  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <DashboardSectionTitle>Other servers</DashboardSectionTitle>
        <DashboardSectionCount>{servers.length}</DashboardSectionCount>
      </DashboardSectionHeader>
      <DashboardSectionHint>
        Visible on your Discord account, but only owners and administrators can
        manage the bot.
      </DashboardSectionHint>

      <OtherServersPanel>
        {servers.map((server) => (
          <OverlayTrigger
            key={server.id}
            overlay={
              <Tooltip id={`other-server-${server.id}`}>
                Owner or Administrator permission required
              </Tooltip>
            }
          >
            <OtherServerRow tabIndex={0}>
              <OtherServerIcon
                src={getServerPictureUrl(server, true)}
                alt={server.name}
              />
              <OtherServerInfo>
                <OtherServerName title={server.name}>
                  {server.name}
                </OtherServerName>
                <OtherServerMeta>View only</OtherServerMeta>
              </OtherServerInfo>
              <OtherServerLock>
                <FontAwesomeIcon icon={faLock} />
                Locked
              </OtherServerLock>
            </OtherServerRow>
          </OverlayTrigger>
        ))}
      </OtherServersPanel>
    </DashboardSection>
  );
};

export default DashboardOtherServers;
