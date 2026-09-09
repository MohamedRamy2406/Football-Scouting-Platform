import { useState } from 'react';
import AuthTabs from '../components/AuthTabs';
import AccountTypeSelector from '../components/AccountTypeSelector';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('register');
  const [selectedRole, setSelectedRole] = useState('PLAYER');
  return (
    <div className="auth-container">
      {/* Left Branding Hero */}
      <div className="hero-section">
        <div className="brand-logo">
          <div className="brand-icon">⚽</div>
          <span>PATH2PRO</span>
        </div>
        <p className="hero-description">
Built for the next generation of Egyptian ballers. Showcase your skills, track your stats, and connect directly with top clubs and scouts.        </p>

        <div className="feature-cards">
          <div className="feature-card">
            <h4>Let Your Game Talk</h4>
            <p>Share your best match moments, highlight your skills, and show scouts exactly what you bring to the pitch.</p>
          </div>
          <div className="feature-card">
            <h4>Real Trial Offers</h4>
            <p>Receive official trial invitations directly on your dashboard from verified scouts—no middlemen, no fake promises.</p>
          </div>
        </div>
      </div>

      {/* Right Auth Card */}
      <div className="auth-card">
        <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="form-header">
          <h2>{activeTab === 'register' ? 'Choose Account Type' : 'Welcome Back'}</h2>
          <p>
            {activeTab === 'register'
              ? 'Select your primary role on the platform to get started.'
              : 'Enter your email and password to access your account.'}
          </p>
        </div>

        {activeTab === 'register' && (
          <AccountTypeSelector
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        )}

        {activeTab === 'login' ? (
          <LoginForm />
        ) : (
          <RegisterForm role={selectedRole} />
        )}
      </div>
    </div>
  );
}