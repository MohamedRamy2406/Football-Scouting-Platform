import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import API_BASE_URL from '../api/client.js';
import { loginUser } from '../api/authApi.js';

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const { response, data } = await loginUser(formData);

      if (!response.ok) {
        setError(
          data.message || t('login.failed')
        );
        return;
      }

      setUser(data.user);

      console.log('Logged in user:', data.user);

      const routes = {
        PLAYER: '/player',
        SCOUT: '/scout'
      };

      const destination = routes[data.user.role];

      if (!destination) {
        setError(t('login.invalidRole'));
        return;
      }

      navigate(destination, {
        replace: true
      });

    } catch (error) {

      console.error('Login error:', error);

      setError(
        t('errors.serverConnection')
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <div className="form-group">

        <label>
          {t('login.email')}
        </label>

        <div className="input-wrapper">

          <span className="input-icon">
            ✉
          </span>

          <input
            type="email"
            placeholder={t('login.emailPlaceholder')}
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
          {t('login.password')}
        </label>

        <div className="input-wrapper">

          <span className="input-icon">
            🔒
          </span>

          <input
            type="password"
            placeholder={t('login.passwordPlaceholder')}
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value
              })
            }
            required
          />

        </div>

      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="submit-btn"
        disabled={loading}
      >
        {loading
          ? t('login.signingIn')
          : t('login.signIn')}
      </button>

    </form>
  );
}

