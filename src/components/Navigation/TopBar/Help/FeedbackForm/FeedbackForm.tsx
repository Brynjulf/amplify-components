import { FC, useEffect, useMemo, useState } from 'react';
import { FileWithPath } from 'react-dropzone';

import { tokens } from '@equinor/eds-tokens';

import RequestStatus from './components/RequestStatus';
import {
  AttachmentStatus,
  FeedbackContentType,
  FeedbackEnum,
  StatusEnum,
  UrgencyOption,
} from './FeedbackForm.types';
import {
  createServiceNowDescription,
  createSlackMessage,
  getUrgencyNumber,
} from './FeedbackForm.utils';
import FeedbackFormInner from './FeedbackFormInner';
import {
  useServiceNowIncidentMutation,
  useSlackFileUploadMutation,
  useSlackPostMessageMutation,
} from 'src/components/Navigation/TopBar/Help/FeedbackForm/FeedbackForm.hooks';
import { useAuth } from 'src/providers/AuthProvider/AuthProvider';
import { useSnackbar } from 'src/providers/SnackbarProvider';

import styled from 'styled-components';

const { spacings } = tokens;

const Container = styled.div`
  width: 700px;
  height: 580px;
  padding: 0 ${spacings.comfortable.medium} ${spacings.comfortable.medium}
    ${spacings.comfortable.medium};
`;

interface FeedbackFormProps {
  onClose: () => void;
  selectedType: FeedbackEnum;
}

const FeedbackForm: FC<FeedbackFormProps> = ({ onClose, selectedType }) => {
  const { account } = useAuth();
  const userEmail = account?.username;
  const { showSnackbar } = useSnackbar();

  const [feedbackContent, setFeedbackContent] = useState<FeedbackContentType>({
    title: '',
    description: '',
    anonymous: false,
  });

  const [slackAttachmentStatus, setSlackAttachmentStatus] = useState<
    AttachmentStatus[]
  >([]);

  const { mutateAsync: slackFileUpload, isPending: isFileUploadLoading } =
    useSlackFileUploadMutation(feedbackContent);

  const {
    mutateAsync: slackPostMessage,
    status: postMessageStatus,
    error: postMessageError,
  } = useSlackPostMessageMutation(feedbackContent);

  const {
    mutateAsync: serviceNowIncident,
    status: serviceNowStatus,
    error: serviceNowError,
  } = useServiceNowIncidentMutation(feedbackContent);

  const showRequestStatus = useMemo(() => {
    return serviceNowStatus !== 'idle' || postMessageStatus !== 'idle';
  }, [postMessageStatus, serviceNowStatus]);

  const requestIsLoading = useMemo(() => {
    return (
      postMessageStatus === 'pending' ||
      serviceNowStatus === 'pending' ||
      isFileUploadLoading
    );
  }, [isFileUploadLoading, postMessageStatus, serviceNowStatus]);

  const updateFeedback = (
    key: keyof FeedbackContentType,
    newValue: string | UrgencyOption | FileWithPath[] | boolean
  ) => {
    if (key === 'attachments' && feedbackContent.attachments) {
      setFeedbackContent((prev) => {
        return {
          ...prev,
          [key]: [...(newValue as FileWithPath[])],
        };
      });
    } else {
      setFeedbackContent({ ...feedbackContent, [key]: newValue });
    }
  };

  useEffect(() => {
    if (!feedbackContent.attachments) return;
    setSlackAttachmentStatus(
      feedbackContent.attachments.map((attachment) => {
        return {
          fileName: attachment.name,
          status: StatusEnum.PENDING,
        };
      })
    );
  }, [feedbackContent.attachments]);

  const updateStatus = (status: StatusEnum, filename: string) => {
    const index = slackAttachmentStatus.findIndex(
      (attachment) => attachment.fileName === filename
    );
    if (index === -1) return;
    setSlackAttachmentStatus((prev) => [
      ...prev.slice(0, index),
      { ...prev[index], status: status },
      ...prev.slice(index + 1, prev.length),
    ]);
  };

  const handleSave = async () => {
    try {
      // Slack message request
      const contentFormData = new FormData();
      contentFormData.append(
        'comment',
        createSlackMessage(feedbackContent, selectedType, userEmail)
      );
      await slackPostMessage(contentFormData);

      // Slack attachments requests
      if (
        feedbackContent.attachments &&
        feedbackContent.attachments.length > 0
      ) {
        for (const attachment of feedbackContent.attachments) {
          const fileFormData = new FormData();
          fileFormData.append('comment', `Title: ${feedbackContent.title}`);
          fileFormData.append('file', attachment);
          try {
            await slackFileUpload(fileFormData);
            updateStatus(StatusEnum.SUCCESS, attachment.name);
          } catch (e) {
            updateStatus(StatusEnum.ERROR, attachment.name);
          }
        }
      }

      // Service now request
      if (selectedType === FeedbackEnum.BUG && userEmail) {
        const serviceNowFormData = new FormData();
        serviceNowFormData.append('ConfigurationItem', '117499');
        serviceNowFormData.append('Title', feedbackContent.title);
        serviceNowFormData.append(
          'Description',
          createServiceNowDescription(feedbackContent)
        );
        serviceNowFormData.append('CallerEmail', userEmail);
        if (feedbackContent.urgency) {
          serviceNowFormData.append(
            'urgency',
            getUrgencyNumber(
              feedbackContent.urgency as UrgencyOption
            ).toString()
          );
        }
        if (
          feedbackContent.attachments &&
          feedbackContent.attachments.length > 0
        ) {
          feedbackContent.attachments.forEach((attachment) =>
            serviceNowFormData.append('Images', attachment)
          );
        }
        await serviceNowIncident(serviceNowFormData);
      }
    } catch (err) {
      console.error(err);
      showSnackbar('There was an error sending your report');
    }
  };

  if (showRequestStatus)
    return (
      <RequestStatus
        feedbackType={selectedType}
        serviceNowRequest={{
          status: serviceNowStatus as StatusEnum,
          errorText: serviceNowError?.message,
        }}
        slackRequest={{
          status: postMessageStatus as StatusEnum,
          errorText: postMessageError?.message,
        }}
        slackAttachments={slackAttachmentStatus}
      />
    );

  return (
    <Container>
      <FeedbackFormInner
        selectedType={selectedType}
        feedbackContent={feedbackContent}
        updateFeedback={updateFeedback}
        handleSave={handleSave}
        onClose={onClose}
        requestIsLoading={requestIsLoading}
      />
    </Container>
  );
};

export default FeedbackForm;
