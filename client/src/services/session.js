//@flow
import React from 'react';
import axios from '../configs/axios';

const SESSION_KEY = 'access_token';

export type UserType = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  type: string,
};

export async function authenticateSession(email: string, password: string): Promise<{ user?: UserType, error?: string }> {
  try {
    const response = await axios.post('/auth/login', { email, password });
    const token = `Bearer ${response.data.token}`;
    axios.defaults.headers.common['Authorization'] = token;

    localStorage.setItem(SESSION_KEY, token);
    return { user: response.data.user };
  } catch (error) {
    if (error.response) {
      return { error: error.response.data.details };
    } else {
      console.error(error.message); //eslint-disable-line
      return { error: error.message };
    }
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function getAuthenticatedUser(): Promise<?UserType> {
  const token = localStorage.getItem(SESSION_KEY);
  axios.defaults.headers.common['Authorization'] = token;
  if (!token) {
    return null;
  }

  try {
    const response = await axios.get('/auth/check-user-token');
    return response.data.user;
  } catch (error) {
    localStorage.removeItem(SESSION_KEY);
    if (!error.response) {
      console.error(error.message); //eslint-disable-line
    }
    return null;
  }
}

export const SessionContext = React.createContext<{ currentUser: ?UserType, setCurrentUser: ?UserType => void }>({
  setCurrentUser: () => {},
  currentUser: null,
});
