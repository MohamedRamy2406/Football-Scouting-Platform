import { useTranslation } from 'react-i18next';


function formatDateOfBirth(
  dateOfBirth,
  language
) {

  if (!dateOfBirth) {
    return null;
  }

  const date =
    new Date(dateOfBirth);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date.toLocaleDateString(
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


function calculateAge(
  dateOfBirth
) {

  if (!dateOfBirth) {
    return null;
  }


  const birthDate =
    new Date(dateOfBirth);


  if (
    Number.isNaN(
      birthDate.getTime()
    )
  ) {
    return null;
  }


  const today =
    new Date();


  let age =
    today.getFullYear() -
    birthDate.getFullYear();


  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();


  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() <
        birthDate.getDate()
    )
  ) {

    age--;

  }


  return age;

}


export default function FootballInformation({
  player
}) {

  const { t, i18n } =
    useTranslation();


  const profile =
    player.profile;


  const age =
    calculateAge(
      profile?.dateOfBirth
    );


  const position =
    Array.isArray(
      profile?.positions
    )
      ? profile.positions.join(' / ')
      : profile?.positions;


  const notProvided =
    t('common.notProvided');


  return (

    <section className="profile-card">


      <div className="card-heading">


        <div>

          <span className="section-label">

            <span className="section-dot"></span>

            {t(
              'playerProfile.footballInformation.label'
            )}

          </span>


          <h2>

            {t(
              'playerProfile.footballInformation.title'
            )}

          </h2>

        </div>


      </div>


      <div className="football-info-list">


        <div className="info-row">

          <span>

            {t(
              'playerProfile.footballInformation.primaryPosition'
            )}

          </span>


          <strong>

            {position || notProvided}

          </strong>

        </div>


        <div className="info-row">

          <span>

            {t(
              'playerProfile.footballInformation.preferredFoot'
            )}

          </span>


          <strong>

            {profile?.preferredFoot ||
              notProvided}

          </strong>

        </div>


        <div className="info-row">

          <span>

            {t(
              'playerProfile.footballInformation.age'
            )}

          </span>


          <strong>

            {age !== null

              ? `${age} ${
                  t(
                    'playerProfile.footballInformation.years'
                  )
                }`

              : notProvided}

          </strong>

        </div>


        <div className="info-row">

          <span>

            {t(
              'playerProfile.footballInformation.height'
            )}

          </span>


          <strong>

            {profile?.height

              ? `${profile.height} ${
                  t(
                    'playerProfile.footballInformation.centimeters'
                  )
                }`

              : notProvided}

          </strong>

        </div>


        <div className="info-row">

          <span>

            {t(
              'playerProfile.footballInformation.weight'
            )}

          </span>


          <strong>

            {profile?.weight

              ? `${profile.weight} ${
                  t(
                    'playerProfile.footballInformation.kilograms'
                  )
                }`

              : notProvided}

          </strong>

        </div>


        <div className="info-row">

          <span>

            {t(
              'playerProfile.footballInformation.dateOfBirth'
            )}

          </span>


          <strong>

            {formatDateOfBirth(
              profile?.dateOfBirth,
              i18n.language
            ) || notProvided}

          </strong>

        </div>


        <div className="info-row">

          <span>

            {t(
              'playerProfile.footballInformation.nationality'
            )}

          </span>


          <strong>

            {profile?.nationality ||
              notProvided}

          </strong>

        </div>


        <div className="info-row">

          <span>

            {t(
              'playerProfile.footballInformation.currentClub'
            )}

          </span>


          <strong>

            {profile?.currentClub?.trim()

              ? profile.currentClub

              : t(
                  'playerProfile.header.noCurrentClub'
                )}

          </strong>

        </div>


      </div>


    </section>

  );

}