import { FC } from 'react';

import { tokens } from '@equinor/eds-tokens';

import { AttachmentStatus, RequestStatusType } from '../../FeedbackForm.types';
import RequestStatus from './RequestStatus';

import styled from 'styled-components';

const { spacings, colors } = tokens;

const Container = styled.div`
  padding: ${spacings.comfortable.small};
  background-color: ${colors.ui.background__light.hex};
`;

const SlackRequestsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${spacings.comfortable.medium};
  gap: ${spacings.comfortable.large};
  margin-left: ${spacings.comfortable.large};
`;

interface SlackResponseProps {
  attachments: AttachmentStatus[];
  slackRequest: RequestStatusType;
  allSlackRequestStatus: RequestStatusType;
}

const FullSlackResponse: FC<SlackResponseProps> = ({
  attachments,
  slackRequest,
  allSlackRequestStatus,
}) => {
  return (
    <Container>
      <RequestStatus
        title="Sending to slack channel"
        requestStatus={allSlackRequestStatus}
      />
      <SlackRequestsWrapper>
        <RequestStatus
          title="Posting text to slack"
          requestStatus={slackRequest}
        />
        {attachments.map((attachment) => {
          return (
            <RequestStatus
              key={attachment.fileName}
              title={`Posting ${attachment.fileName} to slack`}
              requestStatus={attachment}
            />
          );
        })}
      </SlackRequestsWrapper>
    </Container>
  );
};

export default FullSlackResponse;
