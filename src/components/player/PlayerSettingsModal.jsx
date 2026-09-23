import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { changePassword } from '../../api/authApi.js';
import API_BASE_URL from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';


function PlayerSettingsModal({ onClose }) {

  const { t } = useTranslation();

  const { logout } = useAuth();


  /* =========================================================
     PASSWORD STATE
  ========================================================= */

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');


  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState('');

  const [passwordError, setPasswordError] =
    useState('');


  /* =========================================================
     LOGOUT STATE
  ========================================================= */

  const [logoutLoading, setLogoutLoading] =
    useState(false);


  /* =========================================================
     DELETE ACCOUNT STATE
  ========================================================= */

  const [deleteConfirmOpen, setDeleteConfirmOpen] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState('');


  /* =========================================================
     PASSWORD VALIDATION
  ========================================================= */

  const validatePassword = () => {

    if (!currentPassword.trim()) {

      return t(
        'playerProfile.settings.password.currentRequired',
        {
          defaultValue:
            'Please enter your current password.'
        }
      );

    }


    if (!newPassword) {

      return t(
        'playerProfile.settings.password.newRequired',
        {
          defaultValue:
            'Please enter a new password.'
        }
      );

    }


    if (newPassword.length < 9) {

      return t(
        'playerProfile.settings.password.tooShort',
        {
          defaultValue:
            'New password must be at least 9 characters long.'
        }
      );

    }


    if (!/[A-Z]/.test(newPassword)) {

      return t(
        'playerProfile.settings.password.uppercaseRequired',
        {
          defaultValue:
            'New password must contain at least one uppercase letter.'
        }
      );

    }


    if (!/[a-z]/.test(newPassword)) {

      return t(
        'playerProfile.settings.password.lowercaseRequired',
        {
          defaultValue:
            'New password must contain at least one lowercase letter.'
        }
      );

    }


    if (!/[0-9]/.test(newPassword)) {

      return t(
        'playerProfile.settings.password.numberRequired',
        {
          defaultValue:
            'New password must contain at least one number.'
        }
      );

    }


    if (!confirmPassword) {

      return t(
        'playerProfile.settings.password.confirmRequired',
        {
          defaultValue:
            'Please confirm your new password.'
        }
      );

    }


    if (newPassword !== confirmPassword) {

      return t(
        'playerProfile.settings.password.passwordsDoNotMatch',
        {
          defaultValue:
            'New passwords do not match.'
        }
      );

    }


    return null;
  };


  /* =========================================================
     CHANGE PASSWORD
  ========================================================= */

  const handleChangePassword = async (event) => {

    event.preventDefault();


    setPasswordMessage('');
    setPasswordError('');


    const validationError =
      validatePassword();


    if (validationError) {

      setPasswordError(validationError);

      return;
    }


    try {

      setPasswordLoading(true);


      const {
        response,
        data
      } = await changePassword({

        currentPassword,

        newPassword

      });


      if (!response.ok) {

        setPasswordError(

          data?.message ||

          t(
            'playerProfile.settings.password.failed',
            {
              defaultValue:
                'Could not change your password.'
            }
          )

        );

        return;
      }


      setPasswordMessage(

        data?.message ||

        t(
          'playerProfile.settings.password.success',
          {
            defaultValue:
              'Your password has been changed successfully.'
          }
        )

      );


      setCurrentPassword('');

      setNewPassword('');

      setConfirmPassword('');

    }

    catch (error) {

      console.error(
        'Change password error:',
        error
      );


      setPasswordError(

        t(
          'playerProfile.settings.password.connectionError',
          {
            defaultValue:
              'Could not connect to the server.'
          }
        )

      );

    }

    finally {

      setPasswordLoading(false);

    }

  };


  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {

    setDeleteError('');


    try {

      setLogoutLoading(true);


      const success =
        await logout();


      if (!success) {

        setDeleteError(

          t(
            'playerProfile.settings.account.logoutFailed',
            {
              defaultValue:
                'Could not log out. Please try again.'
            }
          )

        );

        return;
      }


      onClose();

    }

    catch (error) {

      console.error(
        'Logout error:',
        error
      );


      setDeleteError(

        t(
          'playerProfile.settings.account.logoutFailed',
          {
            defaultValue:
              'Could not log out. Please try again.'
          }
        )

      );

    }

    finally {

      setLogoutLoading(false);

    }

  };


  /* =========================================================
     DELETE ACCOUNT
  ========================================================= */

  const handleDeleteAccount = async () => {

    setDeleteError('');


    try {

      setDeleteLoading(true);


      const response =
        await fetch(
          `${API_BASE_URL}/api/player/account`,
          {
            method: 'DELETE',
            credentials: 'include'
          }
        );


      let data = {};


      try {

        data =
          await response.json();

      }

      catch {

        data = {};

      }


      if (!response.ok) {

        setDeleteError(

          data?.message ||

          t(
            'playerProfile.settings.account.deleteFailed',
            {
              defaultValue:
                'Could not delete your account.'
            }
          )

        );

        return;
      }


      /*
       * The account has already been deleted by the
       * backend. The session may also have been destroyed.
       *
       * Try to clear the frontend authentication state.
       */

      try {

        await logout();

      }

      catch (logoutError) {

        console.error(
          'Logout after account deletion failed:',
          logoutError
        );

      }


      window.location.href = '/';

    }

    catch (error) {

      console.error(
        'Delete account error:',
        error
      );


      setDeleteError(

        t(
          'playerProfile.settings.account.connectionError',
          {
            defaultValue:
              'Could not connect to the server.'
          }
        )

      );

    }

    finally {

      setDeleteLoading(false);

    }

  };


  /* =========================================================
     CLOSE WHEN CLICKING OUTSIDE
  ========================================================= */

  const handleOverlayClick = (event) => {

    if (
      event.target === event.currentTarget
    ) {

      onClose();

    }

  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div
      className="player-settings-overlay"
      onMouseDown={handleOverlayClick}
    >

      <div
        className="player-settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-settings-title"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="player-settings-header">

          <h2 id="player-settings-title">

            {t(
              'playerProfile.settings.title',
              {
                defaultValue: 'Settings'
              }
            )}

          </h2>


          <button
            type="button"
            className="player-settings-close"
            onClick={onClose}
            aria-label={t(
              'playerProfile.settings.close',
              {
                defaultValue:
                  'Close settings'
              }
            )}
            title={t(
              'playerProfile.settings.close',
              {
                defaultValue:
                  'Close settings'
              }
            )}
          >

            ×

          </button>

        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="player-settings-content">


          {/* =================================================
              CHANGE PASSWORD
          ================================================= */}

          <section className="player-settings-section">

            <div className="player-settings-section-header">

              <h3>

                {t(
                  'playerProfile.settings.password.title',
                  {
                    defaultValue:
                      'Change Password'
                  }
                )}

              </h3>

            </div>


            <form
              className="player-settings-password-form"
              onSubmit={handleChangePassword}
            >


              {/* CURRENT PASSWORD */}

              <div className="player-settings-field">

                <label htmlFor="current-password">

                  {t(
                    'playerProfile.settings.password.currentPassword',
                    {
                      defaultValue:
                        'Current Password'
                    }
                  )}

                </label>


                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => {

                    setCurrentPassword(
                      event.target.value
                    );

                    setPasswordError('');

                    setPasswordMessage('');

                  }}
                  placeholder={t(
                    'playerProfile.settings.password.currentPasswordPlaceholder',
                    {
                      defaultValue:
                        'Enter your current password'
                    }
                  )}
                  autoComplete="current-password"
                  disabled={passwordLoading}
                />

              </div>


              {/* NEW PASSWORD */}

              <div className="player-settings-field">

                <label htmlFor="new-password">

                  {t(
                    'playerProfile.settings.password.newPassword',
                    {
                      defaultValue:
                        'New Password'
                    }
                  )}

                </label>


                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => {

                    setNewPassword(
                      event.target.value
                    );

                    setPasswordError('');

                    setPasswordMessage('');

                  }}
                  placeholder={t(
                    'playerProfile.settings.password.newPasswordPlaceholder',
                    {
                      defaultValue:
                        'Enter your new password'
                    }
                  )}
                  autoComplete="new-password"
                  disabled={passwordLoading}
                />

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="player-settings-field">

                <label htmlFor="confirm-password">

                  {t(
                    'playerProfile.settings.password.confirmPassword',
                    {
                      defaultValue:
                        'Confirm New Password'
                    }
                  )}

                </label>


                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {

                    setConfirmPassword(
                      event.target.value
                    );

                    setPasswordError('');

                    setPasswordMessage('');

                  }}
                  placeholder={t(
                    'playerProfile.settings.password.confirmPasswordPlaceholder',
                    {
                      defaultValue:
                        'Re-enter your new password'
                    }
                  )}
                  autoComplete="new-password"
                  disabled={passwordLoading}
                />

              </div>


              {/* REQUIREMENTS */}

              <p className="player-settings-password-requirements">

                {t(
                  'playerProfile.settings.password.passwordRequirements',
                  {
                    defaultValue:
                      'Minimum 9 characters, including an uppercase letter, lowercase letter, and number.'
                  }
                )}

              </p>


              {/* ERROR */}

              {passwordError && (

                <div className="player-settings-message player-settings-error">

                  {passwordError}

                </div>

              )}


              {/* SUCCESS */}

              {passwordMessage && (

                <div className="player-settings-message player-settings-success">

                  {passwordMessage}

                </div>

              )}


              {/* SUBMIT */}

              <button
                type="submit"
                className="player-settings-primary-button"
                disabled={passwordLoading}
              >

                {passwordLoading

                  ? t(
                      'playerProfile.settings.password.changing',
                      {
                        defaultValue:
                          'Changing Password...'
                      }
                    )

                  : t(
                      'playerProfile.settings.password.changePassword',
                      {
                        defaultValue:
                          'Change Password'
                      }
                    )

                }

              </button>

            </form>

          </section>


          {/* =================================================
              ACCOUNT
          ================================================= */}

          <section
            className="player-settings-section player-settings-account-section"
          >

            <div className="player-settings-section-header">

              <h3>

                {t(
                  'playerProfile.settings.account.title',
                  {
                    defaultValue:
                      'Account'
                  }
                )}

              </h3>

            </div>


            {deleteError && (

              <div className="player-settings-message player-settings-error">

                {deleteError}

              </div>

            )}


            <button
              type="button"
              className="player-settings-secondary-button"
              onClick={handleLogout}
              disabled={
                logoutLoading ||
                deleteLoading
              }
            >

              {logoutLoading

                ? t(
                    'playerProfile.settings.account.loggingOut',
                    {
                      defaultValue:
                        'Logging Out...'
                    }
                  )

                : t(
                    'playerProfile.settings.account.logout',
                    {
                      defaultValue:
                        'Log Out'
                    }
                  )

              }

            </button>

          </section>


          {/* =================================================
              DELETE ACCOUNT
          ================================================= */}

          <section className="player-settings-danger-section">

            <h3>

              {t(
                'playerProfile.settings.account.deleteAccount',
                {
                  defaultValue:
                    'Delete Account'
                }
              )}

            </h3>


            <p>

              {t(
                'playerProfile.settings.account.deleteAccountDescription',
                {
                  defaultValue:
                    'Permanently delete your account and your account data.'
                }
              )}

            </p>


            {!deleteConfirmOpen && (

              <button
                type="button"
                className="player-settings-danger-button"
                onClick={() => {

                  setDeleteConfirmOpen(true);

                  setDeleteError('');

                }}
                disabled={
                  deleteLoading ||
                  logoutLoading
                }
              >

                {t(
                  'playerProfile.settings.account.deleteAccount',
                  {
                    defaultValue:
                      'Delete Account'
                  }
                )}

              </button>

            )}


            {deleteConfirmOpen && (

              <div className="player-settings-delete-confirm">

                <h4>

                  {t(
                    'playerProfile.settings.account.deleteConfirmTitle',
                    {
                      defaultValue:
                        'Delete Account?'
                    }
                  )}

                </h4>


                <p>

                  {t(
                    'playerProfile.settings.account.deleteConfirmDescription',
                    {
                      defaultValue:
                        'Are you sure you want to permanently delete your account? This action cannot be undone.'
                    }
                  )}

                </p>


                {deleteError && (

                  <div className="player-settings-message player-settings-error">

                    {deleteError}

                  </div>

                )}


                <div className="player-settings-confirm-actions">

                  <button
                    type="button"
                    className="player-settings-cancel-button"
                    onClick={() => {

                      setDeleteConfirmOpen(false);

                      setDeleteError('');

                    }}
                    disabled={deleteLoading}
                  >

                    {t(
                      'playerProfile.settings.account.cancelDelete',
                      {
                        defaultValue:
                          'Cancel'
                      }
                    )}

                  </button>


                  <button
                    type="button"
                    className="player-settings-danger-button"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                  >

                    {deleteLoading

                      ? t(
                          'playerProfile.settings.account.deletingAccount',
                          {
                            defaultValue:
                              'Deleting Account...'
                          }
                        )

                      : t(
                          'playerProfile.settings.account.confirmDelete',
                          {
                            defaultValue:
                              'Yes, Delete My Account'
                          }
                        )

                    }

                  </button>

                </div>

              </div>

            )}

          </section>

        </div>

      </div>

    </div>

  );

}


export default PlayerSettingsModal;