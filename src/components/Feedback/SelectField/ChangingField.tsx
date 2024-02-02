import React, { FC } from 'react';

import {
  LinearProgress as EDSLinearProgress,
  Typography,
} from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';

import AnimatedCheckmark from '../AnimatedCheckmark';
import { useFakeProgress } from 'src/hooks';
import { spacings } from 'src/style';
import string from 'src/utils/string';

import styled from 'styled-components';
const { colors } = tokens;

const Container = styled.div`
  gap: ${spacings.medium};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - (${spacings.xxx_large} * 4));
  width: 100%;
  max-width: 370px;
`;

export const LinearProgress = styled(EDSLinearProgress)`
  background-color: ${colors.interactive.primary__hover_alt.rgba};

  div {
    background-color: ${colors.interactive.primary__resting.rgba};
  }
`;

const StyledTypography = styled(Typography)`
  span {
    text-transform: capitalize;
  }
`;

interface ChangingFieldProps {
  fieldName: string;
  onChangedField: () => void;
  finishedText: string;
}

const ChangingField: FC<ChangingFieldProps> = ({
  fieldName,
  onChangedField,
  finishedText,
}) => {
  const { finished, progress } = useFakeProgress({ onDone: onChangedField });

  return (
    <Container>
      {!finished ? (
        <>
          <Typography variant="h3">
            Changing field.{'.'.repeat(progress / 35)}
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </>
      ) : (
        <>
          <StyledTypography variant="h3">
            Changed to <span>{string.capitalize(fieldName)}</span>
          </StyledTypography>
          <AnimatedCheckmark />
          <Typography variant="h6">{finishedText}</Typography>
        </>
      )}
    </Container>
  );
};

export default ChangingField;
