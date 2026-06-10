import { Image, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const HeaderRoot = styled.header`
  background-color: ${({ theme }) => theme.surface};
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.05)
    ),
    linear-gradient(
      180deg,
      rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.06) 0%,
      transparent 100%
    );
  border-bottom: 1px solid ${({ theme }) => theme.borderSubtle};
`;

export const HeaderNavbar = styled(Navbar)`
  --bs-navbar-color: ${({ theme }) => theme.text};
  --bs-navbar-hover-color: ${({ theme }) => theme.primary};
  --bs-navbar-active-color: ${({ theme }) => theme.primary};
  --bs-navbar-toggler-border-color: ${({ theme }) => theme.borderSubtle};
  --bs-nav-pills-link-active-bg: ${({ theme }) => theme.nav.activeBackground};
  --bs-nav-pills-link-active-color: ${({ theme }) => theme.primary};

  padding: 0.5rem 1rem;

  .navbar-nav {
    .nav-link.active,
    a.active {
      background-color: ${({ theme }) => theme.nav.activeBackground} !important;
      color: ${({ theme }) => theme.primary} !important;
    }
  }

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    padding: 0.625rem 2rem;
  }
`;

export const HeaderBrandGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 1;
  min-width: 0;
  margin-right: auto;
`;

export const HeaderServerNavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.borderSubtle};
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  background-color: ${({ theme }) => theme.surfaceElevated};
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.04),
    rgba(255, 255, 255, 0.04)
  );
  color: ${({ theme }) => theme.text};
  transition: border-color 0.2s ease, color 0.2s ease;

  svg {
    width: 1rem;
  }

  &:hover {
    border-color: rgba(
      ${({ theme }) => theme.rgb?.primary ?? "255,189,89"},
      0.45
    );
    color: ${({ theme }) => theme.primary};
  }
`;

export const HeaderBrand = styled(Navbar.Brand)`
  flex-shrink: 1;
  min-width: 0;
  margin-right: 0;
  padding: 0;
  transition: transform 0.16s ease;

  &:focus,
  &:focus-visible,
  &:active {
    transform: scale(0.96);
    ring: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  img {
    display: block;
    height: 2.5rem;
    max-width: min(280px, 55vw);
    width: auto;
    transition: filter 0.16s ease;

    @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
      height: 3rem;
      max-width: 320px;
    }
  }

  &:active img {
    filter: brightness(1.1);
  }
`;

export const HeaderNav = styled(Nav)`
  align-items: center;
  gap: 0.125rem;

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    gap: 0.5rem;
  }

  @media (max-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    width: 100%;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
    border-top: 1px solid ${({ theme }) => theme.borderSubtle};

    .nav-item {
      width: 100%;
    }
  }
`;

export const HeaderNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: background-color 0.2s ease, color 0.2s ease;

  svg {
    width: 1.125rem;
    flex-shrink: 0;
    text-align: center;
  }

  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: rgba(255, 255, 255, 0.05);
  }

  &.active {
    color: ${({ theme }) => theme.primary} !important;
    background-color: ${({ theme }) => theme.nav.activeBackground} !important;
  }

  &.text-danger {
    color: ${({ theme }) => theme.danger};

    &:hover {
      color: ${({ theme }) => theme.danger};
      background-color: rgba(196, 41, 54, 0.12);
    }
  }

  &.text-primary {
    color: ${({ theme }) => theme.primary};
  }

  @media (max-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    width: 100%;
  }

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    padding: 0.5rem 1rem;
  }
`;

export const HeaderExternalLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: background-color 0.2s ease, color 0.2s ease;

  svg {
    width: 1.125rem;
    flex-shrink: 0;
    text-align: center;
  }

  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    width: 100%;
  }

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    padding: 0.5rem 1rem;
  }
`;

export const HeaderActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.875rem;
  border: 0;
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  text-align: left;
  box-sizing: border-box;
  transition: background-color 0.2s ease, color 0.2s ease;

  svg {
    width: 1.125rem;
    flex-shrink: 0;
    text-align: center;
  }

  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: rgba(255, 255, 255, 0.05);
  }

  &.text-danger {
    color: ${({ theme }) => theme.danger};

    &:hover {
      color: ${({ theme }) => theme.danger};
      background-color: rgba(196, 41, 54, 0.12);
    }
  }

  @media (max-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    width: 100%;
  }

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    padding: 0.5rem 1rem;
  }
`;

export const UserMenuToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0.75rem 0.35rem 0.35rem;
  border: 1px solid ${({ theme }) => theme.borderSubtle};
  border-radius: 999px;
  background-color: ${({ theme }) => theme.surfaceElevated};
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.04),
    rgba(255, 255, 255, 0.04)
  );
  color: ${({ theme }) => theme.text};
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:hover,
  &:focus,
  &.show {
    border-color: rgba(
      ${({ theme }) => theme.rgb?.primary ?? "255,189,89"},
      0.45
    );
    background-color: rgba(255, 255, 255, 0.06);
    color: ${({ theme }) => theme.text};
  }

  &::after {
    margin-left: 0.125rem;
  }
`;

export const UserMenuName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UserAvatar = styled(Image)`
  width: 36px;
  height: 36px;
  object-fit: cover;
  box-shadow: 0 0 0 2px
    rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.25);
`;

export const ToggleAvatar = styled(UserAvatar)`
  width: 40px;
  height: 40px;
`;

export const LoginWrap = styled.div`
  padding: 0.25rem 0;

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    padding: 0 0 0 0.5rem;
  }
`;

export const UserDropdownMenu = styled.div`
  &.dropdown-menu {
    margin-top: 0.5rem;
    padding: 0.375rem;
    background-color: ${({ theme }) => theme.surfaceElevated};
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.05)
    );
    border: 1px solid ${({ theme }) => theme.borderSubtle};
    border-radius: ${({ theme }) => theme.layout.navItemRadius};
    box-shadow: 0 8px 24px rgb(0 0 0 / 35%);

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem 0.75rem;
      border-radius: calc(
        ${({ theme }) => theme.layout.navItemRadius} - 0.125rem
      );
      color: ${({ theme }) => theme.text};
      font-size: 0.9rem;

      svg {
        width: 1.125rem;
        flex-shrink: 0;
      }

      &:hover,
      &:focus {
        color: ${({ theme }) => theme.primary};
        background-color: rgba(255, 255, 255, 0.06);
      }

      &.text-danger,
      &.text-danger:hover,
      &.text-danger:focus {
        color: ${({ theme }) => theme.danger};
        background-color: rgba(196, 41, 54, 0.12);
      }
    }
  }
`;

export const NavLoaderSlot = styled.div`
  padding: 0.5rem 0.875rem;

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    padding: 0.5rem 1rem;
  }
`;
