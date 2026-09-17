import { useState } from 'react';

import {
  createPlayerClubHistory,
  updatePlayerClubHistory,
  deletePlayerClubHistory
} from '../../api/playerApi.js';

import { useTranslation } from 'react-i18next';


function formatClubDate(
  date,
  language
) {

  if (!date) {
    return '';
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return '';
  }

  return parsedDate.toLocaleDateString(
    language === 'ar'
      ? 'ar-EG'
      : 'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  );

}


export default function ClubHistory({
  clubHistory = [],
  onClubHistoryChanged
}) {

  const { t, i18n } =
    useTranslation();


  const [editingClub,
    setEditingClub] =
    useState(null);

  const [showForm,
    setShowForm] =
    useState(false);

  const [clubOrAcademy,
    setClubOrAcademy] =
    useState('');

  const [startDate,
    setStartDate] =
    useState('');

  const [endDate,
    setEndDate] =
    useState('');

  const [position,
    setPosition] =
    useState('');

  const [matches,
    setMatches] =
    useState('');

  const [starts,
    setStarts] =
    useState('');

  const [goals,
    setGoals] =
    useState('');

  const [assists,
    setAssists] =
    useState('');

  const [minutes,
    setMinutes] =
    useState('');

  const [saving,
    setSaving] =
    useState(false);

  const [error,
    setError] =
    useState('');


  function resetForm() {

    setClubOrAcademy('');
    setStartDate('');
    setEndDate('');
    setPosition('');

    setMatches('');
    setStarts('');
    setGoals('');
    setAssists('');
    setMinutes('');

    setEditingClub(null);
    setShowForm(false);
    setError('');

  }


  function startEdit(club) {

    setEditingClub(club);

    setClubOrAcademy(
      club.club_or_academy || ''
    );

    setStartDate(
      club.start_date
        ? String(
            club.start_date
          ).slice(0, 10)
        : ''
    );

    setEndDate(
      club.end_date
        ? String(
            club.end_date
          ).slice(0, 10)
        : ''
    );

    setPosition(
      club.position || ''
    );

    setMatches(
      club.matches ?? ''
    );

    setStarts(
      club.starts ?? ''
    );

    setGoals(
      club.goals ?? ''
    );

    setAssists(
      club.assists ?? ''
    );

    setMinutes(
      club.minutes ?? ''
    );

    setShowForm(true);
    setError('');

  }


  async function handleSubmit(event) {

    event.preventDefault();


    if (!clubOrAcademy.trim()) {

      setError(
        t(
          'playerProfile.clubHistory.requiredClub'
        )
      );

      return;
    }


    if (!startDate) {

      setError(
        t(
          'playerProfile.clubHistory.requiredStartDate'
        )
      );

      return;
    }


    if (!position.trim()) {

      setError(
        t(
          'playerProfile.clubHistory.requiredPosition'
        )
      );

      return;
    }


    try {

      setSaving(true);
      setError('');


      const clubHistoryData = {

        club_or_academy:
          clubOrAcademy.trim(),

        start_date:
          startDate || null,

        end_date:
          endDate || null,

        position:
          position.trim(),

        matches:
          matches === ''
            ? 0
            : Number(matches),

        starts:
          starts === ''
            ? 0
            : Number(starts),

        goals:
          goals === ''
            ? 0
            : Number(goals),

        assists:
          assists === ''
            ? 0
            : Number(assists),

        minutes:
          minutes === ''
            ? 0
            : Number(minutes)

      };


      let response;
      let data;


      if (editingClub) {

        ({
          response,
          data
        } =
          await updatePlayerClubHistory(
            editingClub.id,
            clubHistoryData
          ));

      } else {

        ({
          response,
          data
        } =
          await createPlayerClubHistory(
            clubHistoryData
          ));

      }


      if (!response.ok) {

        setError(
          data.message ||
          t(
            'playerProfile.clubHistory.saveError'
          )
        );

        return;
      }


      resetForm();


      if (onClubHistoryChanged) {

        await onClubHistoryChanged();

      }

    } catch (err) {

      console.error(
        'Club history save error:',
        err
      );

      setError(
        t(
          'playerProfile.clubHistory.connectionError'
        )
      );

    } finally {

      setSaving(false);

    }

  }


  async function handleDelete(id) {

    const confirmed =
      window.confirm(
        t(
          'playerProfile.clubHistory.deleteConfirm'
        )
      );


    if (!confirmed) {
      return;
    }


    try {

      setError('');


      const {
        response,
        data
      } =
        await deletePlayerClubHistory(id);


      if (!response.ok) {

        setError(
          data.message ||
          t(
            'playerProfile.clubHistory.deleteError'
          )
        );

        return;
      }


      if (
        editingClub?.id === id
      ) {

        resetForm();

      }


      if (onClubHistoryChanged) {

        await onClubHistoryChanged();

      }

    } catch (err) {

      console.error(
        'Club history delete error:',
        err
      );

      setError(
        t(
          'playerProfile.clubHistory.connectionError'
        )
      );

    }

  }


  return (

    <section className="club-history-section">


      <div className="card-heading club-history-heading">


        <div className="club-history-title">

          <span className="section-label">

            <span className="section-dot"></span>

            {t(
              'playerProfile.clubHistory.label'
            )}

          </span>


          <h2>

            {t(
              'playerProfile.clubHistory.title'
            )}

          </h2>

        </div>


        <button
          type="button"
          className="add-club-history-btn"
          onClick={() => {

            resetForm();
            setShowForm(true);

          }}
        >

          <span className="add-club-history-icon">
            +
          </span>

          <span>

            {t(
              'playerProfile.clubHistory.add'
            )}

          </span>

        </button>

      </div>


      {showForm && (

        <form
          className="club-history-form"
          onSubmit={handleSubmit}
        >


          <div className="club-history-form-header">

            <div>

              <span className="club-history-form-label">

                {editingClub
                  ? t(
                      'playerProfile.clubHistory.editEntry'
                    )
                  : t(
                      'playerProfile.clubHistory.newEntry'
                    )}

              </span>


              <h3>

                {editingClub
                  ? t(
                      'playerProfile.clubHistory.editTitle'
                    )
                  : t(
                      'playerProfile.clubHistory.addTitle'
                    )}

              </h3>

            </div>

          </div>


          <div className="club-history-form-group">

            <label>

              {t(
                'playerProfile.clubHistory.clubAcademy'
              )}

            </label>


            <input
              type="text"
              value={clubOrAcademy}
              onChange={(e) =>
                setClubOrAcademy(
                  e.target.value
                )
              }
              placeholder={t(
                'playerProfile.clubHistory.clubPlaceholder'
              )}
              maxLength={200}
              required
            />


            <span className="club-history-character-count">

              {clubOrAcademy.length} / 200

            </span>

          </div>


          <div className="club-history-date-fields">


            <div className="club-history-form-group">

              <label>

                {t(
                  'playerProfile.clubHistory.startDate'
                )}

              </label>


              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
                required
              />

            </div>


            <div className="club-history-form-group">

              <label>

                {t(
                  'playerProfile.clubHistory.endDate'
                )}

              </label>


              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
              />

            </div>


          </div>


          <div className="club-history-form-group">

            <label>

              {t(
                'playerProfile.clubHistory.position'
              )}

            </label>


            <input
              type="text"
              value={position}
              onChange={(e) =>
                setPosition(
                  e.target.value
                )
              }
              placeholder={t(
                'playerProfile.clubHistory.positionPlaceholder'
              )}
              maxLength={100}
              required
            />


            <span className="club-history-character-count">

              {position.length} / 100

            </span>

          </div>


          <div className="club-history-stats">


            <div className="club-history-form-group">

              <label>

                {t(
                  'playerProfile.clubHistory.matches'
                )}

              </label>


              <input
                type="number"
                min="0"
                value={matches}
                onChange={(e) =>
                  setMatches(
                    e.target.value
                  )
                }
                placeholder="0"
              />

            </div>


            <div className="club-history-form-group">

              <label>

                {t(
                  'playerProfile.clubHistory.starts'
                )}

              </label>


              <input
                type="number"
                min="0"
                value={starts}
                onChange={(e) =>
                  setStarts(
                    e.target.value
                  )
                }
                placeholder="0"
              />

            </div>


            <div className="club-history-form-group">

              <label>

                {t(
                  'playerProfile.clubHistory.goals'
                )}

              </label>


              <input
                type="number"
                min="0"
                value={goals}
                onChange={(e) =>
                  setGoals(
                    e.target.value
                  )
                }
                placeholder="0"
              />

            </div>


            <div className="club-history-form-group">

              <label>

                {t(
                  'playerProfile.clubHistory.assists'
                )}

              </label>


              <input
                type="number"
                min="0"
                value={assists}
                onChange={(e) =>
                  setAssists(
                    e.target.value
                  )
                }
                placeholder="0"
              />

            </div>


            <div className="club-history-form-group">

              <label>

                {t(
                  'playerProfile.clubHistory.minutes'
                )}

              </label>


              <input
                type="number"
                min="0"
                value={minutes}
                onChange={(e) =>
                  setMinutes(
                    e.target.value
                  )
                }
                placeholder="0"
              />

            </div>


          </div>


          {error && (

            <div className="club-history-form-error">

              {error}

            </div>

          )}


          <div className="club-history-form-actions">


            <button
              type="submit"
              className="club-history-save-btn"
              disabled={saving}
            >

              {saving

                ? t('common.saving')

                : editingClub

                ? t('common.saveChanges')

                : t(
                    'playerProfile.clubHistory.add'
                  )}

            </button>


            <button
              type="button"
              className="club-history-cancel-btn"
              onClick={resetForm}
              disabled={saving}
            >

              {t('common.cancel')}

            </button>


          </div>


        </form>

      )}


      {clubHistory.length === 0 ? (

        <div className="club-history-empty">


          <div className="club-history-empty-icon">
            ⚽
          </div>


          <h3>

            {t(
              'playerProfile.clubHistory.noHistoryTitle'
            )}

          </h3>


          <p>

            {t(
              'playerProfile.clubHistory.noHistoryDescription'
            )}

          </p>


        </div>

      ) : (

        <div className="club-history-list">


          {clubHistory.map(
            (club) => (

              <article
                key={club.id}
                className="club-history-item"
              >


                <div className="club-history-club-icon">
                  <span>⚽</span>
                </div>


                <div className="club-history-content">


                  <div className="club-history-item-header">


                    <div className="club-history-club-info">

                      <h3>
                        {club.club_or_academy}
                      </h3>

                      <span className="club-history-position">
                        {club.position}
                      </span>

                    </div>


                    <span className="club-history-date">

                      {formatClubDate(
                        club.start_date,
                        i18n.language
                      )}

                      <span className="club-history-date-separator">
                        —
                      </span>

                      {club.end_date

                        ? formatClubDate(
                            club.end_date,
                            i18n.language
                          )

                        : t(
                            'common.present'
                          )}

                    </span>


                  </div>


                  <div className="club-history-stats-display">


                    <div className="club-history-stat">

                      <strong>
                        {club.matches ?? 0}
                      </strong>

                      <span>

                        {t(
                          'playerProfile.clubHistory.matches'
                        )}

                      </span>

                    </div>


                    <div className="club-history-stat">

                      <strong>
                        {club.starts ?? 0}
                      </strong>

                      <span>

                        {t(
                          'playerProfile.clubHistory.starts'
                        )}

                      </span>

                    </div>


                    <div className="club-history-stat">

                      <strong>
                        {club.goals ?? 0}
                      </strong>

                      <span>

                        {t(
                          'playerProfile.clubHistory.goals'
                        )}

                      </span>

                    </div>


                    <div className="club-history-stat">

                      <strong>
                        {club.assists ?? 0}
                      </strong>

                      <span>

                        {t(
                          'playerProfile.clubHistory.assists'
                        )}

                      </span>

                    </div>


                    <div className="club-history-stat">

                      <strong>
                        {club.minutes ?? 0}
                      </strong>

                      <span>

                        {t(
                          'playerProfile.clubHistory.minutes'
                        )}

                      </span>

                    </div>


                  </div>


                  <div className="club-history-actions">


                    <button
                      type="button"
                      className="club-history-edit-btn"
                      onClick={() =>
                        startEdit(club)
                      }
                    >

                      {t('common.edit')}

                    </button>


                    <button
                      type="button"
                      className="club-history-delete-btn"
                      onClick={() =>
                        handleDelete(club.id)
                      }
                    >

                      {t('common.delete')}

                    </button>


                  </div>


                </div>


              </article>
            )
          )}

        </div>

      )}

    </section>

  );

}