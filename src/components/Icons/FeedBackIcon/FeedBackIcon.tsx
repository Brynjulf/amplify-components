import { FC } from 'react';

import NegativeFilled from './NegativeFilled';
import NegativeOutlined from './NegativeOutlined';
import PositiveFilled from './PositiveFilled';
import PositiveOutlined from './PositiveOutlined';
import { AppIconProps } from 'src/types/AppIcon';

interface FeedBackIconData {
  iconName: string;
  component: FC<AppIconProps>;
}

export interface FeedBackIconProps {
  name: 'positive' | 'negative';
  variant?: 'filled' | 'outlined';
  size?: 16 | 24 | 32 | 40 | 48;
}

const feedbackIcons: FeedBackIconData[] = [
  { iconName: 'negative-outlined', component: NegativeOutlined },
  { iconName: 'negative-filled', component: NegativeFilled },
  { iconName: 'positive-filled', component: PositiveFilled },
  { iconName: 'positive-outlined', component: PositiveOutlined },
];

const FeedBackIcon: FC<FeedBackIconProps> = ({ name, size, variant }) => {
  const DefaultComponent = feedbackIcons[0].component;
  if (
    !feedbackIcons.some(
      (icon) => icon.iconName === `${name}-${variant ? variant : 'filled'}`
    )
  ) {
    return <DefaultComponent size={size} />;
  }

  const appData = feedbackIcons.find(
    (icon) => icon.iconName === `${name}-${variant ? variant : 'filled'}`
  ) as FeedBackIconData;
  return <appData.component size={size} />;
};

export default FeedBackIcon;
