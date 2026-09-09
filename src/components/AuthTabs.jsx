export default function AuthTabs({ activeTab, setActiveTab }) {
  return (
    <div className="auth-tabs">
      <button
        className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
        onClick={() => setActiveTab('login')}
      >
        LOGIN
      </button>
      <button
        className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
        onClick={() => setActiveTab('register')}
      >
        REGISTER
      </button>
    </div>
  );
}