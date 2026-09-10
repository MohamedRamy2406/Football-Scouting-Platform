import API_BASE_URL from './client.js';

export async function loginUser(credentials) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}

export async function registerUser(userData) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}

export async function getCurrentUser() {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/me`,
    {
      credentials: 'include'
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}

export async function logoutUser() {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/logout`,
    {
      method: 'POST',
      credentials: 'include'
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}