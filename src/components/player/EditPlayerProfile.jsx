import { useEffect, useRef, useState } from 'react';

import {
  updatePlayerProfile
} from '../../api/playerApi.js';

import { useTranslation } from 'react-i18next';


const POSITIONS = [
  'GK',
  'LB',
  'LWB',
  'RB',
  'RWB',
  'CB',
  'CDM',
  'CM',
  'CAM',
  'LM',
  'RM',
  'RW',
  'LW',
  'ST'
];


export default function EditPlayerProfile({
  player,
  onClose,
  onUpdated
}) {

  const { t } =
    useTranslation();


  const [formData, setFormData] = useState({

    firstName: '',
    lastName: '',
    dateOfBirth: '',
    positions: [],
    preferredFoot: '',
    height: '',
    weight: '',
    nationality: '',
    hasCurrentClub: false,
    currentClub: '',
    city: '',
    bio: ''

  });


  const [saving,
    setSaving] =
    useState(false);

  const [error,
    setError] =
    useState('');

  const [fieldErrors,
    setFieldErrors] =
    useState({});

  const [success,
    setSuccess] =
    useState('');


  /*
   * POSITION DROPDOWN
   */
  const [
    positionsOpen,
    setPositionsOpen
  ] = useState(false);


  const positionsDropdownRef =
    useRef(null);


  /*
   * LOAD CURRENT PLAYER DATA
   */
  useEffect(() => {

    if (!player) {
      return;
    }


    const profile =
      player.profile || {};


    /*
     * The database stores positions as a
     * comma-separated string.
     *
     * Convert the database value into an
     * array for the frontend multi-select.
     */
    let loadedPositions = [];


    if (Array.isArray(profile.positions)) {

      loadedPositions =
        profile.positions
          .map((position) =>
            String(position).trim()
          )
          .filter(Boolean);

    } else if (
      typeof profile.positions === 'string'
    ) {

      loadedPositions =
        profile.positions
          .split(',')
          .map((position) =>
            position.trim()
          )
          .filter(Boolean);

    }


    setFormData({

      firstName:
        player.firstName || '',

      lastName:
        player.lastName || '',

      dateOfBirth:
        profile.dateOfBirth
          ? new Date(
              profile.dateOfBirth
            ).toLocaleDateString(
              'en-CA'
            )
          : '',

      positions:
        loadedPositions,

      preferredFoot:
        profile.preferredFoot || '',

      height:
        profile.height ?? '',

      weight:
        profile.weight ?? '',

      nationality:
        profile.nationality || '',

      /*
       * Convert the database boolean into
       * a real frontend boolean.
       */
      hasCurrentClub:
        profile.hasCurrentClub === true,

      /*
       * Only display the current club name
       * when the player currently has a club.
       */
      currentClub:
        profile.hasCurrentClub === true
          ? profile.currentClub || ''
          : '',

      city:
        profile.city || '',

      bio:
        profile.bio || ''

    });


    setPositionsOpen(false);

  }, [player]);


  /*
   * CLOSE POSITION DROPDOWN
   * WHEN CLICKING OUTSIDE
   */
  useEffect(() => {

    function handleClickOutside(event) {

      if (
        positionsDropdownRef.current &&
        !positionsDropdownRef.current.contains(
          event.target
        )
      ) {

        setPositionsOpen(false);

      }

    }


    document.addEventListener(
      'mousedown',
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );

    };

  }, []);


  /*
   * HANDLE NORMAL INPUT CHANGE
   */
  function handleChange(event) {

    const {
      name,
      value
    } = event.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );


    if (fieldErrors[name]) {

      setFieldErrors(
        (previous) => ({
          ...previous,
          [name]: ''
        })
      );

    }

  }


  /*
   * HANDLE CURRENT CLUB YES / NO
   */
  function handleCurrentClubChange(
    hasCurrentClub
  ) {

    setFormData(
      (previous) => ({
        ...previous,

        hasCurrentClub,

        /*
         * If No is selected,
         * immediately clear the club name.
         */
        currentClub:
          hasCurrentClub
            ? previous.currentClub
            : ''

      })
    );


    setFieldErrors(
      (previous) => ({
        ...previous,
        hasCurrentClub: '',
        currentClub: ''
      })
    );

  }


  /*
   * HANDLE POSITION SELECTION
   *
   * GK is exclusive.
   */
  function handlePositionChange(position) {

    setFormData(
      (previous) => {

        const currentPositions =
          Array.isArray(
            previous.positions
          )
            ? previous.positions
            : [];


        const isSelected =
          currentPositions.includes(
            position
          );


        /*
         * UNCHECK
         */
        if (isSelected) {

          const updatedPositions =
            currentPositions.filter(
              (item) =>
                item !== position
            );


          return {
            ...previous,
            positions:
              updatedPositions
          };

        }


        /*
         * CHECK GK
         *
         * GK must be the only position.
         */
        if (position === 'GK') {

          return {
            ...previous,
            positions: ['GK']
          };

        }


        /*
         * CHECK NORMAL POSITION
         *
         * Remove GK first, then add
         * the selected normal position.
         */
        const updatedPositions = [
          ...currentPositions.filter(
            (item) =>
              item !== 'GK'
          ),
          position
        ];


        return {
          ...previous,
          positions:
            updatedPositions
        };

      }
    );


    if (fieldErrors.positions) {

      setFieldErrors(
        (previous) => ({
          ...previous,
          positions: ''
        })
      );

    }

  }


  /*
   * SAVE PROFILE
   */
  async function handleSubmit(event) {

    event.preventDefault();


    setSaving(true);
    setError('');
    setFieldErrors({});
    setSuccess('');


    try {

      /*
       * Build the payload expected by
       * the backend.
       */
      const payload = {

        firstName:
          formData.firstName.trim(),

        lastName:
          formData.lastName.trim(),

        dateOfBirth:
          formData.dateOfBirth,

        /*
         * Convert frontend array into the
         * comma-separated database format.
         *
         * Example:
         *
         * ['CM', 'CAM', 'RW']
         *
         * becomes:
         *
         * "CM, CAM, RW"
         */
        positions:
          formData.positions.join(', '),

        preferredFoot:
          formData.preferredFoot,

        height:
          formData.height === ''
            ? ''
            : Number(formData.height),

        weight:
          formData.weight === ''
            ? ''
            : Number(formData.weight),

        nationality:
          formData.nationality.trim(),

        /*
         * Always send a real boolean.
         */
        hasCurrentClub:
          formData.hasCurrentClub,

        /*
         * If No is selected, send an empty
         * string so the repository stores NULL.
         */
        currentClub:
          formData.hasCurrentClub
            ? formData.currentClub.trim()
            : '',

        city:
          formData.city.trim(),

        bio:
          formData.bio.trim()

      };


      /*
       * SEND UPDATE REQUEST
       */
      const {
        response,
        data
      } =
        await updatePlayerProfile(
          payload
        );


      /*
       * BACKEND VALIDATION ERROR
       */
      if (!response.ok) {

        if (data.errors) {

          setFieldErrors(
            data.errors
          );

        }


        setError(
          data.message ||
          t(
            'playerProfile.editProfile.updateError'
          )
        );

        return;
      }


      /*
       * UPDATE WAS SUCCESSFUL
       */
      setSuccess(
        t(
          'playerProfile.editProfile.updateSuccess'
        )
      );


      /*
       * IMPORTANT:
       *
       * Tell PlayerProfile to reload the
       * complete profile from the backend.
       *
       * The backend recalculates:
       *
       * - profileCompletionPercentage
       * - profileCompleted
       * - completedRequiredFields
       * - totalRequiredFields
       *
       * Wait for the parent to finish loading
       * before closing the modal.
       */
      if (onUpdated) {

        await onUpdated(
          data.profile
        );

      } else if (onClose) {

        /*
         * Fallback in case this component is
         * ever used without an onUpdated callback.
         */
        onClose();

      }


    } catch (error) {

      console.error(
        'Profile update error:',
        error
      );


      setError(
        t(
          'playerProfile.editProfile.connectionError'
        )
      );


    } finally {

      setSaving(false);

    }

  }


  /*
   * POSITION STATE
   */
  const selectedPositions =
    Array.isArray(
      formData.positions
    )
      ? formData.positions
      : [];


  const goalkeeperSelected =
    selectedPositions.includes(
      'GK'
    );


  const normalPositionSelected =
    selectedPositions.some(
      (position) =>
        position !== 'GK'
    );


  /*
   * TEXT SHOWN IN THE CLOSED DROPDOWN
   */
  let positionDisplayText;


  if (selectedPositions.length === 0) {

    positionDisplayText =
      t(
        'playerProfile.editProfile.positionPlaceholder'
      );

  } else {

    positionDisplayText =
      selectedPositions.join(', ');

  }


  return (

    <div className="edit-profile-overlay">

      <div className="edit-profile-modal">


        {/* HEADER */}

        <div className="edit-profile-header">

          <div>

            <span className="section-label">

              <span className="section-dot"></span>

              {t(
                'playerProfile.editProfile.label'
              )}

            </span>


            <h2>

              {t(
                'playerProfile.editProfile.title'
              )}

            </h2>


            <p>

              {t(
                'playerProfile.editProfile.description'
              )}

            </p>

          </div>


          <button
            type="button"
            className="edit-profile-close"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>

        </div>


        {/* ERROR */}

        {error && (

          <div className="edit-profile-error">

            {error}

          </div>

        )}


        {/* SUCCESS */}

        {success && (

          <div className="edit-profile-success">

            {success}

          </div>

        )}


        {/* FORM */}

        <form
          className="edit-profile-form"
          onSubmit={handleSubmit}
        >


          {/* PERSONAL INFORMATION */}

          <div className="edit-form-section">

            <div className="edit-form-section-title">

              {t(
                'playerProfile.editProfile.personalInformation'
              )}

            </div>


            <div className="edit-form-grid">


              {/* FIRST NAME */}

              <div className="edit-form-field">

                <label>

                  {t(
                    'playerProfile.editProfile.firstName'
                  )}

                </label>


                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t(
                    'playerProfile.editProfile.firstNamePlaceholder'
                  )}
                  disabled={saving}
                />


                {fieldErrors.firstName && (

                  <small>
                    {fieldErrors.firstName}
                  </small>

                )}

              </div>


              {/* LAST NAME */}

              <div className="edit-form-field">

                <label>

                  {t(
                    'playerProfile.editProfile.lastName'
                  )}

                </label>


                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={t(
                    'playerProfile.editProfile.lastNamePlaceholder'
                  )}
                  disabled={saving}
                />


                {fieldErrors.lastName && (

                  <small>
                    {fieldErrors.lastName}
                  </small>

                )}

              </div>


              {/* DATE OF BIRTH */}

              <div className="edit-form-field">

                <label>

                  {t(
                    'playerProfile.editProfile.dateOfBirth'
                  )}

                </label>


                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={saving}
                />


                {fieldErrors.dateOfBirth && (

                  <small>
                    {fieldErrors.dateOfBirth}
                  </small>

                )}

              </div>


              {/* NATIONALITY */}

              <div className="edit-form-field">

                <label>

                  {t(
                    'playerProfile.editProfile.nationality'
                  )}

                </label>


                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder={t(
                    'playerProfile.editProfile.nationalityPlaceholder'
                  )}
                  disabled={saving}
                />


                {fieldErrors.nationality && (

                  <small>
                    {fieldErrors.nationality}
                  </small>

                )}

              </div>


              {/* CITY */}

              <div className="edit-form-field">

                <label>

                  {t(
                    'playerProfile.editProfile.city'
                  )}

                </label>


                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t(
                    'playerProfile.editProfile.cityPlaceholder'
                  )}
                  disabled={saving}
                />

              </div>


            </div>

          </div>


          {/* FOOTBALL INFORMATION */}

          <div className="edit-form-section">

            <div className="edit-form-section-title">

              {t(
                'playerProfile.editProfile.footballInformation'
              )}

            </div>


            <div className="edit-form-grid">


              {/* POSITION MULTI-SELECT */}

              <div
                className="edit-form-field edit-form-full"
                ref={positionsDropdownRef}
              >

                <label>

                  {t(
                    'playerProfile.editProfile.position'
                  )}

                </label>


                <div
                  className={`edit-position-dropdown ${
                    positionsOpen
                      ? 'open'
                      : ''
                  }`}
                >


                  {/* SELECTED VALUE / TRIGGER */}

                  <button
                    type="button"
                    className="edit-position-dropdown-trigger"
                    onClick={() =>
                      setPositionsOpen(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={saving}
                  >

                    <span
                      className={
                        selectedPositions.length === 0
                          ? 'placeholder'
                          : ''
                      }
                    >
                      {positionDisplayText}
                    </span>


                    <span
                      className="edit-position-dropdown-arrow"
                    >
                      {positionsOpen
                        ? '▲'
                        : '▼'}
                    </span>

                  </button>


                  {/* DROPDOWN OPTIONS */}

                  {positionsOpen && (

                    <div className="edit-position-dropdown-menu">

                      {POSITIONS.map(
                        (position) => {

                          const isSelected =
                            selectedPositions.includes(
                              position
                            );


                          /*
                           * GK is disabled when
                           * a normal position exists.
                           *
                           * Normal positions are
                           * disabled when GK exists.
                           */
                          const isDisabled =
                            position === 'GK'
                              ? normalPositionSelected
                              : goalkeeperSelected;


                          return (

                            <label
                              key={position}
                              className={`edit-position-dropdown-option ${
                                isSelected
                                  ? 'selected'
                                  : ''
                              } ${
                                isDisabled
                                  ? 'disabled'
                                  : ''
                              }`}
                            >

                              <input
                                type="checkbox"
                                checked={
                                  isSelected
                                }
                                disabled={
                                  isDisabled ||
                                  saving
                                }
                                onChange={() =>
                                  handlePositionChange(
                                    position
                                  )
                                }
                              />


                              <span
                                className="edit-position-checkmark"
                              >
                                {isSelected
                                  ? '✓'
                                  : ''}
                              </span>


                              <span
                                className="edit-position-name"
                              >
                                {position}
                              </span>

                            </label>

                          );

                        }
                      )}

                    </div>

                  )}

                </div>


                {fieldErrors.positions && (

                  <small>
                    {fieldErrors.positions}
                  </small>

                )}

              </div>


              {/* PREFERRED FOOT */}

              <div className="edit-form-field">

                <label>

                  {t(
                    'playerProfile.editProfile.preferredFoot'
                  )}

                </label>


                <select
                  name="preferredFoot"
                  value={formData.preferredFoot}
                  onChange={handleChange}
                  disabled={saving}
                >

                  <option value="">

                    {t(
                      'playerProfile.editProfile.selectPreferredFoot'
                    )}

                  </option>


                  <option value="Left">
                    Left
                  </option>


                  <option value="Right">
                    Right
                  </option>


                  <option value="Both">
                    Both
                  </option>

                </select>


                {fieldErrors.preferredFoot && (

                  <small>
                    {fieldErrors.preferredFoot}
                  </small>

                )}

              </div>


              {/* HEIGHT */}

              <div className="edit-form-field">

                <label>

                  {t(
                    'playerProfile.editProfile.height'
                  )}

                </label>


                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="145"
                  max="210"
                  placeholder={t(
                    'playerProfile.editProfile.heightPlaceholder'
                  )}
                  disabled={saving}
                />


                {fieldErrors.height && (

                  <small>
                    {fieldErrors.height}
                  </small>

                )}

              </div>


              {/* WEIGHT */}

              <div className="edit-form-field">

                <label>

                  {t(
                    'playerProfile.editProfile.weight'
                  )}

                </label>


                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="59"
                  max="120"
                  placeholder={t(
                    'playerProfile.editProfile.weightPlaceholder'
                  )}
                  disabled={saving}
                />


                {fieldErrors.weight && (

                  <small>
                    {fieldErrors.weight}
                  </small>

                )}

              </div>


              {/* CURRENT CLUB / ACADEMY */}

              <div className="edit-form-field edit-form-full">

                <label>

                  {t(
                    'playerProfile.editProfile.currentClub'
                  )}

                </label>


                {/* YES / NO CHECKBOX */}

                <label className="edit-current-club-toggle">

                  <input
                    type="checkbox"
                    checked={
                      formData.hasCurrentClub
                    }
                    onChange={(event) =>
                      handleCurrentClubChange(
                        event.target.checked
                      )
                    }
                    disabled={saving}
                  />


                  <span className="edit-current-club-checkbox">
                    {formData.hasCurrentClub
                      ? '✓'
                      : ''}
                  </span>


                  <span className="edit-current-club-toggle-text">

                    {formData.hasCurrentClub
                      ? t(
                          'playerProfile.editProfile.yes'
                        )
                      : t(
                          'playerProfile.editProfile.no'
                        )}

                  </span>

                </label>


                {fieldErrors.hasCurrentClub && (

                  <small>
                    {fieldErrors.hasCurrentClub}
                  </small>

                )}


                {/* CLUB NAME */}

                {formData.hasCurrentClub && (

                  <div className="edit-current-club-input-wrapper">

                    <input
                      type="text"
                      name="currentClub"
                      value={
                        formData.currentClub
                      }
                      onChange={handleChange}
                      maxLength={200}
                      placeholder={t(
                        'playerProfile.editProfile.currentClubPlaceholder'
                      )}
                      disabled={saving}
                    />


                    {fieldErrors.currentClub && (

                      <small>
                        {fieldErrors.currentClub}
                      </small>

                    )}

                  </div>

                )}

              </div>


            </div>

          </div>


          {/* ABOUT */}

          <div className="edit-form-section">

            <div className="edit-form-section-title">

              {t(
                'playerProfile.editProfile.aboutYou'
              )}

            </div>


            <div className="edit-form-field">

              <label>

                {t(
                  'playerProfile.editProfile.biography'
                )}

              </label>


              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="6"
                maxLength={300}
                placeholder={t(
                  'playerProfile.editProfile.biographyPlaceholder'
                )}
                disabled={saving}
              />


              <div className="edit-character-count">

                <span>
                  {formData.bio.length} / 300
                </span>


                <span>

                  {t(
                    'playerProfile.editProfile.charactersRemaining',
                    {
                      count:
                        300 -
                        formData.bio.length
                    }
                  )}

                </span>

              </div>


              {fieldErrors.bio && (

                <small>
                  {fieldErrors.bio}
                </small>

              )}

            </div>

          </div>


          {/* BUTTONS */}

          <div className="edit-profile-actions">

            <button
              type="button"
              className="edit-cancel-button"
              onClick={onClose}
              disabled={saving}
            >

              {t('common.cancel')}

            </button>


            <button
              type="submit"
              className="edit-save-button"
              disabled={saving}
            >

              {saving
                ? t('common.saving')
                : t(
                    'playerProfile.editProfile.saveChanges'
                  )}

            </button>

          </div>


        </form>

      </div>

    </div>

  );

}