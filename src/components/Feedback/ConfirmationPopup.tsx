import React, { forwardRef, ReactNode } from 'react';

import { Button, Dialog, Icon, Typography } from '@equinor/eds-core-react';
import { close } from '@equinor/eds-icons';

import { spacings } from 'src/style';

import styled from 'styled-components';

const StyledDialog = styled(Dialog)`
  min-width: 400px;
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacings.medium};
  padding-bottom: 0;
`;
interface StyledActionsProps {
  $actionPosition: 'left' | 'right';
}

const StyledActions = styled(Dialog.Actions)<StyledActionsProps>`
  display: flex;
  gap: ${spacings.small};
  justify-self: ${(props) =>
    props.$actionPosition === 'left' ? 'flex-start' : 'flex-end'};
  align-items: center;

  & > * {
    margin-left: ${(props) =>
      props.$actionPosition === 'right' ? spacings.x_small : undefined};

    margin-right: ${(props) =>
      props.$actionPosition === 'left' ? spacings.x_small : undefined};
  }
`;

export interface ConfirmationPopupProps {
  show: boolean;
  title?: string;
  body?: string;
  actions?: Array<JSX.Element>;
  actionPosition?: 'left' | 'right';
  onClose?: () => void | undefined;
  children?: ReactNode;
  width?: string;
}

const ConfirmationPopup = forwardRef<HTMLDivElement, ConfirmationPopupProps>(
  (
    {
      show,
      title,
      body,
      actions,
      actionPosition = 'right',
      onClose,
      children,
      width = '400px',
    },
    ref
  ) => {
    if (show) {
      return (
        <StyledDialog ref={ref} open={show} style={{ width }}>
          <DialogHeader data-testid="dialog-header">
            {title}
            <Button variant="ghost_icon" onClick={onClose}>
              <Icon data={close} />
            </Button>
          </DialogHeader>
          <Dialog.CustomContent>
            {body && <Typography variant="body_short">{body}</Typography>}
            {children}
          </Dialog.CustomContent>
          <StyledActions
            data-testid={`confirmation-actions-${actionPosition}`}
            $actionPosition={actionPosition}
          >
            {actions}
          </StyledActions>
        </StyledDialog>
      );
    }

    return null;
  }
);

ConfirmationPopup.displayName = 'ConfirmationPopup';

export default ConfirmationPopup;
