import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

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
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed.');
        return;
      }

      // Store logged-in user in AuthContext
      setUser(data.user);

      console.log('Logged in user:', data.user);

      // Redirect based on role
      setUser(data.user);

const routes = {
  PLAYER: '/player',
  SCOUT: '/scout'
};

const destination = routes[data.user.role];

if (!destination) {
  setError('Invalid user role.');
  return;
}

navigate(destination, {
  replace: true
});

    } catch (error) {

      console.error('Login error:', error);

      setError('Unable to connect to the server.');

    } finally {

      setLoading(false);

    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <div className="form-group">
        <label>EMAIL ADDRESS</label>

        <div className="input-wrapper">
          <span className="input-icon">✉</span>

          <input
            type="email"
            placeholder="james@gmail.com"
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
        <label>PASSWORD</label>

        <div className="input-wrapper">
          <span className="input-icon">🔒</span>

          <input
            type="password"
            placeholder="••••••••"
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
        {loading ? 'SIGNING IN...' : 'SIGN IN'}
      </button>

    </form>
  );
}