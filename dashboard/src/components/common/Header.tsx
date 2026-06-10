import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  faBars,
  faCrown,
  faRightFromBracket,
  faRightToBracket,
  faStar,
  faTableColumns,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import logo from "assets/logo_dark.svg";
import {
  DISCORD_OAUTH_URL,
  DISCORD_SERVER_URL,
  getUserPictureUrl,
} from "helpers/discord";
import { useMediaQuery } from "helpers/hooks";
import { useAdminNavMobile } from "helpers/adminNavMobile";
import { useServerNavMobile } from "helpers/serverNavMobile";
import theme from "helpers/theme";
import { Button, Dropdown, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import { useFetchUserQuery, useLogoutMutation } from "store/api";
import Loader from "./Loader";
import {
  HeaderActionButton,
  HeaderBrand,
  HeaderBrandGroup,
  HeaderExternalLink,
  HeaderServerNavButton,
  HeaderNav,
  HeaderNavbar,
  HeaderNavLink,
  HeaderRoot,
  LoginWrap,
  NavLoaderSlot,
  ToggleAvatar,
  UserAvatar,
  UserDropdownMenu,
  UserMenuName,
  UserMenuToggle,
} from "./Header/styles";

interface HeaderNavItemProps {
  to?: string;
  href?: string;
  target?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  icon: IconDefinition;
  label: string;
  className?: string;
}

const HeaderNavItem = ({
  to,
  href,
  target,
  onClick,
  icon,
  label,
  className,
}: HeaderNavItemProps) => {
  const content = (
    <>
      <FontAwesomeIcon icon={icon} />
      <span>{label}</span>
    </>
  );

  if (to) {
    return (
      <Nav.Item>
        <HeaderNavLink to={to} className={className} onClick={onClick}>
          {content}
        </HeaderNavLink>
      </Nav.Item>
    );
  }

  if (onClick) {
    return (
      <Nav.Item>
        <HeaderActionButton
          type="button"
          className={className}
          onClick={onClick}
        >
          {content}
        </HeaderActionButton>
      </Nav.Item>
    );
  }

  return (
    <Nav.Item>
      <HeaderExternalLink
        href={href}
        target={target}
        className={className}
        rel={target === "_blank" ? "noreferrer" : undefined}
      >
        {content}
      </HeaderExternalLink>
    </Nav.Item>
  );
};

const Header = () => {
  const user = useFetchUserQuery();
  const [logout] = useLogoutMutation();
  const location = useLocation();
  const serverNavMobile = useServerNavMobile();
  const adminNavMobile = useAdminNavMobile();
  const isMobile = useMediaQuery("(max-width: 992px)");
  const isServerDashboard = /^\/dashboard\/[^/]+/.test(location.pathname);
  const isAdminDashboard = /^\/admin(?:\/|$)/.test(location.pathname);
  const showServerNavButton =
    isMobile && isServerDashboard && Boolean(serverNavMobile);
  const showAdminNavButton =
    isMobile && isAdminDashboard && Boolean(adminNavMobile);

  const doLogout = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    try {
      await logout();
      window.location.reload();
    } catch (e) {
      console.log(`Error on logout: ${e}`);
    }
  };

  const renderDesktopNav = ({ data, isFetching }: typeof user) => (
    <HeaderNav className="d-none d-lg-flex">
      <HeaderNavItem
        href={DISCORD_SERVER_URL}
        target="_blank"
        icon={faDiscord}
        label="Join Server"
      />
      <HeaderNavItem to="/premium" icon={faCrown} label="Premium" />

      {isFetching ? (
        <NavLoaderSlot>
          <Loader width={160} height={40} foregroundColor={theme.secondary}>
            <rect x="0" y="12" rx="3" ry="3" width="100" height="16" />
            <circle cx="140" cy="20" r="18" />
          </Loader>
        </NavLoaderSlot>
      ) : data ? (
        <Dropdown align="end" as={Nav.Item}>
          <Dropdown.Toggle as={UserMenuToggle} id="dropdown-header">
            <UserAvatar
              roundedCircle
              src={getUserPictureUrl(data)}
              alt={data.username}
            />
            <UserMenuName>{data.username}</UserMenuName>
          </Dropdown.Toggle>

          <Dropdown.Menu as={UserDropdownMenu} align="end">
            {data.admin && (
              <Dropdown.Item as={NavLink} to="/admin">
                <FontAwesomeIcon icon={faUserGear} />
                <span>Admin</span>
              </Dropdown.Item>
            )}
            <Dropdown.Item as={NavLink} to="/dashboard">
              <FontAwesomeIcon icon={faTableColumns} />
              <span>Dashboard</span>
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/subscriptions">
              <FontAwesomeIcon icon={faStar} />
              <span>Subscriptions</span>
            </Dropdown.Item>
            <Dropdown.Item
              as="button"
              type="button"
              className="text-danger"
              onClick={doLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>Logout</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <LoginWrap>
          <Button href={DISCORD_OAUTH_URL} size="sm" className="px-4">
            Login
          </Button>
        </LoginWrap>
      )}
    </HeaderNav>
  );

  const renderMobileNav = ({ data, isFetching }: typeof user) => (
    <HeaderNav className="d-lg-none flex-column align-items-stretch">
      {data?.admin && (
        <HeaderNavItem to="/admin" icon={faUserGear} label="Admin" />
      )}
      <HeaderNavItem to="/premium" icon={faCrown} label="Premium" />
      <HeaderNavItem
        href={DISCORD_SERVER_URL}
        target="_blank"
        icon={faDiscord}
        label="Join Server"
      />
      {isFetching ? (
        <NavLoaderSlot>
          <Loader width={220} height={20} foregroundColor={theme.secondary}>
            <rect x="0" y="2" rx="3" ry="3" width="120" height="16" />
          </Loader>
        </NavLoaderSlot>
      ) : data ? (
        <>
          <HeaderNavItem
            to="/dashboard"
            icon={faTableColumns}
            label="Dashboard"
          />
          <HeaderNavItem
            to="/subscriptions"
            icon={faStar}
            label="Subscriptions"
          />
          <HeaderNavItem
            onClick={doLogout}
            icon={faRightFromBracket}
            label="Logout"
            className="text-danger"
          />
        </>
      ) : (
        <HeaderNavItem
          href={DISCORD_OAUTH_URL}
          icon={faRightToBracket}
          label="Login"
          className="text-primary"
        />
      )}
    </HeaderNav>
  );

  return (
    <HeaderRoot>
      <HeaderNavbar collapseOnSelect expand="lg" variant="dark">
        <HeaderBrandGroup>
          {showServerNavButton && (
            <HeaderServerNavButton
              type="button"
              aria-label="Open server navigation"
              onClick={() => serverNavMobile?.openServerNav()}
            >
              <FontAwesomeIcon icon={faBars} />
            </HeaderServerNavButton>
          )}
          {showAdminNavButton && (
            <HeaderServerNavButton
              type="button"
              aria-label="Open admin navigation"
              onClick={() => adminNavMobile?.openAdminNav()}
            >
              <FontAwesomeIcon icon={faBars} />
            </HeaderServerNavButton>
          )}

          <HeaderBrand as={NavLink} to="/">
            <img src={logo} alt="Albion Killbot" />
          </HeaderBrand>
        </HeaderBrandGroup>

        <Navbar.Toggle aria-controls="header-navbar-nav">
          {user.data && (
            <ToggleAvatar
              roundedCircle
              src={getUserPictureUrl(user.data)}
              alt={user.data.username}
            />
          )}
        </Navbar.Toggle>

        <Navbar.Collapse id="header-navbar-nav" className="justify-content-end">
          {isMobile ? renderMobileNav(user) : renderDesktopNav(user)}
        </Navbar.Collapse>
      </HeaderNavbar>
    </HeaderRoot>
  );
};

export default Header;
