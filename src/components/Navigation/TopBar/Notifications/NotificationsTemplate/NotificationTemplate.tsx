import { FC, useMemo } from 'react';

import { Icon, Typography } from '@equinor/eds-core-react';
import { delete_to_trash } from '@equinor/eds-icons';
import { tokens } from '@equinor/eds-tokens';

import DeafultNotification from './NotificationElements/DeafultNotification';
import ExperienceDue3Weeks from './NotificationElements/ExperienceDue3Weeks';
import MergedBranchOrca from './NotificationElements/MergedBranchOrca';
import ReadyToBePublished from './NotificationElements/ReadyToBePublished';
import ReadyToReportNotification from './NotificationElements/ReadyToReportNotification';
import RequestChangeOrca from './NotificationElements/RequestChangeOrca';
import RequestReviewOrca from './NotificationElements/RequestReviewOrca';
import ReviewQANotification from './NotificationElements/ReviewQANotification';
import {
  DefaultNotificationTypes,
  Due3WeeksTypes,
  ExperienceReadyToPublishTypes,
  MergeBranchOrcaTypes,
  NotificationsTypes,
  ReadyToReportNotificationTypes,
  RequestChangeOrcaTypes,
  RequestReviewOrcaTypes,
  ReviewQANotificationsTypes,
} from './Notifications.types';
import OptionalTooltip from 'src/components/DataDisplay/OptionalTooltip';
import ApplicationIcon from 'src/components/Icons/ApplicationIcon/ApplicationIcon';
import { ProfileAvatar } from 'src/components/index';
import {
  Content,
  DeleteButton,
  Divider,
  Dot,
  FooterContainer,
  GridContainer,
  TopContainer,
  UserInformation,
  Wrapper,
} from 'src/components/Navigation/TopBar/Notifications/NotificationsTemplate/NotificationTemplate.style';
import { date } from 'src/utils';

const { colors } = tokens;
const NotificationTemplate: FC<
  | ReadyToReportNotificationTypes
  | DefaultNotificationTypes
  | RequestReviewOrcaTypes
  | RequestChangeOrcaTypes
  | MergeBranchOrcaTypes
  | ExperienceReadyToPublishTypes
  | ReviewQANotificationsTypes
  | Due3WeeksTypes
> = (props) => {
  const {
    user,
    notificationType,
    applicationName,
    Read,
    field,
    time,
    footer = true,
    onDelete,
  } = props;
  const content = useMemo(() => {
    switch (notificationType) {
      case NotificationsTypes.READY_TO_REPORT:
        return <ReadyToReportNotification {...props} />;
      case NotificationsTypes.DEFAULT:
        return <DeafultNotification {...props} />;
      case NotificationsTypes.REQUESTED_REVIEW:
        return <RequestReviewOrca {...props} />;
      case NotificationsTypes.REQUESTED_CHANGES:
        return <RequestChangeOrca {...props} />;
      case NotificationsTypes.MERGE_BRANCH:
        return <MergedBranchOrca {...props} />;
      case NotificationsTypes.QA_COMMENTS:
        return <ReviewQANotification {...props} />;
      case NotificationsTypes.EXPERIENCE_READY_TO_PUBLISH:
        return <ReadyToBePublished {...props} />;
      case NotificationsTypes.DUE_3_WEEKS:
        return <ExperienceDue3Weeks {...props} />;
    }
  }, [props, notificationType]);

  return (
    <>
      <Wrapper>
        <GridContainer>
          <TopContainer>
            {user ? (
              <UserInformation>
                {!Read && <Dot />}
                <ProfileAvatar
                  url={user?.image}
                  name={user?.shortName}
                  size="large"
                />
                <div>
                  <Typography
                    color={colors.text.static_icons__default.rgba}
                    group="heading"
                    variant="h6"
                  >
                    {user?.displayName}
                  </Typography>
                  <Typography
                    group="paragraph"
                    variant="caption"
                    color={colors.text.static_icons__secondary.rgba}
                  >
                    {user?.shortName}
                  </Typography>
                </div>
              </UserInformation>
            ) : (
              <UserInformation $systemUser>
                {!Read && <Dot data-testid="unread-dot-system" />}
                <ApplicationIcon name={applicationName} />

                <Typography group="heading" variant="h6">
                  {applicationName}
                </Typography>
              </UserInformation>
            )}

            <Typography
              group="navigation"
              variant="label"
              color={
                Read
                  ? colors.text.static_icons__secondary.rgba
                  : colors.infographic.substitute__blue_overcast.rgba
              }
              data-testid="notification-date"
            >
              {date.formatRelativeDateTime(time)}
            </Typography>
          </TopContainer>
          <Content>{content}</Content>

          {footer && (
            <FooterContainer>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Typography
                  group="navigation"
                  variant="label"
                  color={colors.text.static_icons__tertiary.rgba}
                >
                  {applicationName}
                </Typography>

                <Typography
                  group="navigation"
                  variant="label"
                  color={colors.text.static_icons__tertiary.rgba}
                >
                  {field}
                </Typography>
              </div>
              <OptionalTooltip title="Delete notification">
                <DeleteButton onClick={onDelete} variant="ghost_icon">
                  <Icon data={delete_to_trash} />
                </DeleteButton>
              </OptionalTooltip>
            </FooterContainer>
          )}
        </GridContainer>
      </Wrapper>
      <Divider />
    </>
  );
};

export default NotificationTemplate;
