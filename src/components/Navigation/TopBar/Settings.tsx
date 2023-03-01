import React, { FC, forwardRef, useRef, useState } from 'react';

import { Button, Icon, Menu, Radio, Typography } from '@equinor/eds-core-react';
import { clear, settings } from '@equinor/eds-icons';
import { tokens } from '@equinor/eds-tokens';

import TopBarMenu from './TopBarMenu';

import styled from 'styled-components';

const { colors, elevation } = tokens;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 40px;
`;

const StyledMenu = styled(Menu)`
  width: 320px;
  padding: 16px;
`;

interface StyledColorBoxProps {
  color: string;
}

const StyledColorBox = styled.div<StyledColorBoxProps>`
  width: 64px;
  height: 32px;
  background-color: ${(props) => props.color};
  box-shadow: ${elevation.raised};
  border-radius: 4px;
`;

export interface ISettingsSections {
  title: string;
  type: string;
  onChange?: (val: any) => void;
  items: {
    label: string;
    name: string;
    value: string;
    colorBox?: string;
    element?: string;
    disabled?: boolean;
  }[];
}

export interface ISettingsProps {
  allSettings: ISettingsSections[];
}

export const Settings: FC<ISettingsProps> = ({ allSettings }) => {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost_icon"
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonRef}
      >
        <Icon
          data={settings}
          size={24}
          color={colors.interactive.primary__resting.hsla}
        />
      </Button>
      <TopBarMenu
        open={isOpen}
        title="Settings"
        onClose={() => setIsOpen(false)}
        anchorEl={buttonRef.current}
      >
        {allSettings.map((section, ind) => (
          <div key={ind}>
            <Typography variant="overline">{section.title}</Typography>
            {section.items.map((item, index) => (
              <ContentWrapper key={index}>
                <Radio
                  disabled={item.disabled}
                  label={item.label}
                  name={item.name}
                  value={item.value}
                  checked={section.type === item.value}
                  onChange={() => section.onChange?.(item.value)}
                />
                {item.colorBox && <StyledColorBox color={item.colorBox} />}
                {item.element && (
                  <Typography variant="h6">{item.element}</Typography>
                )}
              </ContentWrapper>
            ))}
          </div>
        ))}
      </TopBarMenu>
    </>
  );
};

export default Settings;
Settings.displayName = 'TopBar.Settings';
