import {
  faArrowRight,
  faCircleCheck,
  faPlus,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServerPictureUrl } from "helpers/discord";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ServerPartial } from "types/server";
import {
  DashboardServerBanner,
  DashboardServerBannerImage,
  DashboardServerBannerOverlay,
  DashboardServerBody,
  DashboardServerCard,
  DashboardServerFooter,
  DashboardServerHero,
  DashboardServerIcon,
  DashboardServerIconButton,
  DashboardServerName,
  DashboardServerStatus,
} from "./styles";

interface Props {
  server: ServerPartial;
  onInvite: (server: ServerPartial) => void;
}

const DashboardManageableServerCard = ({ server, onInvite }: Props) => {
  const navigate = useNavigate();
  const status = server.bot ? "active" : "setup";

  const handleIconClick = () => {
    if (server.bot) {
      navigate(server.id);
      return;
    }

    onInvite(server);
  };

  return (
    <DashboardServerCard $status={status}>
      <DashboardServerHero>
        <DashboardServerBanner>
          <DashboardServerBannerImage
            src={getServerPictureUrl(server, false)}
            alt=""
          />
          <DashboardServerBannerOverlay />
          <DashboardServerStatus $status={status}>
            <FontAwesomeIcon
              icon={status === "active" ? faCircleCheck : faRobot}
            />
            {status === "active" ? "Connected" : "Setup required"}
          </DashboardServerStatus>
        </DashboardServerBanner>
        <DashboardServerIconButton
          type="button"
          aria-label={
            server.bot
              ? `Open dashboard for ${server.name}`
              : `Invite bot to ${server.name}`
          }
          onClick={handleIconClick}
        >
          <DashboardServerIcon src={getServerPictureUrl(server, true)} alt="" />
        </DashboardServerIconButton>
      </DashboardServerHero>

      <DashboardServerBody>
        <DashboardServerName title={server.name}>
          {server.name}
        </DashboardServerName>
      </DashboardServerBody>

      <DashboardServerFooter>
        {server.bot ? (
          <Link to={server.id}>
            <Button variant="primary">
              Open dashboard
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </Button>
          </Link>
        ) : (
          <Button variant="secondary" onClick={() => onInvite(server)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Invite bot
          </Button>
        )}
      </DashboardServerFooter>
    </DashboardServerCard>
  );
};

export default DashboardManageableServerCard;
