
import API_BASE_URL from './client.js';

// ============================================
// GET CURRENT PLAYER PROFILE
// ============================================

export async function getPlayerProfile() {
  const response = await fetch(
    `${API_BASE_URL}/api/player/profile`,
    {
      method: 'GET',
      credentials: 'include'
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// UPDATE CURRENT PLAYER PROFILE
// ============================================

export async function updatePlayerProfile(profileData) {
  const response = await fetch(
    `${API_BASE_URL}/api/player/profile`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(profileData)
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// DELETE CURRENT PLAYER ACCOUNT
// ============================================

export async function deletePlayerAccount() {
  const response = await fetch(
    `${API_BASE_URL}/api/player/account`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// UPLOAD PLAYER PROFILE PHOTO
// ============================================

export async function uploadPlayerPhoto(file) {
  const formData = new FormData();

  formData.append('profilePhoto', file);

  const response = await fetch(
    `${API_BASE_URL}/api/player/profile/photo`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// GET CURRENT PLAYER ACHIEVEMENTS
// ============================================

export async function getPlayerAchievements() {
  const response = await fetch(
    `${API_BASE_URL}/api/player/achievements`,
    {
      method: 'GET',
      credentials: 'include'
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// CREATE PLAYER ACHIEVEMENT
// ============================================

export async function createPlayerAchievement(
  achievement
) {
  const response = await fetch(
    `${API_BASE_URL}/api/player/achievements`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(achievement)
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// UPDATE PLAYER ACHIEVEMENT
// ============================================

export async function updatePlayerAchievement(
  id,
  achievement
) {
  const response = await fetch(
    `${API_BASE_URL}/api/player/achievements/${id}`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(achievement)
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// DELETE PLAYER ACHIEVEMENT
// ============================================

export async function deletePlayerAchievement(
  id
) {
  const response = await fetch(
    `${API_BASE_URL}/api/player/achievements/${id}`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// GET CURRENT PLAYER CLUB HISTORY
// ============================================

export async function getPlayerClubHistory() {
  const response = await fetch(
    `${API_BASE_URL}/api/club-history`,
    {
      method: 'GET',
      credentials: 'include'
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// CREATE CLUB HISTORY
// ============================================

export async function createPlayerClubHistory(
  clubHistory
) {
  const response = await fetch(
    `${API_BASE_URL}/api/club-history`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clubHistory)
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// UPDATE CLUB HISTORY
// ============================================

export async function updatePlayerClubHistory(
  id,
  clubHistory
) {
  const response = await fetch(
    `${API_BASE_URL}/api/club-history/${id}`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clubHistory)
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// DELETE CLUB HISTORY
// ============================================

export async function deletePlayerClubHistory(
  id
) {
  const response = await fetch(
    `${API_BASE_URL}/api/club-history/${id}`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// GET CURRENT PLAYER VIDEOS
// ============================================

export async function getPlayerVideos() {
  const response = await fetch(
    `${API_BASE_URL}/api/player/videos`,
    {
      method: 'GET',
      credentials: 'include'
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// UPLOAD PLAYER VIDEO
// ============================================

export async function uploadPlayerVideo(
  file,
  title,
  description,
  category
) {
  const formData = new FormData();

  formData.append('video', file);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('category', category);

  const response = await fetch(
    `${API_BASE_URL}/api/player/videos`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


// ============================================
// DELETE PLAYER VIDEO
// ============================================

export async function deletePlayerVideo(
  id
) {
  const response = await fetch(
    `${API_BASE_URL}/api/player/videos/${id}`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
}


