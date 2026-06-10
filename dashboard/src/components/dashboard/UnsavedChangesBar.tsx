import { Button, Stack } from "react-bootstrap";
import styled from "styled-components";

const SaveBarSpacer = styled.div`
  height: 4.5rem;
`;

const SaveBarRoot = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1020;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.surfaceElevated};
  background-image: linear-gradient(
    rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.12),
    rgba(${({ theme }) => theme.rgb?.primary ?? "255,189,89"}, 0.12)
  );
  border-top: 2px solid ${({ theme }) => theme.primary};
  box-shadow: 0 -4px 16px rgb(0 0 0 / 35%);
`;

const SaveBarInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  margin: 0 auto;
`;

const SaveBarMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;

  strong {
    color: ${({ theme }) => theme.primary};
    font-size: 0.95rem;
  }

  span {
    color: ${({ theme }) => theme.subtleText};
    font-size: 0.85rem;
  }
`;

interface UnsavedChangesBarProps {
  show: boolean;
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
  title?: string;
  description?: string;
  saveLabel?: string;
  savingLabel?: string;
  resetLabel?: string;
}

const UnsavedChangesBar = ({
  show,
  isSaving,
  onSave,
  onReset,
  title = "Unsaved changes",
  description = "Save to apply your changes on Discord.",
  saveLabel = "Save changes",
  savingLabel = "Saving...",
  resetLabel = "Reset",
}: UnsavedChangesBarProps) => {
  if (!show) return null;

  return (
    <>
      <SaveBarSpacer aria-hidden="true" />
      <SaveBarRoot role="region" aria-label={title}>
        <SaveBarInner>
          <SaveBarMessage>
            <strong>{title}</strong>
            <span>{description}</span>
          </SaveBarMessage>
          <Stack direction="horizontal" gap={2} className="ms-auto">
            <Button variant="secondary" disabled={isSaving} onClick={onReset}>
              {resetLabel}
            </Button>
            <Button variant="primary" disabled={isSaving} onClick={onSave}>
              {isSaving ? savingLabel : saveLabel}
            </Button>
          </Stack>
        </SaveBarInner>
      </SaveBarRoot>
    </>
  );
};

export default UnsavedChangesBar;
