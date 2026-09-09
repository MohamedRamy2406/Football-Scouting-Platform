export default function AccountTypeSelector({ selectedRole, setSelectedRole }) {
  const roles = [
    { id: 'PLAYER', label: 'Player', icon: '⚽' },
    { id: 'SCOUT', label: 'Scout', icon: '👁️' },
  ];

  return (
    <div className="account-selector" style={{ gridTemplateColumns: '1fr 1fr' }}>
      {roles.map((role) => (
        <button
          key={role.id}
          type="button"
          className={`role-btn ${selectedRole === role.id ? 'selected' : ''}`}
          onClick={() => setSelectedRole(role.id)}
        >
          <span>{role.icon}</span>
          <span>{role.label}</span>
        </button>
      ))}
    </div>
  );
}