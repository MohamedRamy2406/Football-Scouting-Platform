import { useState } from 'react';

import {
  createPlayerAchievement,
  updatePlayerAchievement,
  deletePlayerAchievement
} from '../../api/playerApi.js';

import { useTranslation } from 'react-i18next';


function formatAchievementDate(
  date,
  language
) {

  if (!date) {
    return null;
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return null;
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


export default function Achievements({
  achievements = [],
  onAchievementsChanged
}) {

  const { t, i18n } =
    useTranslation();


  const [editingAchievement,
    setEditingAchievement] =
    useState(null);

  const [showForm,
    setShowForm] =
    useState(false);

  const [title,
    setTitle] =
    useState('');

  const [description,
    setDescription] =
    useState('');

  const [achievementDate,
    setAchievementDate] =
    useState('');

  const [saving,
    setSaving] =
    useState(false);

  const [error,
    setError] =
    useState('');


  function resetForm() {

    setTitle('');
    setDescription('');
    setAchievementDate('');

    setEditingAchievement(null);
    setShowForm(false);
    setError('');

  }


  function startEdit(achievement) {

    setEditingAchievement(
      achievement
    );

    setTitle(
      achievement.title || ''
    );

    setDescription(
      achievement.description || ''
    );

    setAchievementDate(
      achievement.achievement_date
        ? String(
            achievement.achievement_date
          ).slice(0, 10)
        : ''
    );

    setShowForm(true);
    setError('');

  }


  async function handleSubmit(event) {

    event.preventDefault();


    if (!title.trim()) {

      setError(
        t(
          'playerProfile.achievements.requiredTitle'
        )
      );

      return;
    }


    try {

      setSaving(true);
      setError('');


      const achievementData = {

        title:
          title.trim(),

        description:
          description.trim(),

        achievementDate:
          achievementDate || null

      };


      let response;
      let data;


      if (editingAchievement) {

        ({
          response,
          data
        } =
          await updatePlayerAchievement(
            editingAchievement.id,
            achievementData
          ));

      } else {

        ({
          response,
          data
        } =
          await createPlayerAchievement(
            achievementData
          ));

      }


      if (!response.ok) {

        setError(
          data.message ||
          t(
            'playerProfile.achievements.saveError'
          )
        );

        return;
      }


      resetForm();


      if (onAchievementsChanged) {

        await onAchievementsChanged();

      }

    } catch (err) {

      console.error(
        'Achievement save error:',
        err
      );

      setError(
        t(
          'playerProfile.achievements.connectionError'
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
          'playerProfile.achievements.deleteConfirm'
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
        await deletePlayerAchievement(id);


      if (!response.ok) {

        setError(
          data.message ||
          t(
            'playerProfile.achievements.deleteError'
          )
        );

        return;
      }


      if (
        editingAchievement?.id === id
      ) {

        resetForm();

      }


      if (onAchievementsChanged) {

        await onAchievementsChanged();

      }

    } catch (err) {

      console.error(
        'Achievement delete error:',
        err
      );

      setError(
        t(
          'playerProfile.achievements.connectionError'
        )
      );

    }

  }


  return (

    <section className="achievements-section">


      <div
        className="card-heading"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >

        <div>

          <span className="section-label">

            <span className="section-dot"></span>

            {t(
              'playerProfile.achievements.label'
            )}

          </span>


          <h2>

            {t(
              'playerProfile.achievements.title'
            )}

          </h2>

        </div>


        <button
          type="button"
          className="add-achievement-btn"
          onClick={() => {

            resetForm();
            setShowForm(true);

          }}
        >

          + {t(
            'playerProfile.achievements.add'
          )}

        </button>


      </div>


      {showForm && (

        <form
          className="achievement-form"
          onSubmit={handleSubmit}
        >

          <h3>

            {editingAchievement
              ? t(
                  'playerProfile.achievements.editTitle'
                )
              : t(
                  'playerProfile.achievements.addTitle'
                )}

          </h3>


          <div className="achievement-form-group">

            <label>

              {t(
                'playerProfile.achievements.titleLabel'
              )}

            </label>


            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder={t(
                'playerProfile.achievements.titlePlaceholder'
              )}
              maxLength={50}
            />


            <span className="achievement-character-count">

              {title.length} / 50

            </span>

          </div>


          <div className="achievement-form-group">

            <label>

              {t(
                'playerProfile.achievements.descriptionLabel'
              )}

            </label>


            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder={t(
                'playerProfile.achievements.descriptionPlaceholder'
              )}
              maxLength={200}
            />


            <span className="achievement-character-count">

              {description.length} / 200

            </span>

          </div>


          <div className="achievement-form-group">

            <label>

              {t(
                'playerProfile.achievements.dateLabel'
              )}

            </label>


            <input
              type="date"
              value={achievementDate}
              onChange={(e) =>
                setAchievementDate(
                  e.target.value
                )
              }
            />

          </div>


          {error && (

            <div className="achievement-form-error">

              {error}

            </div>

          )}


          <div className="achievement-form-actions">


            <button
              type="submit"
              disabled={saving}
            >

              {saving

                ? t('common.saving')

                : editingAchievement

                ? t('common.saveChanges')

                : t(
                    'playerProfile.achievements.addTitle'
                  )}

            </button>


            <button
              type="button"
              onClick={resetForm}
            >

              {t('common.cancel')}

            </button>


          </div>


        </form>

      )}


      {achievements.length === 0 ? (

        <div className="achievements-empty">

          <p>

            {t(
              'playerProfile.achievements.noAchievements'
            )}

          </p>

        </div>

      ) : (

        <div className="achievements-list">

          {achievements.map(
            (achievement) => (

              <article
                key={achievement.id}
                className="achievement-item"
              >

                <span className="achievement-date">

                  {formatAchievementDate(
                    achievement.achievement_date,
                    i18n.language
                  ) ||
                    t(
                      'playerProfile.achievements.dateLabel'
                    )}

                </span>


                <h3>
                  {achievement.title}
                </h3>


                {achievement.description && (

                  <p>
                    {achievement.description}
                  </p>

                )}


                <div className="achievement-actions">


                  <button
                    type="button"
                    onClick={() =>
                      startEdit(
                        achievement
                      )
                    }
                  >

                    {t('common.edit')}

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        achievement.id
                      )
                    }
                  >

                    {t('common.delete')}

                  </button>


                </div>

              </article>

            )
          )}

        </div>

      )}

    </section>

  );

}