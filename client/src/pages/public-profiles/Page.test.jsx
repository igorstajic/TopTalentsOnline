// Link.react.test.js
import '@babel/polyfill';

import React from 'react';
import { render, waitForElement } from '@testing-library/react';

import { SnackbarProvider } from 'notistack';

import axiosMock from '../../configs/axios';

jest.mock('../../configs/axios');
import { BrowserRouter as Router } from 'react-router-dom';

import Page from './Page';

function renderWithRouter(ui) {
  return {
    ...render(
      <SnackbarProvider>
        <Router>{ui}</Router>{' '}
      </SnackbarProvider>
    ),
  };
}

describe('Render Public Profiles Page', () => {
  it('Renders the component with profile cards', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        users: [
          {
            id: '5d0e4d9c01170a44abb7de8d',
            email: 'gaylecgrogan@teleworm.us',
            firstName: 'Gayle',
            lastName: 'Grogan',
            city: 'Oxford',
            country: 'United States',
            category: 'web developer',
            subCategories: ['react', 'node.js', 'python'],
          },
        ],
      },
    });
    const { getByTestId, getByText } = renderWithRouter(<Page />);

    await waitForElement(() => getByTestId('container__profileCards'));

    expect(getByText('Gayle Grogan')).toBeDefined();
  });
});
