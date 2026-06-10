import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const PremiumPageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.75rem 0 1.5rem;

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.md}) {
    padding: 1rem 0 2rem;
    gap: 1.5rem;
  }
`;

export const PremiumPanel = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: ${({ theme }) => theme.layout.padding.panel.base};
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.surface};
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.04),
      rgba(255, 255, 255, 0.04)
    ),
    linear-gradient(
      180deg,
      rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.1) 0%,
      transparent 42%
    );
  border: 1px solid
    rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.18);
  box-shadow: 0 12px 32px rgb(0 0 0 / 35%), 0 0 0 1px rgba(255, 255, 255, 0.04);

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.md}) {
    padding: ${({ theme }) => theme.layout.padding.panel.md};
    gap: 1.75rem;
  }

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.lg}) {
    padding: ${({ theme }) => theme.layout.padding.panel.lg};
  }

  .alert {
    margin: 0;
    border-radius: ${({ theme }) => theme.layout.navItemRadius};
  }

  .alert-success {
    background-color: rgba(51, 103, 59, 0.18);
    border-color: rgba(51, 103, 59, 0.35);
    color: ${({ theme }) => theme.text};

    a {
      color: ${({ theme }) => theme.primary};
      font-weight: 500;
      text-decoration: underline;
      text-underline-offset: 0.15em;

      &:hover {
        color: ${({ theme }) => theme.text};
      }
    }
  }

  .alert-danger {
    background-color: rgba(196, 41, 54, 0.16);
    border-color: rgba(196, 41, 54, 0.35);
    color: ${({ theme }) => theme.text};
  }
`;

export const PremiumHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
`;

export const PremiumEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.primary};
  background-color: rgba(
    ${({ theme }) => theme.rgb?.primary ?? "255,189,89"},
    0.12
  );
  border: 1px solid
    rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.3);

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

export const PremiumTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.text};
`;

export const PremiumSubtitle = styled.p`
  margin: 0;
  max-width: 30rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.subtleText};

  @media (min-width: ${({ theme }) => theme.layout.breakpoints.md}) {
    font-size: 1rem;
  }
`;

export const PremiumToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.layout.navItemRadius};
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid ${({ theme }) => theme.borderSubtle};
`;

export const PremiumToolbarHint = styled.span`
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.875rem;
  line-height: 1.45;
`;

export const PremiumCurrencyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

export const PremiumCurrencyToggle = styled(Dropdown.Toggle)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 5.5rem;
  padding: 0.35rem 0.75rem;
  border: 1px solid
    rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.35);
  border-radius: 999px;
  background-color: rgba(
    ${({ theme }) => theme.rgb?.primary ?? "255,189,89"},
    0.1
  );
  color: ${({ theme }) => theme.text};
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  box-shadow: none;

  &:hover,
  &:focus,
  &:active,
  &.show {
    border-color: ${({ theme }) => theme.primary};
    background-color: rgba(
      ${({ theme }) => theme.rgb?.primary ?? "255,189,89"},
      0.16
    );
    color: ${({ theme }) => theme.text};
    box-shadow: none;
  }

  &::after {
    margin-left: 0.15rem;
  }
`;

export const PremiumPlansSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PremiumFootnote = styled.p`
  margin: 0;
  text-align: center;
  font-size: 0.8rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.subtleText};

  a {
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 0.15em;

    &:hover {
      color: ${({ theme }) => theme.text};
    }
  }
`;

export const PremiumManageLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 0.15em;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

export const PremiumLoginPanel = styled(PremiumPanel)`
  align-items: center;
  text-align: center;
  gap: 0.75rem;
`;
