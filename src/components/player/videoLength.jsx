import { useTranslation } from 'react-i18next';


export default function ProfileCompletion({
  player
}) {

  const { t } =
    useTranslation();


  const percentage =
    player.profileCompletionPercentage;


  const completed =
    player.completedRequiredFields;


  const total =
    player.totalRequiredFields;


  return (

    <section className="profile-completion-card">


      <div className="completion-title-row">


        <div>


          <div className="section-label">

            <span className="section-dot"></span>

            {t(
              'playerProfile.completion.title'
            )}

          </div>


          <p>

            {t(
              'playerProfile.completion.description'
            )}

          </p>


        </div>


        <div className="completion-number">

          <strong>
            {percentage}%
          </strong>


          <span>

            {t(
              'playerProfile.completion.complete',
              {
                completed,
                total
              }
            )}

          </span>

        </div>


      </div>


      <div className="large-progress">

        <div
          className="large-progress-bar"
          style={{
            width:
              `${percentage}%`
          }}
        />

      </div>


      <div className="completion-footer">

        <span>

          {player.profileCompleted

            ? t(
                'playerProfile.completion.profileComplete'
              )

            : t(
                'playerProfile.completion.remaining',
                {
                  count:
                    total - completed
                }
              )}

        </span>

      </div>


    </section>

  );

}