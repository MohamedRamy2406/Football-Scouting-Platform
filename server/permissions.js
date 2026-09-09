// ============================================
// PATH2PRO ROLE PERMISSIONS
// ============================================
//
// This file defines what each role is allowed
// to do inside the application.
//
// PLAYER
// SCOUT
// ADMIN
//
// The permissions here are based on the
// Path2Pro permission matrix.
// ============================================


const ROLE_PERMISSIONS = {

  // ==========================================
  // PLAYER
  // ==========================================

  PLAYER: [
    'VIEW_PLAYERS',
    'EDIT_OWN_PROFILE',
    'UPLOAD_VIDEO',
    'DELETE_OWN_ACCOUNT'
  ],


  // ==========================================
  // SCOUT
  // ==========================================

  SCOUT: [
    'VIEW_PLAYERS',
    'EDIT_OWN_PROFILE',
    'CREATE_SCOUTING_REPORT',
    'CREATE_TRIAL',
    'VIEW_PRIVATE_PLAYER_INFORMATION',
    'DELETE_OWN_ACCOUNT'
  ],


  // ==========================================
  // ADMIN
  // ==========================================

  ADMIN: [
    'VIEW_PLAYERS',
    'EDIT_OWN_PROFILE',
    'CREATE_SCOUTING_REPORT',
    'CREATE_TRIAL',
    'VIEW_PRIVATE_PLAYER_INFORMATION',
    'DELETE_OWN_ACCOUNT',
    'BAN_USER',
    'DELETE_ANOTHER_USER',
    'MANAGE_USERS'
  ]

};


// ============================================
// CHECK WHETHER A ROLE HAS A PERMISSION
// ============================================

export function hasPermission(role, permission) {

  const permissions = ROLE_PERMISSIONS[role];

  // Role does not exist
  if (!permissions) {
    return false;
  }

  return permissions.includes(permission);
}


// ============================================
// EXPORT ALL ROLE PERMISSIONS
// ============================================

export default ROLE_PERMISSIONS;

