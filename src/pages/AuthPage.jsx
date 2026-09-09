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
          The elite network for professional football scouting. Connect with talent, manage contracts, and analyze performance data in real-time.
        </p>

        <div className="feature-cards">
          <div className="feature-card">
            <h4>Advanced Analytics</h4>
            <p>Deep-dive into player metrics with our proprietary heatmaps and tactical scoring system.</p>
          </div>
          <div className="feature-card">
            <h4>Secure Contracts</h4>
            <p>End-to-end encrypted negotiation tools designed specifically for agents and club directors.</p>
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
              ? 'Select your primary role on the platform to customize your dashboard.'
              : 'Enter your credentials to access your account.'}
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