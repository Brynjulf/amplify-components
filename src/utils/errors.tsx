import { ReactNode } from 'react';

import GlitchAnimation from '../components/Feedback/ErrorPage/illustrations/GlitchAnimation';
import QuestioningAnimation from '../components/Feedback/ErrorPage/illustrations/QuestioningAnimation';

export enum ErrorType {
  ERROR_400 = '400',
  ERROR_401 = '401',
  ERROR_403 = '403',
  ERROR_404 = '404',
  ERROR_500 = '500',
  DEFAULT = 'default',
}
export type ErrorContentType = {
  type: ErrorType;
  illustration: ReactNode;
  title: string;
  description?: string;
  button?: { text?: string; onClick?: () => void };
};

// list of errors with default values
export const getListOfErrors = (appName: string): ErrorContentType[] => {
  return [
    {
      type: ErrorType.DEFAULT,
      illustration: <QuestioningAnimation />,
      title: 'Oops! Something went wrong.',
      description:
        'Try again later or use our feedback form if the problem persists.',
    },
    {
      type: ErrorType.ERROR_400,
      illustration: <QuestioningAnimation />,
      title: 'Bad Request, oh no!',
      description:
        'We got a little confused by your request. Try again later, or report the bug in the feedback form in the topbar if the problem persist.',
    },
    {
      type: ErrorType.ERROR_401,
      illustration: <GlitchAnimation />,

      title: `You don’t have access to ${appName}.`,
      description: `Beep boop, dont worry! You can apply for ${appName} in  AccessIT`,
      button: {
        text: 'Apply for access',
        onClick: () => window.open('https://accessit.equinor.com/#', '_blank'),
      },
    },
    {
      type: ErrorType.ERROR_403,
      illustration: <GlitchAnimation />,

      title: "It looks like you don't have permission to access this page.",
      description: '',
    },
    {
      type: ErrorType.ERROR_404,
      illustration: <QuestioningAnimation />,

      title: 'Page not found!',
      description:
        "It looks like the page you're looking for has gone missing. Please check the URL and try again.",
    },
    {
      type: ErrorType.ERROR_500,
      illustration: <GlitchAnimation />,
      title: 'Oops, our server just hiccuped!',
      description:
        "It looks like the page you're looking for has gone missing. Please check the URL and try again.",
    },
  ];
};

// get Error by type
export const getErrorContent = (
  appName: string,
  errorType?: ErrorType
): ErrorContentType => {
  const error = getListOfErrors(appName).find(
    (error) => error.type === errorType
  );
  if (error) {
    return error;
  }
  // default
  else {
    return getListOfErrors(appName).find(
      (error) => error.type === ErrorType.DEFAULT
    ) as ErrorContentType;
  }
};

export default { getErrorContent, getListOfErrors };
