import { useCallback, useEffect, useState } from 'react';

import {
  getPlayerProfile,
  getPlayerClubHistory,
  uploadPlayerPhoto
} from '../api/playerApi.js';

import { useAuth } from '../context/AuthContext.jsx';

import PlayerProfileHeader from '../components/player/playerProfileHeader.jsx';
import ProfileCompletion from '../components/player/ProfileCompletion.jsx';
import FootballInformation from '../components/player/FootballInformation.jsx';
import ClubHistory from '../components/player/clubHistory.jsx';
import Achievements from '../components/player/Achievements.jsx';
import EditPlayerProfile from '../components/player/EditPlayerProfile.jsx';
import LanguageSelector from '../components/common/LanguageSelector.jsx';
import Videos from '../components/player/Videos.jsx';
import { useTranslation } from 'react-i18next';


const PlayerProfile = () => {

  const { user: currentUser } =
    useAuth();

  const { t } =
    useTranslation();


  const [player,
    setPlayer] =
    useState(null);

  const [clubHistory,
    setClubHistory] =
    useState([]);


  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState('');


  const [editing,
    setEditing] =
    useState(false);

  const [uploadingPhoto,
    setUploadingPhoto] =
    useState(false);


  const [activeTab,
    setActiveTab] =
    useState('videos');


  /* =========================================================
     LOAD CLUB HISTORY
  ========================================================= */

  const loadClubHistory =
    useCallback(
      async () => {

        try {

          const result =
            await getPlayerClubHistory();


          setClubHistory(
            result?.data?.history || []
          );

        } catch (err) {

          console.error(
            'Failed to load club history:',
            err
          );

        }

      },
      []
    );


  /* =========================================================
     LOAD PLAYER PROFILE
  ========================================================= */

  const loadProfile =
    useCallback(
      async () => {

        try {

          setLoading(true);
          setError('');


          const [
            profileResult,
            clubHistoryResult
          ] =
            await Promise.all([
              getPlayerProfile(),
              getPlayerClubHistory()
            ]);


          /*
           * playerApi.js returns:
           *
           * {
           *   response,
           *   data
           * }
           *
           * The actual player profile is:
           *
           * profileResult.data.profile
           */

          setPlayer(
            profileResult?.data?.profile ||
            null
          );


          /*
           * Club history is returned separately.
           */

          setClubHistory(
            clubHistoryResult?.data?.history ||
            []
          );


        } catch (err) {

          console.error(
            'Failed to load player profile:',
            err
          );


          setError(
            err?.message ||
              t(
                'playerProfile.errors.loadFailed',
                {
                  defaultValue:
                    'Failed to load your profile.'
                }
              )
          );


        } finally {

          setLoading(false);

        }

      },
      [t]
    );


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    loadProfile();

  }, [loadProfile]);


  /* =========================================================
     PHOTO UPLOAD
  ========================================================= */

  const handlePhotoSelected =
    async (file) => {

      if (!file) {
        return;
      }


      try {

        setUploadingPhoto(true);
        setError('');


        const result =
          await uploadPlayerPhoto(
            file
          );


        /*
         * The upload endpoint returns:
         *
         * {
         *   response,
         *   data
         * }
         */

        if (
          result?.data?.profile
        ) {

          setPlayer(
            result.data.profile
          );

        } else if (
          result?.data?.player
        ) {

          setPlayer(
            result.data.player
          );

        } else {

          /*
           * Fallback:
           * reload everything from backend.
           */
          await loadProfile();

        }


      } catch (err) {

        console.error(
          'Failed to upload profile photo:',
          err
        );


        setError(
          err?.message ||
            t(
              'playerProfile.errors.photoUploadFailed',
              {
                defaultValue:
                  'Failed to upload your profile photo.'
              }
            )
        );


      } finally {

        setUploadingPhoto(false);

      }

    };


  /* =========================================================
     HANDLE EDIT PROFILE UPDATE
  ========================================================= */

  const handleProfileUpdated =
    useCallback(
      async () => {

        /*
         * Reload the profile from the
         * backend after Edit Profile saves.
         *
         * This is important because the backend
         * recalculates profile completion.
         */
        await loadProfile();


        /*
         * Close the edit modal only after the
         * latest profile has been loaded.
         */
        setEditing(false);

      },
      [loadProfile]
    );


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <>

        <LanguageSelector />


        <main className="player-profile-page">

          <div className="player-profile-loading">

            {t(
              'common.loading',
              {
                defaultValue:
                  'Loading...'
              }
            )}

          </div>

        </main>

      </>

    );

  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (error && !player) {

    return (

      <>

        <LanguageSelector />


        <main className="player-profile-page">

          <div className="player-profile-error">

            {error}

          </div>

        </main>

      </>

    );

  }


  /* =========================================================
     NO PROFILE
  ========================================================= */

  if (!player) {

    return (

      <>

        <LanguageSelector />


        <main className="player-profile-page">

          <div className="player-profile-error">

            {t(
              'playerProfile.errors.profileNotFound',
              {
                defaultValue:
                  'Player profile not found.'
              }
            )}

          </div>

        </main>

      </>

    );

  }


  /* =========================================================
     PROFILE
  ========================================================= */

  return (

    <>

      <LanguageSelector />


      <main className="player-profile-page">


        {/* =====================================================
            PLAYER HEADER
        ===================================================== */}

        <PlayerProfileHeader
          player={player}
          currentUser={currentUser}
          onEdit={() =>
            setEditing(true)
          }
          onPhotoSelected={
            handlePhotoSelected
          }
          uploadingPhoto={
            uploadingPhoto
          }
        />


        {/* =====================================================
            PROFILE COMPLETION
        ===================================================== */}

        {!player.profileCompleted && (

          <ProfileCompletion
            player={player}
            onProfileUpdated={
              loadProfile
            }
          />

        )}


        {/* =====================================================
            TABS
        ===================================================== */}

        <div className="player-profile-tabs">


          {/* VIDEOS */}

          <button
            type="button"
            className={`player-profile-tab ${
              activeTab === 'videos'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveTab('videos')
            }
          >

            {t(
              'playerProfile.tabs.videos'
            )}

          </button>


          {/* INFO */}

          <button
            type="button"
            className={`player-profile-tab ${
              activeTab === 'info'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveTab('info')
            }
          >

            {t(
              'playerProfile.tabs.info'
            )}

          </button>


          {/* TRIALS */}

          <button
            type="button"
            className={`player-profile-tab ${
              activeTab === 'trials'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveTab('trials')
            }
          >

            {t(
              'playerProfile.tabs.trials'
            )}

          </button>


        </div>


        {/* =====================================================
            TAB CONTENT
        ===================================================== */}

        <div className="player-profile-tab-content">


          {/* ===================================================
              VIDEOS
          =================================================== */}

          {activeTab === 'videos' && (
  <Videos
    profileCompleted={
      player.profileCompleted
    }
  />
)}


          {/* ===================================================
              INFO
          =================================================== */}

          {activeTab === 'info' && (

            <div className="player-content-grid">


              {/* -----------------------------------------------
                  PLAYER DETAILS
              ------------------------------------------------ */}

              <div className="player-info-football">

                <FootballInformation
                  player={player}
                />

              </div>


              {/* -----------------------------------------------
                  CLUB HISTORY
              ------------------------------------------------ */}

              <div className="player-info-club-history">

                <ClubHistory
                  clubHistory={
                    clubHistory
                  }
                  onClubHistoryChanged={
                    loadClubHistory
                  }
                />

              </div>


              {/* -----------------------------------------------
                  ACHIEVEMENTS
              ------------------------------------------------ */}

              <div className="player-info-achievements">

                <Achievements
                  achievements={
                    player.achievements || []
                  }
                  onAchievementsChanged={
                    loadProfile
                  }
                />

              </div>


            </div>

          )}


          {/* ===================================================
              TRIALS
          =================================================== */}

          {activeTab === 'trials' && (

            <div className="player-profile-empty-state">

              <div className="player-profile-empty-icon">
                🏆
              </div>


              <h2>

                {t(
                  'playerProfile.emptyStates.trials.title'
                )}

              </h2>


              <p>

                {t(
                  'playerProfile.emptyStates.trials.description'
                )}

              </p>

            </div>

          )}


        </div>


        {/* =====================================================
            EDIT PROFILE
        ===================================================== */}

        {editing && (

          <EditPlayerProfile
            player={player}

            onClose={() =>
              setEditing(false)
            }

            /*
             * IMPORTANT:
             *
             * This prop name must match the
             * child component:
             *
             * EditPlayerProfile({
             *   onUpdated
             * })
             */
            onUpdated={
              handleProfileUpdated
            }
          />

        )}


      </main>

    </>

  );

};


export default PlayerProfile;