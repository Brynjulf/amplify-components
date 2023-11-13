import { MemoryRouter } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ReleaseNotesTypes from './ReleaseNotesTypes';
import { ReleaseNoteType } from './ReleaseNotesTypes.types';
import { AuthProvider, ReleaseNotesProvider } from 'src/providers';
import { render, screen } from 'src/tests/test-utils';

const Wrappers = ({ children }: { children: any }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider isMock>
        <MemoryRouter>
          <ReleaseNotesProvider>{children}</ReleaseNotesProvider>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

test('Render release note types', () => {
  const name = ReleaseNoteType.FEATURE;
  render(<ReleaseNotesTypes name={name} showIcon />, {
    wrapper: Wrappers,
  });

  const actual = screen.getByText(name);
  expect(actual).toBeInTheDocument();
  expect(actual).toBeVisible();
});
