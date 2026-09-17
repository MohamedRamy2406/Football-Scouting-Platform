import { useTranslation } from 'react-i18next';

export default function AuthTabs({
  activeTab,
  setActiveTab
}) {
  const { t } = useTranslation();

  return (
    <div className="auth-tabs">

      <button
        type="button"
        className={`tab-btn ${
          activeTab === 'login' ? 'active' : ''
        }`}
        onClick={() => setActiveTab('login')}
      >
        {t('tabs.login')}
      </button>

      <button
        type="button"
        className={`tab-btn ${
          activeTab === 'register' ? 'active' : ''
        }`}
        onClick={() => setActiveTab('register')}
      >
        {t('tabs.register')}
      </button>

    </div>
  );
}

