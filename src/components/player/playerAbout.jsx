import { useTranslation } from 'react-i18next';


export default function PlayerAbout({
  player
}) {

  const { t } =
    useTranslation();


  const bio =
    player?.profile?.bio;


  return (

    <section className="profile-card player-about-card">


      <div className="card-heading">


        <div>

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


      </div>


      <div className="player-about-content">


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


    </section>

  );

}