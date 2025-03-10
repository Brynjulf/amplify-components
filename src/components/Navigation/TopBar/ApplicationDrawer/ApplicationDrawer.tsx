import { FC, useRef, useState } from 'react';

import { DotProgress, Icon, Typography } from '@equinor/eds-core-react';
import { apps, exit_to_app } from '@equinor/eds-icons';
import { tokens } from '@equinor/eds-tokens';
import { useQuery } from '@tanstack/react-query';

import { TopBarButton } from '../TopBar.styles';
import TopBarMenu from '../TopBarMenu';
import { AmplifyApplication } from 'src/api/models/Applications';
import { PortalService } from 'src/api/services/PortalService';
import ApplicationIcon from 'src/components/Icons/ApplicationIcon/ApplicationIcon';
import {
  ApplicationBox,
  ApplicationButton,
  ApplicationContent,
  ApplicationName,
  LoadingApplications,
  MenuFixedItem,
  MenuSection,
  NoApplications,
  TextContainer,
} from 'src/components/Navigation/TopBar/ApplicationDrawer/ApplicationDrawer.styles';
import TransferToAppDialog from 'src/components/Navigation/TopBar/Resources/TransferToAppDialog';
import { environment } from 'src/utils';

const { colors } = tokens;

const { getAppName, PORTAL_URL_WITHOUT_LOCALHOST } = environment;

const ApplicationDrawer: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openApplication, setOpenApplication] = useState<
    AmplifyApplication | undefined
  >(undefined);
  const [openPortal, setOpenPortal] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: [`userApplications`],
    queryFn: () => PortalService.userApplications(),
  });

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => {
    setIsOpen(false);
    setOpenApplication(undefined);
  };

  const handleOpenApplication = (value: AmplifyApplication) => {
    setOpenApplication(value);
  };

  const handleMoreAccess = () => {
    setOpenPortal(true);
  };

  if (isLoading)
    return (
      <>
        <TopBarButton
          variant="ghost"
          onClick={toggleMenu}
          ref={buttonRef}
          $isSelected={isOpen}
        >
          <Icon data={apps} size={24} />
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
                  style={{ color: colors.text.static_icons__tertiary.rgba }}
                >
                  You don&apos;t have access to other applications
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
                    <ApplicationBox
                      key={index}
                      $isSelected={isSelected}
                      data-testid={`application-box-${item.name}`}
                    >
                      <ApplicationButton
                        variant="ghost_icon"
                        onClick={() => handleOpenApplication(item)}
                        data-testid={item.name}
                      >
                        <ApplicationIcon name={item.name.toLowerCase()} />

                        <ApplicationName>
                          <Typography group="paragraph" variant="caption">
                            {item.name}
                          </Typography>
                        </ApplicationName>
                      </ApplicationButton>
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
                color={colors.interactive.primary__resting.rgba}
                size={24}
              />
            </div>
          </MenuFixedItem>
        </>
      </TopBarMenu>
      {openPortal && (
        <TransferToAppDialog
          onClose={closeMenu}
          applicationName="Portal"
          url={PORTAL_URL_WITHOUT_LOCALHOST}
        />
      )}
      {openApplication && (
        <TransferToAppDialog
          onClose={closeMenu}
          applicationName={openApplication.name}
          url={openApplication.url}
        />
      )}
    </>
  );
};

export default ApplicationDrawer;
