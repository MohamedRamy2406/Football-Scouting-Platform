import {
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  getPlayerProfile,
  getPlayerClubHistory,
  uploadPlayerPhoto
} from '../api/playerApi.js';

import {
  useAuth
} from '../context/AuthContext.jsx';

import PlayerProfileHeader
  from '../components/player/playerProfileHeader.jsx';

import ProfileCompletion
  from '../components/player/ProfileCompletion.jsx';

import FootballInformation
  from '../components/player/FootballInformation.jsx';

import ClubHistory
  from '../components/player/clubHistory.jsx';

import Achievements
  from '../components/player/Achievements.jsx';

import EditPlayerProfile
  from '../components/player/EditPlayerProfile.jsx';

import PlayerSettingsModal
  from '../components/player/PlayerSettingsModal.jsx';

import LanguageSelector
  from '../components/common/LanguageSelector.jsx';

import Videos
  from '../components/player/Videos.jsx';

import {
  useTranslation
} from 'react-i18next';


const PlayerProfile = () => {

  const {
    user: currentUser
  } = useAuth();


  const {
    t
  } = useTranslation();


  /* =========================================================
     PLAYER DATA
  ========================================================= */

  const [
    player,
    setPlayer
  ] = useState(null);


  const [
    clubHistory,
    setClubHistory
  ] = useState([]);


  /* =========================================================
     PAGE STATE
  ========================================================= */

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState('');


  /* =========================================================
     MODAL STATE
  ========================================================= */

  const [
    editing,
    setEditing
  ] = useState(false);


  const [
    settingsOpen,
    setSettingsOpen
  ] = useState(false);


  const [
    uploadingPhoto,
    setUploadingPhoto
  ] = useState(false);


  /* =========================================================
     ACTIVE TAB
  ========================================================= */

  const [
    activeTab,
    setActiveTab
  ] = useState('videos');


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


          setPlayer(
            profileResult?.data?.profile ||
            null
          );


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
              'playerProfile.errors.loadProfile',
              {
                defaultValue:
                  'Could not load player profile.'
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
     PROFILE PHOTO
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
            'playerProfile.errors.uploadPhoto',
            {
              defaultValue:
                'Could not upload profile photo.'
            }
          )
        );


      } finally {

        setUploadingPhoto(false);

      }

    };


  /* =========================================================
     PROFILE UPDATED
  ========================================================= */

  const handleProfileUpdated =
    useCallback(
      async () => {

        await loadProfile();

        setEditing(false);

      },
      [loadProfile]
    );


  /* =========================================================
     LOADING STATE
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
     ERROR STATE
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
     PROFILE NOT FOUND
  ========================================================= */

  if (!player) {

    return (

      <>

        <LanguageSelector />

        <main className="player-profile-page">

          <div className="player-profile-error">

            {t(
              'playerProfile.errors.loadProfile',
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
     MAIN PAGE
  ========================================================= */

  return (

    <>

      <LanguageSelector />


      <main className="player-profile-page">


        {/* ===================================================
            PLAYER HEADER
        =================================================== */}

        <PlayerProfileHeader

          player={
            player
          }

          currentUser={
            currentUser
          }

          onEdit={() =>
            setEditing(true)
          }

          onSettings={() =>
            setSettingsOpen(true)
          }

          onPhotoSelected={
            handlePhotoSelected
          }

          uploadingPhoto={
            uploadingPhoto
          }

        />


        {/* ===================================================
            PROFILE COMPLETION
        =================================================== */}

        {!player.profileCompleted && (

          <ProfileCompletion

            player={
              player
            }

            onProfileUpdated={
              loadProfile
            }

          />

        )}


        {/* ===================================================
            PROFILE TABS
        =================================================== */}

        <div className="player-profile-tabs">


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


        {/* ===================================================
            TAB CONTENT
        =================================================== */}

        <div className="player-profile-tab-content">


          {/* =================================================
              VIDEOS
          ================================================= */}

          {activeTab === 'videos' && (

            <Videos

              profileCompleted={
                player.profileCompleted
              }

            />

          )}


          {/* =================================================
              INFO
          ================================================= */}

          {activeTab === 'info' && (

            <div className="player-content-grid">


              <div className="player-info-football">

                <FootballInformation
                  player={
                    player
                  }
                />

              </div>


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


          {/* =================================================
              TRIALS
          ================================================= */}

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


        {/* ===================================================
            EDIT PROFILE MODAL
        =================================================== */}

        {editing && (

          <EditPlayerProfile

            player={
              player
            }

            onClose={() =>
              setEditing(false)
            }

            onUpdated={
              handleProfileUpdated
            }

          />

        )}


        {/* ===================================================
            SETTINGS MODAL
        =================================================== */}

        {settingsOpen && (

          <PlayerSettingsModal

            onClose={() =>
              setSettingsOpen(false)
            }

          />

        )}


      </main>

    </>

  );

};


export default PlayerProfile;