
import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import AuthTabs from '../components/auth/AuthTabs.jsx';

import AccountTypeSelector from '../components/auth/AccountTypeSelector.jsx';

import LoginForm from '../components/auth/LoginForm.jsx';

import RegisterForm from '../components/auth/RegisterForm.jsx';

import LanguageSelector from '../components/common/LanguageSelector.jsx';

export default function AuthPage() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('register');
  const [selectedRole, setSelectedRole] = useState('PLAYER');

  return (
    <div className="auth-page">

      <LanguageSelector />

      <div className="auth-container">

        {/* Left Branding Hero */}
        <div className="hero-section">

          <div className="brand-logo">
            <div className="brand-icon">⚽</div>
            <span>{t('brand')}</span>
          </div>

          <p className="hero-description">
            {t('hero.description')}
          </p>

          <div className="feature-cards">

            <div className="feature-card">
              <h4>{t('hero.featureOneTitle')}</h4>

              <p>
                {t('hero.featureOneText')}
              </p>
            </div>

            <div className="feature-card">
              <h4>{t('hero.featureTwoTitle')}</h4>

              <p>
                {t('hero.featureTwoText')}
              </p>
            </div>

          </div>

        </div>

        {/* Right Auth Card */}
        <div className="auth-card">

          <AuthTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="form-header">

            <h2>
              {activeTab === 'register'
                ? t('account.chooseTitle')
                : t('login.title')}
            </h2>

            <p>
              {activeTab === 'register'
                ? t('account.chooseDescription')
                : t('login.description')}
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

    </div>
  );
}

