import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';
import API_BASE_URL from '../../api/client.js';
import { registerUser } from '../../api/authApi.js';

export default function RegisterForm({ role }) {

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      const { response, data } = await registerUser({
  ...formData,
  role
});

      if (!response.ok) {

        setError(
          data.message || t('register.failed')
        );

        return;
      }

      console.log(
        'Registered user:',
        data.user
      );

      setUser(data.user);

      const routes = {
        PLAYER: '/player',
        SCOUT: '/scout'
      };

      const destination =
        routes[data.user.role];

      if (!destination) {

        setError(
          t('register.invalidRole')
        );

        return;
      }

      navigate(destination, {
        replace: true
      });

    } catch (error) {

      console.error(
        'Registration error:',
        error
      );

      setError(
        t('errors.serverConnection')
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <form onSubmit={handleSubmit}>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="name-fields">

        <div className="form-group">

          <label>
            {t('register.firstName')}
          </label>

          <div className="input-wrapper">

            <input
              type="text"
              placeholder={t(
                'register.firstNamePlaceholder'
              )}
              value={formData.firstName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  firstName: e.target.value
                })
              }
              required
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            {t('register.lastName')}
          </label>

          <div className="input-wrapper">

            <input
              type="text"
              placeholder={t(
                'register.lastNamePlaceholder'
              )}
              value={formData.lastName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName: e.target.value
                })
              }
              required
            />

          </div>

        </div>

      </div>

      <div className="form-group">

        <label>
          {t('register.email')}
        </label>

        <div className="input-wrapper">

          <span className="input-icon">
            ✉
          </span>

          <input
            type="email"
            placeholder={t(
              'register.emailPlaceholder'
            )}
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value
              })
            }
            required
          />

        </div>

      </div>

      <div className="form-group">

        <label>
          {t('register.password')}
        </label>

        <div className="input-wrapper">

          <span className="input-icon">
            🔒
          </span>

          <input
            type="password"
            placeholder={t(
              'register.passwordPlaceholder'
            )}
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value
              })
            }
            required
            minLength={9}
          />

        </div>

        <small>
          {t('register.passwordRequirements')}
        </small>

      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={loading}
      >
        {loading
          ? t('register.creating')
          : t('register.createAccount')}
      </button>

    </form>

  );
}

