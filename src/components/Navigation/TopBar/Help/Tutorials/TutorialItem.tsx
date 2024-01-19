import { FC } from 'react';

import { Icon, Typography } from '@equinor/eds-core-react';
import { arrow_forward } from '@equinor/eds-icons';
import { tokens } from '@equinor/eds-tokens';

import FeedBackIcon from '../../../../Icons/FeedBackIcon/FeedBackIcon';
import { tutorialOptions } from './TutorialDialog';

import styled from 'styled-components';

const { spacings, colors, shape } = tokens;

const ContentInfo = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  width: 100%;
  align-items: center;
  gap: ${spacings.comfortable.medium_small};
  padding: ${spacings.comfortable.small};
  &:hover {
    background-color: #f7f7f7;
    border-radius: ${shape.corners.borderRadius};
  }
`;

const TutorialItem: FC<tutorialOptions> = ({
  onClick,
  description,
  steps,
  duration,
}) => {
  return (
    <ContentInfo onClick={onClick}>
      <FeedBackIcon name="positive" variant="filled" />
      <div>
        <Typography group="paragraph" variant="caption">
          {description}
        </Typography>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Typography
            group="navigation"
            variant="label"
            color={colors.text.static_icons__secondary.hex}
          >
            {steps}
          </Typography>
          <Typography
            group="navigation"
            variant="label"
            color={colors.text.static_icons__secondary.hex}
          >
            {duration}
          </Typography>
        </div>
      </div>
      <Icon
        data={arrow_forward}
        size={24}
        color={colors.interactive.primary__resting.hsla}
      />
    </ContentInfo>
  );
};
export default TutorialItem;
