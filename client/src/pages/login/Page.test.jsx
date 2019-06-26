// Link.react.test.js
import '@babel/polyfill';

import React from 'react';
import { render } from '@testing-library/react';

import { SnackbarProvider } from 'notistack';

import { BrowserRouter as Router } from 'react-router-dom';

import Page from './Page';

function renderWithRouter(ui) {
  return {
    ...render(
      <SnackbarProvider>
        <Router>{ui}</Router>
      </SnackbarProvider>
    ),
  };
}

describe('Render Login Page', () => {
  it('Renders the component', async () => {
    const { container } = renderWithRouter(<Page />);

    expect(container).toMatchSnapshot();
  });
});
