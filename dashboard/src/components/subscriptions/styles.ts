import { Card, Image } from "react-bootstrap";
import styled, { css } from "styled-components";

export const PriceCardRoot = styled(Card)<{ $popular?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  background-color: ${({ theme }) => theme.surfaceElevated};
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.05)
  );
  border: 1px solid ${({ theme }) => theme.borderSubtle};
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  box-shadow: none;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: rgba(
      ${({ theme }) => theme.rgb?.primary ?? "255,189,89"},
      0.28
    );
    box-shadow: 0 10px 28px rgb(0 0 0 / 28%);
    transform: translateY(-2px);
  }

  ${({ $popular, theme }) =>
    $popular &&
    css`
      border-color: rgba(${theme.rgb?.primary ?? "255,189,89"}, 0.45);
      box-shadow: 0 0 0 1px rgba(${theme.rgb?.primary ?? "255,189,89"}, 0.2),
        0 8px 24px rgba(${theme.rgb?.primary ?? "255,189,89"}, 0.12);

      &:hover {
        border-color: rgba(${theme.rgb?.primary ?? "255,189,89"}, 0.58);
        box-shadow: 0 0 0 1px rgba(${theme.rgb?.primary ?? "255,189,89"}, 0.28),
          0 12px 32px rgba(${theme.rgb?.primary ?? "255,189,89"}, 0.18);
        transform: translateY(-3px);
      }
    `}

  .card-img-top {
    border-bottom: 1px solid ${({ theme }) => theme.borderSubtle};
  }

  .card-body {
    color: ${({ theme }) => theme.text};
  }

  .card-footer {
    margin-top: auto;
    background-color: rgba(255, 255, 255, 0.03);
    border-color: ${({ theme }) => theme.borderSubtle};
  }
`;

export const PriceTagBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0;
  padding: 0.2rem 0.55rem;
  border-radius: 999px 0 0 999px;
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
  border-right: 0;
  box-shadow: 0 4px 12px rgb(0 0 0 / 35%);
`;

export const PriceAmountRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 0.25rem;
  color: ${({ theme }) => theme.text};

  h4 {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 600;
  }
`;

export const PriceRecurrence = styled.span`
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.9rem;
`;

export const PriceDivider = styled.hr`
  margin: 0 0.75rem;
  border-color: ${({ theme }) => theme.borderSubtle};
  opacity: 1;
`;

export const PriceFeatureList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const PriceFeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.borderSubtle};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;

  &:last-child {
    border-bottom: 0;
  }

  svg {
    flex-shrink: 0;
    width: 1rem;
    color: ${({ theme }) => theme.primary};
  }
`;

export const PriceCheckoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.contrastText};
  font-size: 0.95rem;
  font-weight: 500;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(1.08);
  }

  svg {
    width: 1.125rem;
  }
`;

export const PremiumCurrencyLabel = styled.span`
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.9rem;
`;

export const PremiumLink = styled.a`
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 0.15em;

  &:visited {
    color: ${({ theme }) => theme.primary};
  }

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

export const SubscriptionCardRoot = styled(Card)`
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: ${({ theme }) => theme.surfaceElevated};
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.05)
  );
  border: 1px solid ${({ theme }) => theme.borderSubtle};
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  box-shadow: none;
  overflow: hidden;

  .card-body {
    color: ${({ theme }) => theme.text};
  }

  .card-footer {
    background-color: rgba(255, 255, 255, 0.03);
    border-color: ${({ theme }) => theme.borderSubtle};
  }
`;

export const SubscriptionDetailGrid = styled.div`
  display: grid;
  column-gap: 2rem;
  row-gap: 0.25rem;
  grid-template-columns: minmax(100px, max-content) auto;
  grid-auto-rows: minmax(1.75rem, auto);
`;

export const SubscriptionDetailLabel = styled.div`
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.9rem;
`;

export const SubscriptionDetailValue = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  display: flex;
  align-items: center;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }
`;

export const SubscriptionAvatar = styled(Image)`
  width: 30px;
  height: 30px;
  flex-shrink: 0;
`;

export const SubscriptionEntityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const PremiumCurrencyDropdownMenu = styled.div`
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
