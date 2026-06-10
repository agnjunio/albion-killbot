import { ContentPanelRoot } from "components/layout/ContentPanel";
import { Offcanvas } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import styled from "styled-components";

export const LayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  min-width: 0;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    flex-direction: row;
    align-items: flex-start;
    gap: ${({ theme }) => theme.layout.padding.layoutGap.lg};
  }

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.xl}) {
    gap: ${({ theme }) => theme.layout.padding.layoutGap.xl};
  }

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.xxl}) {
    gap: ${({ theme }) => theme.layout.padding.layoutGap.xxl};
  }
`;

export const SidebarColumn = styled.aside`
  display: none;
  flex-shrink: 0;
  width: ${({ theme }) => theme.layout.sidebarWidth};

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    display: block;
    position: sticky;
    top: 1rem;
    align-self: flex-start;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
  }
`;

export const SidebarPanel = styled.div`
  padding: ${({ theme }) => theme.layout.padding.panel.base};

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    padding: ${({ theme }) => theme.layout.padding.sidebar.lg};
  }

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.xl}) {
    padding: ${({ theme }) => theme.layout.padding.sidebar.xl};
  }

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.xxl}) {
    padding: ${({ theme }) => theme.layout.padding.sidebar.xxl};
  }

  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.surface};
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.06),
      rgba(255, 255, 255, 0.06)
    ),
    linear-gradient(
      180deg,
      rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.08) 0%,
      transparent 35%
    );
  border: 1px solid ${({ theme }) => theme.borderSubtle};
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
`;

export const MobileNavOffcanvas = styled(Offcanvas)`
  &.offcanvas {
    background-color: ${({ theme }) => theme.surface};
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.06),
        rgba(255, 255, 255, 0.06)
      ),
      linear-gradient(
        180deg,
        rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.08) 0%,
        transparent 35%
      );
    border-right: 1px solid ${({ theme }) => theme.borderSubtle};
    color: ${({ theme }) => theme.text};
  }

  .offcanvas-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.borderSubtle};
    padding: 1rem;
  }

  .offcanvas-title {
    color: ${({ theme }) => theme.text};
    font-size: 0.95rem;
    font-weight: 500;
  }

  .btn-close {
    filter: invert(1) grayscale(100%) brightness(200%);
    opacity: 0.7;
  }

  .offcanvas-body {
    padding: ${({ theme }) => theme.layout.padding.panel.base};
  }
`;

export const MainColumn = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  max-width: none;
`;

export const ContentPanel = styled(ContentPanelRoot)`
  .list-group {
    background-color: ${({ theme }) => theme.surfaceElevated};
    background-image: none;
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.borderSubtle};
    border-radius: ${({ theme }) => theme.layout.navItemRadius};
  }

  .list-group-item {
    background-color: ${({ theme }) => theme.surfaceElevated};
    border-color: ${({ theme }) => theme.borderSubtle};

    &.list-group-item-secondary {
      background-color: ${({ theme }) => theme.secondary};
      color: ${({ theme }) => theme.text};
    }

    &.paper {
      background-color: rgba(255, 255, 255, 0.03);
      background-image: none;
    }
  }

  /* Entity lists: clip children to one rounded rect (overrides global list-group item radii) */
  .entity-list.list-group {
    overflow: hidden;
    border-radius: ${({ theme }) => theme.layout.navItemRadius};
    box-shadow: none;
    background-image: none;
    border: none;
  }

  .entity-list.list-group .list-group-item {
    border-radius: 0 !important;
  }

  .id-text {
    color: ${({ theme }) => theme.subtleText};
    font-size: 11px;
    line-height: 1.2;
  }

  .track-list-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .track-list-item-info {
    min-width: 0;
    flex: 1 1 12rem;
  }

  .track-list-item-actions {
    flex-shrink: 0;
  }

  .search-form .search-form-field {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .search-input-group {
    flex-wrap: nowrap;
    border-radius: ${({ theme }) => theme.layout.navItemRadius};
    overflow: visible;
    gap: 0;
  }

  .search-input-group > .form-control {
    flex: 1 1 auto;
    min-width: 0;
    border-radius: 0;
  }

  .search-input-group > .form-control:first-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: ${({ theme }) => theme.layout.navItemRadius};
  }

  .search-input-group > .search-input-actions {
    flex-shrink: 0;
  }

  .search-input-actions {
    display: flex;
    flex-shrink: 0;
  }

  .search-input-actions > .search-server-toggle,
  .search-input-actions > .dropdown-toggle {
    border-radius: 0;
    max-width: 9rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .search-input-actions > .search-input-submit {
    border-radius: 0;
    border-top-right-radius: ${({ theme }) => theme.layout.navItemRadius};
    border-bottom-right-radius: ${({ theme }) => theme.layout.navItemRadius};
  }

  .search-input-actions > .dropdown-menu {
    z-index: 1050;
  }

  @media (max-width: ${({ theme }) => theme.layout.breakpoints.sm}) {
    .search-input-group {
      flex-direction: column;
      align-items: stretch;
      row-gap: 0.5rem;
    }

    .search-input-group > .form-control {
      flex: none;
      width: 100%;
      border-top-left-radius: 0 !important;
      border-top-right-radius: ${({ theme }) =>
        theme.layout.navItemRadius} !important;
      border-bottom-left-radius: ${({ theme }) =>
        theme.layout.navItemRadius} !important;
      border-bottom-right-radius: ${({ theme }) =>
        theme.layout.navItemRadius} !important;
    }

    .search-input-group > .search-input-actions {
      width: 100%;
      margin-left: 0 !important;
    }

    .search-input-actions > .search-server-toggle,
    .search-input-actions > .dropdown-toggle,
    .search-input-actions > .search-input-submit {
      margin-left: 0 !important;
    }

    .search-input-actions > .search-server-toggle,
    .search-input-actions > .dropdown-toggle {
      flex: 1 1 auto;
      width: auto;
      max-width: none;
      --bs-btn-border-radius: 0;
      border-top-left-radius: ${({ theme }) =>
        theme.layout.navItemRadius} !important;
      border-bottom-left-radius: ${({ theme }) =>
        theme.layout.navItemRadius} !important;
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }

    .search-input-actions > .search-input-submit {
      flex: 0 0 auto;
      --bs-btn-border-radius: 0;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      border-top-right-radius: ${({ theme }) =>
        theme.layout.navItemRadius} !important;
      border-bottom-right-radius: ${({ theme }) =>
        theme.layout.navItemRadius} !important;
      border-left: 1px solid ${({ theme }) => theme.text}2f;
    }
  }

  .search-results-panel {
    background-color: rgba(61, 154, 92, 0.06);
    border-top: 1px solid rgba(61, 154, 92, 0.25);
    overflow: hidden;
  }

  .search-results-panel-header {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #7bc995;
    border-bottom: 1px solid rgba(61, 154, 92, 0.15);
  }

  .tracked-entities-card {
    border-top: 2px solid ${({ theme }) => theme.primary};
    overflow: hidden;
  }

  .tracked-entities-card-header {
    background-color: ${({ theme }) => theme.nav.activeBackground};
    border-bottom-color: rgba(
      ${({ theme }) => theme.rgb?.primary ?? "255,189,89"},
      0.25
    );
    color: ${({ theme }) => theme.text};
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .entity-list-header-hint {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.85;
  }

  .entity-list .entity-list-header {
    padding: 0.35rem 0.625rem;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.25;
  }

  .entity-list .entity-list-header .badge {
    font-size: 0.65rem;
    font-weight: 500;
    padding: 0.2em 0.45em;
  }

  .entity-list--search {
    border: 1px solid rgba(61, 154, 92, 0.22);
    border-left-width: 3px;
    border-left-color: #3d9a5c;
  }

  .entity-list--search .entity-list-header {
    background-color: rgba(61, 154, 92, 0.14);
    color: ${({ theme }) => theme.text};
    border-color: rgba(61, 154, 92, 0.2);
  }

  .entity-list--search .entity-list-header-hint {
    color: #7bc995;
  }

  .entity-list--search .entity-item {
    background-color: rgba(61, 154, 92, 0.04);
    border-color: rgba(61, 154, 92, 0.12);
  }

  .entity-list--search .entity-item--added {
    background-color: rgba(255, 255, 255, 0.02);
    opacity: 0.75;
  }

  .entity-list--tracked {
    border: 1px solid
      rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.2);
    border-left-width: 3px;
    border-left-color: ${({ theme }) => theme.primary};
  }

  .entity-list--tracked .entity-list-header {
    background-color: ${({ theme }) => theme.nav.activeBackground};
    color: ${({ theme }) => theme.text};
    border-color: rgba(
      ${({ theme }) => theme.rgb?.primary ?? "255,189,89"},
      0.2
    );
  }

  .entity-list--tracked .entity-item--tracked {
    background-color: rgba(
      ${({ theme }) => theme.rgb?.primary ?? "255,189,89"},
      0.05
    );
    border-color: rgba(
      ${({ theme }) => theme.rgb?.primary ?? "255,189,89"},
      0.1
    );
  }
`;

export const ServerIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ theme }) => theme.borderSubtle};
`;

export const OffcanvasHeaderIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
  padding-right: 0.5rem;
`;

export const ChangeServerLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.subtleText};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

export const ServerIcon = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
  user-select: none;
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 80%),
    0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
`;

export const ServerName = styled.div`
  font-weight: 500;
  font-size: 0.95rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const NavSections = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.layout.navSectionGap};
`;

export const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const NavSectionLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.mutedText};
  padding: 0 0.75rem 0.25rem;
`;

export const NavItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  border-left: 3px solid transparent;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease,
    border-color 0.2s ease;

  &.active {
    background-color: ${({ theme }) => theme.nav.activeBackground} !important;
    border-left-color: ${({ theme }) => theme.nav.activeBorder};
    color: ${({ theme }) => theme.primary} !important;
  }

  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: rgba(255, 255, 255, 0.05);
  }

  &.active:hover {
    background-color: ${({ theme }) => theme.nav.activeBackground};
  }

  svg.nav-icon {
    width: 1rem;
    flex-shrink: 0;
    text-align: center;
  }
`;

export const NavItemLabel = styled.span`
  flex: 1;
  font-size: 0.9rem;
`;

export const PageHeaderRoot = styled.header`
  position: relative;
  margin-bottom: 1.25rem;
  padding: 0 0 1rem 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderSubtle};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    border-radius: 0 2px 2px 0;
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.primary} 0%,
      rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.2) 100%
    );
  }
`;

export const PageHeaderContent = styled.div`
  min-width: 0;
`;

export const PageTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
`;

export const PageTitleIcon = styled.span`
  display: none;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  background-color: ${({ theme }) => theme.nav.activeBackground};
  border: 1px solid
    rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.25);
  color: ${({ theme }) => theme.primary};

  svg {
    width: 0.95rem;
  }

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    display: inline-flex;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.text};

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

export const PagePremiumBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text};
  background-color: rgba(
    ${({ theme }) => theme.rgb?.primary ?? "255,189,89"},
    0.16
  );
  border: 1px solid
    rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.35);

  svg {
    width: 0.7rem;
  }
`;

export const PageDescription = styled.p`
  margin: 0.5rem 0 0;
  padding-left: 0.125rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.subtleText};
  line-height: 1.45;
  max-width: 42rem;
`;

export const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SubscriptionAlertSlot = styled.div`
  margin-bottom: 0.25rem;
`;
