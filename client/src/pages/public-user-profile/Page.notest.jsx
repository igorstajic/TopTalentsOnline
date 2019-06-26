// Link.react.test.js
import '@babel/polyfill';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

const notistack = jest.genMockFromModule('notistack');
notistack.withSnackbar = jest.fn(Component => <Component enqueueSnackbar={() => {}} />);
import { SnackbarProvider } from 'notistack';

import Page from './Page';

describe('Render Public Profiles Page', () => {
  it('renders the component', () => {
    const container = render(
      <SnackbarProvider>
        <Page match={{}} />
      </SnackbarProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
