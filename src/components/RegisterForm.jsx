import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterForm({ role }) {

  const navigate = useNavigate();
  const { setUser } = useAuth();

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

      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          credentials: 'include',

          body: JSON.stringify({
            ...formData,
            role
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        setError(
          data.message || 'Registration failed.'
        );

        return;

      }


      console.log('Registered user:', data.user);


      // Update React authentication state
      setUser(data.user);


      // Redirect based on role
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

      console.error(
        'Registration error:',
        error
      );

      setError(
        'Unable to connect to the server.'
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <form onSubmit={handleSubmit}>

      {error && (
        <div
          className="error-message"
        >
          {error}
        </div>
      )}


      <div
        style={{
          display: 'flex',
          gap: '0.75rem'
        }}
      >

        <div
          className="form-group"
          style={{ flex: 1 }}
        >

          <label>FIRST NAME</label>

          <div className="input-wrapper">

            <input
              type="text"
              placeholder="Mohamed"
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


        <div
          className="form-group"
          style={{ flex: 1 }}
        >

          <label>LAST NAME</label>

          <div className="input-wrapper">

            <input
              type="text"
              placeholder="Ahmed"
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

        <label>EMAIL ADDRESS</label>

        <div className="input-wrapper">

          <span className="input-icon">
            ✉
          </span>

          <input
            type="email"
            placeholder="mohamed@email.com"
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

          <span className="input-icon">
            🔒
          </span>

          <input
            type="password"
            placeholder="•••••••••"
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
          Minimum 9 characters, including an uppercase
          letter, lowercase letter, and number.
        </small>

      </div>


      <button
        type="submit"
        className="submit-btn"
        disabled={loading}
      >

        {loading
          ? 'CREATING...'
          : 'CREATE ACCOUNT'}

      </button>

    </form>

  );

}