import { useTranslation } from 'react-i18next';

export default function AccountTypeSelector({
  selectedRole,
  setSelectedRole
}) {
  const { t } = useTranslation();

  const roles = [
    {
      id: 'PLAYER',
      label: t('account.player'),
      icon: '⚽'
    },
    {
      id: 'SCOUT',
      label: t('account.scout'),
      icon: '👁️'
    }
  ];

  return (
    <div className="account-selector">

      {roles.map((role) => (
        <button
          key={role.id}
          type="button"
          className={`role-btn ${
            selectedRole === role.id
              ? 'selected'
              : ''
          }`}
          onClick={() => setSelectedRole(role.id)}
        >
          <span>{role.icon}</span>
          <span>{role.label}</span>
        </button>
      ))}

    </div>
  );
}

