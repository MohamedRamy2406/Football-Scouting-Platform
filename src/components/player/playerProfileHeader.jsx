import {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  useTranslation
} from 'react-i18next';


function formatPosition(position, t) {

  if (!position) {

    return t(
      'playerProfile.header.positionNotProvided'
    );

  }


  if (Array.isArray(position)) {

    return position.join(' / ');

  }


  return position;

}


export default function PlayerProfileHeader({
  player,
  onEdit,
  onPhotoSelected,
  uploadingPhoto
}) {

  const { t } =
    useTranslation();


  const [photoViewerOpen,
    setPhotoViewerOpen] =
    useState(false);


  const position =
    formatPosition(
      player.profile?.positions,
      t
    );


  const club =
    player.profile?.currentClub;


  const photo =
    player.profile?.profilePhoto;


  const bio =
    player.profile?.bio;


  const fileInputRef =
    useRef(null);


  /*
   * ============================================
   * PHOTO URL
   * ============================================
   */

  const photoUrl =
    photo
      ? (
          photo.startsWith('http')
            ? photo
            : `http://localhost:5000${photo}`
        )
      : '';


  /*
   * ============================================
   * OPEN PHOTO VIEWER
   * ============================================
   */

  function openPhotoViewer() {

    if (!photo) {
      return;
    }


    setPhotoViewerOpen(true);

  }


  /*
   * ============================================
   * CLOSE PHOTO VIEWER
   * ============================================
   */

  function closePhotoViewer() {

    setPhotoViewerOpen(false);

  }


  /*
   * ============================================
   * ESCAPE KEY
   * ============================================
   */

  useEffect(() => {

    if (!photoViewerOpen) {
      return;
    }


    function handleEscape(event) {

      if (event.key === 'Escape') {

        closePhotoViewer();

      }

    }


    document.addEventListener(
      'keydown',
      handleEscape
    );


    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';


    return () => {

      document.removeEventListener(
        'keydown',
        handleEscape
      );


      document.body.style.overflow =
        previousOverflow;

    };

  }, [photoViewerOpen]);


  /*
   * ============================================
   * OPEN UPLOAD PICKER
   * ============================================
   */

  function openUploadPicker() {

    if (uploadingPhoto) {
      return;
    }


    fileInputRef.current?.click();

  }


  /*
   * ============================================
   * PHOTO FILE SELECTED
   * ============================================
   */

  function handlePhotoFileChange(event) {

    const file =
      event.target.files?.[0];


    if (file) {

      onPhotoSelected(file);

    }


    event.target.value = '';

  }


  return (

    <>


      {/* ========================================
          PROFILE HEADER
      ======================================== */}

      <section className="player-profile-header">


        {/* ======================================
            TOP PROFILE AREA
        ====================================== */}

        <div className="player-header-main">


          {/* ====================================
              PROFILE PHOTO
          ==================================== */}

          <div className="player-avatar-wrapper">


            <div className="player-avatar-upload">


              <button
                type="button"
                className="player-avatar-photo-button"
                onClick={openPhotoViewer}
                disabled={!photo}
                aria-label={
                  photo
                    ? t(
                        'playerProfile.header.viewProfilePhoto'
                      )
                    : t(
                        'playerProfile.header.profilePhotoNotAvailable'
                      )
                }
              >


                <div className="player-avatar-frame">


                  {photo ? (

                    <img
                      src={photoUrl}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="player-avatar"
                    />

                  ) : (

                    <div className="player-avatar player-avatar-empty">

                      <span className="camera-icon">
                        📷
                      </span>

                    </div>

                  )}


                  {photo && (

                    <div className="avatar-hover-overlay">

                      <span>

                        {t(
                          'playerProfile.header.viewPhoto'
                        )}

                      </span>

                    </div>

                  )}


                </div>


              </button>


              {/* =================================
                  CAMERA / UPLOAD BUTTON
              ================================= */}

              <button
                type="button"
                className="avatar-camera-button"
                onClick={openUploadPicker}
                disabled={uploadingPhoto}
                aria-label={t(
                  'playerProfile.header.uploadProfilePhoto'
                )}
              >

                📷

              </button>


            </div>


            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={
                handlePhotoFileChange
              }
            />


          </div>


          {/* ====================================
              PLAYER IDENTITY
          ==================================== */}

          <div className="player-header-info">


            <h1 className="player-profile-name">

              {player.firstName}{' '}
              {player.lastName}

            </h1>


            <div className="player-profile-positions">

              {position}

            </div>


            <div className="player-profile-club">

              {club?.trim()
                ? club
                : t(
                    'playerProfile.header.noCurrentClub'
                  )}

            </div>


            {/* ==================================
                EDIT PROFILE
            ================================== */}

            <button
              type="button"
              className="player-edit-button"
              onClick={onEdit}
            >

              {t(
                'playerProfile.header.editProfile'
              )}

            </button>


          </div>


        </div>


        {/* ======================================
            INSTAGRAM-STYLE BIO
        ====================================== */}

        <div className="player-header-about">


          <div className="player-header-about-heading">

            <span className="section-label">

              <span className="section-dot"></span>

              {t(
                'playerProfile.about.label'
              )}

            </span>


            <h2>

              {t(
                'playerProfile.about.title'
              )}

            </h2>

          </div>


          <div className="player-header-about-content">


            {bio ? (

              <p>

                {bio}

              </p>

            ) : (

              <p className="empty-profile-text">

                {t(
                  'playerProfile.about.empty'
                )}

              </p>

            )}


          </div>


        </div>


      </section>


      {/* ========================================
          PROFILE PHOTO VIEWER
      ======================================== */}

      {photoViewerOpen && photo && (

        <div
          className="profile-photo-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={t(
            'playerProfile.header.profilePhotoViewer'
          )}
          onClick={closePhotoViewer}
        >


          <button
            type="button"
            className="profile-photo-viewer-close"
            onClick={closePhotoViewer}
            aria-label={t(
              'playerProfile.header.closePhotoViewer'
            )}
          >

            ×

          </button>


          <div
            className="profile-photo-viewer-content"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >

            <img
              src={photoUrl}
              alt={`${player.firstName} ${player.lastName}`}
              className="profile-photo-viewer-image"
            />

          </div>


        </div>

      )}


    </>

  );

}