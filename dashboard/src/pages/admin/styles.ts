import { ContentPanelRoot } from "components/layout/ContentPanel";
import { Card, Offcanvas } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const AdminLayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
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

export const AdminSidebarColumn = styled.aside`
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

export const AdminSidebarPanel = styled.div`
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

export const AdminMobileNavOffcanvas = styled(Offcanvas)`
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
    border-bottom: 1px solid ${({ theme }) => theme.borderSubtle};
    padding: 1rem;
  }

  .offcanvas-title {
    color: ${({ theme }) => theme.text};
    font-size: 0.95rem;
    font-weight: 600;
  }

  .btn-close {
    filter: invert(1) grayscale(100%) brightness(200%);
    opacity: 0.7;
  }

  .offcanvas-body {
    padding: ${({ theme }) => theme.layout.padding.panel.base};
  }
`;

export const AdminMainColumn = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const AdminContentPanel = styled(ContentPanelRoot)`
  flex: 1;
`;

export const AdminContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
`;

export const AdminSidebarHeader = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.mutedText};
  padding: 0 0.75rem 0.75rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderSubtle};
`;

export const AdminNavSections = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const AdminNavItemLink = styled(NavLink)`
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

export const AdminNavItemLabel = styled.span`
  flex: 1;
  font-size: 0.9rem;
`;

export const AdminPageHeaderRoot = styled.header`
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

export const AdminPageHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
`;

export const AdminPageTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
`;

export const AdminPageTitleIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
  font-size: 1.1rem;
`;

export const AdminPageTitle = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.text};
`;

export const AdminPageDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.subtleText};
`;

export const AdminSectionTitle = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.text};
`;

export const AdminFilterPanel = styled(Card)`
  background-color: ${({ theme }) => theme.surfaceElevated};
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.05)
  );
  border: 1px solid ${({ theme }) => theme.borderSubtle};
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  box-shadow: none;

  .card-body {
    padding: 1rem;
  }
`;

export const AdminFilterFooter = styled(Card.Footer)`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: rgba(255, 255, 255, 0.03);
  border-color: ${({ theme }) => theme.borderSubtle};
`;

export const AdminDetailRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.5rem;
`;

export const AdminDetailLabel = styled.span`
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.9rem;
  flex-shrink: 0;
`;

export const AdminDetailValue = styled.span`
  color: ${({ theme }) => theme.primary};
  font-size: 0.9rem;
  word-break: break-word;

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: underline;
    text-underline-offset: 0.15em;

    &:visited {
      color: ${({ theme }) => theme.primary};
    }

    &:hover {
      color: ${({ theme }) => theme.text};
    }
  }
`;

export const AdminDetailSecondary = styled.span`
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.85rem;
`;

export const AdminKillListHint = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.subtleText};
`;

export const AdminPlayerListItemName = styled.span`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.25;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AdminPlayerListItemId = styled.span`
  display: block;
  font-size: 0.7rem;
  line-height: 1.2;
  color: ${({ theme }) => theme.subtleText};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AdminKillListItem = styled.div<{
  $selected?: boolean;
  $compact?: boolean;
}>`
  display: flex;
  align-items: ${({ $compact }) => ($compact ? "center" : "flex-start")};
  gap: ${({ $compact }) => ($compact ? "0.5rem" : "0.75rem")};
  padding: ${({ $compact }) =>
    $compact ? "0.4375rem 0.75rem" : "0.75rem 1rem"};
  border-bottom: 1px solid ${({ theme }) => theme.borderSubtle};
  border-left: 3px solid
    ${({ theme, $selected }) =>
      $selected ? theme.nav.activeBorder : "transparent"};
  cursor: pointer;
  user-select: none;
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.nav.activeBackground : "transparent"};
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme, $selected }) =>
      $selected ? theme.nav.activeBackground : "rgba(255, 255, 255, 0.05)"};
    border-left-color: ${({ theme, $selected }) =>
      $selected ? theme.nav.activeBorder : "rgba(255, 255, 255, 0.2)"};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: -2px;
  }

  .form-check {
    margin: ${({ $compact }) => ($compact ? "0" : "0.125rem 0 0")};
    padding: 0;
    pointer-events: none;
    flex-shrink: 0;
  }

  .form-check-input {
    width: ${({ $compact }) => ($compact ? "1rem" : "1.1rem")};
    height: ${({ $compact }) => ($compact ? "1rem" : "1.1rem")};
    margin: 0;
    cursor: pointer;
    border-color: ${({ theme }) => theme.borderSubtle};
    background-color: rgba(255, 255, 255, 0.04);

    &:checked {
      background-color: ${({ theme }) => theme.primary};
      border-color: ${({ theme }) => theme.primary};
    }

    &[type="radio"]:checked {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2' fill='%23000'/%3e%3c/svg%3e");
    }
  }
`;

export const AdminKillListItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AdminKillListItemPrimary = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
  font-size: 0.85rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.text};

  > * + *::before {
    content: "·";
    margin: 0 0.375rem;
    color: ${({ theme }) => theme.subtleText};
    font-weight: 400;
  }
`;

export const AdminKillListVictimName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

export const AdminKillListItemMeta = styled.div`
  margin-top: 0.125rem;
  font-size: 0.7rem;
  line-height: 1.2;
  color: ${({ theme }) => theme.subtleText};
`;

export const AdminDebugPanel = styled(Card)`
  background-color: ${({ theme }) => theme.surfaceElevated};
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.05)
  );
  border: 1px solid ${({ theme }) => theme.borderSubtle};
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  box-shadow: none;

  .card-header {
    background-color: rgba(255, 255, 255, 0.03);
    border-color: ${({ theme }) => theme.borderSubtle};
    color: ${({ theme }) => theme.text};
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0.75rem 1rem;
  }

  .card-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const AdminDropdownMenu = styled.div`
  &.dropdown-menu {
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
      padding: 0.5rem 0.75rem;
      border-radius: calc(
        ${({ theme }) => theme.layout.navItemRadius} - 0.125rem
      );
      color: ${({ theme }) => theme.text};
      font-size: 0.9rem;

      &:hover,
      &:focus {
        color: ${({ theme }) => theme.primary};
        background-color: rgba(255, 255, 255, 0.06);
      }
    }
  }
`;
