import { FC, useMemo, useRef, useState } from 'react';

import { Button, DotProgress, Icon, Typography } from '@equinor/eds-core-react';
import { apps, exit_to_app } from '@equinor/eds-icons';
import { tokens } from '@equinor/eds-tokens';
import { useQuery } from '@tanstack/react-query';

import { environment } from '../../../../utils';
import ApplicationIcon from '../../../Icons/ApplicationIcon/ApplicationIcon';
import PortalTransit from '../Resources/ApplicationTransit/PortalTransit';
import { EnvironmentType } from '../TopBar';
import { TopBarButton } from '../TopBar.styles';
import TopBarMenu from '../TopBarMenu';
import { PortalService } from 'src/api/services/PortalService';

import styled from 'styled-components';

const { getAppName, getEnvironmentName } = environment;
const { spacings, colors, shape } = tokens;

const MenuSection = styled.div`
  border-bottom: 1px solid ${colors.ui.background__light.hex};
  display: flex;
  flex-direction: column;
  // padding-bottom: 0;
  // padding-top: ${spacings.comfortable.medium};
  padding: ${spacings.comfortable.medium} ${spacings.comfortable.large} 0
    ${spacings.comfortable.large};
  > p {
    margin-left: ${spacings.comfortable.small};
    //margin-bottom: ${spacings.comfortable.small};
  }
`;

const ApplicationName = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ApplicationContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding-top: ${spacings.comfortable.small};
  justify-items: center;
`;

const MenuFixedItem = styled.div`
  > div {
    display: grid;
    grid-template-columns: 1fr 24px;
    justify-content: space-between;
    width: 100%;
  }
  &:hover {
    background: ${colors.interactive.primary__selected_hover.hex};
    cursor: pointer;
  }
  border-top: 1px solid ${colors.ui.background__light.hex};
  outline: none !important;
  padding: ${spacings.comfortable.medium} ${spacings.comfortable.large}
    ${spacings.comfortable.medium} ${spacings.comfortable.large};
  svg {
    align-self: center;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  > h6 {
    text-transform: capitalize;
  }
`;

const NoApplications = styled.div`
  display: flex;
  padding: ${spacings.comfortable.medium};
`;

const LoadingApplications = styled.div`
  display: flex;
  padding: ${spacings.comfortable.large};
  align-items: center;
  grid-column: span 3;
`;

interface ApplicationBoxProps {
  $isSelected?: boolean;
}

export const ApplicationBox = styled.div<ApplicationBoxProps>`
  display: flex;
  height: 96px;
  width: 64px;
  justify-content: center;
  flex-direction: column;
  padding: 0 ${spacings.comfortable.medium};
  gap: ${spacings.comfortable.medium};
  align-items: center;
  background: ${({ $isSelected }) =>
    $isSelected ? colors.interactive.primary__selected_highlight.hex : 'none'};
  border-radius: ${shape.corners.borderRadius};
  &:hover {
    background: ${colors.interactive.primary__hover_alt.hex};
    border-radius: ${shape.corners.borderRadius};
  }
`;
export type applicationsProps = {
  name: string;
  icon: string;
  isSelected?: boolean;
};

const applications: applicationsProps[] = [
  { name: 'Dasha', icon: 'dasha', isSelected: true },
  { name: 'PWEX', icon: 'pwex', isSelected: false },
  { name: 'Inpress', icon: 'inpress', isSelected: false },
  { name: 'Orca', icon: 'orca', isSelected: false },
  { name: 'Acquire', icon: 'acquire', isSelected: false },
  { name: 'Recap', icon: 'dasha', isSelected: false },
  { name: 'dasha', icon: 'dasha', isSelected: false },
];

const ApplicationDrawer: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openApplication, setOpenApplication] = useState(false);
  const [openPortal, setOpenPortal] = useState(false);
  const environmentName = getEnvironmentName(
    import.meta.env.VITE_ENVIRONMENT_NAME
  );

  const environmentNameWithoutLocalHost =
    environmentName === EnvironmentType.LOCALHOST
      ? EnvironmentType.DEVELOP
      : environmentName;

  const { data = [], isLoading } = useQuery({
    queryKey: [`userApplications`],
    queryFn: () => PortalService.userApplications(),
  });

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const goToUrl = useRef<string | undefined>(undefined);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => {
    setIsOpen(false);
    setOpenApplication(false);
  };

  const handleOnApplicationClick = (value: string) => {
    setOpenApplication(true);

    goToUrl.current = value;
  };

  const handleMoreAccess = () => {
    setOpenPortal(true);
    goToUrl.current = `https://client-amplify-portal-${environmentNameWithoutLocalHost}.radix.equinor.com/dashboard`;
  };

  if (isLoading)
    return (
      <>
        <TopBarButton
          variant="ghost_icon"
          onClick={toggleMenu}
          ref={buttonRef}
          $isSelected={isOpen}
        >
          <Icon
            data={apps}
            size={24}
            color={colors.interactive.primary__resting.hsla}
          />
        </TopBarButton>
        <TopBarMenu
          open={isOpen}
          title="Your available applications"
          onClose={closeMenu}
          anchorEl={buttonRef.current}
          contentPadding={false}
        >
          <>
            <MenuSection>
              <ApplicationContent>
                <LoadingApplications>
                  <DotProgress color="primary" />
                </LoadingApplications>
              </ApplicationContent>
            </MenuSection>
          </>
        </TopBarMenu>
      </>
    );

  return (
    <>
      <TopBarButton
        variant="ghost_icon"
        onClick={toggleMenu}
        ref={buttonRef}
        $isSelected={isOpen}
      >
        <Icon
          data={apps}
          size={24}
          color={colors.interactive.primary__resting.hsla}
        />
      </TopBarButton>
      <TopBarMenu
        open={isOpen}
        title="Your available applications"
        onClose={closeMenu}
        anchorEl={buttonRef.current}
        contentPadding={false}
      >
        <>
          <MenuSection>
            {data.length === 0 ? (
              <NoApplications>
                <Typography
                  group="paragraph"
                  variant="body_short"
                  style={{ color: colors.text.static_icons__tertiary.hex }}
                >
                  You don´t have access to other applications
                </Typography>
              </NoApplications>
            ) : (
              <Typography group="paragraph" variant="overline">
                SWITCH BETWEEN APPS
              </Typography>
            )}

            <ApplicationContent>
              <>
                {data.map((item, index) => {
                  const isSelected =
                    getAppName(import.meta.env.VITE_NAME) === item.name;
                  return (
                    <ApplicationBox key={index} $isSelected={isSelected}>
                      <Button
                        variant="ghost_icon"
                        onClick={() => handleOnApplicationClick(item.url)}
                        data-testid={item.name}
                      >
                        <ApplicationIcon name={item.name.toLowerCase()} />
                      </Button>
                      <ApplicationName>
                        <Typography group="paragraph" variant="caption">
                          {item.name}
                        </Typography>
                      </ApplicationName>

                      {openApplication && (
                        <PortalTransit
                          open={openApplication}
                          onClose={closeMenu}
                          portal={false}
                          applicationName={item.name}
                          onClick={() => handleOnApplicationClick(item.url)}
                        />
                      )}
                    </ApplicationBox>
                  );
                })}
              </>
            </ApplicationContent>
          </MenuSection>

          <MenuFixedItem
            data-testid="access-it-link"
            onClick={handleMoreAccess}
          >
            <div>
              <TextContainer>
                <Typography variant="overline">
                  Access to more applications?
                </Typography>
                <Typography variant="h6">Go to Application Portal</Typography>
              </TextContainer>
              <Icon
                data={exit_to_app}
                color={colors.interactive.primary__resting.hex}
                size={24}
              />
            </div>
          </MenuFixedItem>
        </>
      </TopBarMenu>
      {openPortal && (
        <PortalTransit
          open={openApplication}
          onClose={closeMenu}
          portal
          onClick={handleMoreAccess}
        />
      )}
    </>
  );
};

export default ApplicationDrawer;
