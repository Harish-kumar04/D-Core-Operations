// Password service for 14-day forced rotation cycle and credential management

const PASSWORDS_STORAGE_KEY = 'dcore_admin_passwords';
const ROTATION_DAYS = 14;
const ROTATION_MS = ROTATION_DAYS * 24 * 60 * 60 * 1000; // 14 days in milliseconds

const DEFAULT_PASSWORDS = {
  ADMIN: 'dcore2026',
  LEAD: 'lead2026',
  OPERATOR: 'op2026',
  lastChanged: new Date().toISOString()
};

/**
 * Helper to get password state from localStorage (or seed default if none exists)
 */
export const getStoredPasswords = () => {
  try {
    const raw = localStorage.getItem(PASSWORDS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(DEFAULT_PASSWORDS));
      return DEFAULT_PASSWORDS;
    }
    const data = JSON.parse(raw);
    if (!data.lastChanged) {
      data.lastChanged = new Date().toISOString();
      localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(data));
    }
    return data;
  } catch (e) {
    console.error('Failed to read passwords from localStorage:', e);
    return DEFAULT_PASSWORDS;
  }
};

/**
 * Verify passcode against any of the valid role credentials (or a specific role)
 */
export const verifyAdminPasscode = (inputCode, role = null) => {
  const passwords = getStoredPasswords();
  if (role && passwords[role]) {
    return inputCode === passwords[role];
  }
  // Check against any role
  return (
    inputCode === passwords.ADMIN ||
    inputCode === passwords.LEAD ||
    inputCode === passwords.OPERATOR ||
    inputCode === 'dcore2026' // fallback emergency passcode
  );
};

/**
 * Get role for a matching passcode
 */
export const getRoleForPasscode = (inputCode) => {
  const passwords = getStoredPasswords();
  if (inputCode === passwords.ADMIN || inputCode === 'dcore2026') return 'ADMIN';
  if (inputCode === passwords.LEAD) return 'LEAD';
  if (inputCode === passwords.OPERATOR) return 'OPERATOR';
  return 'GUEST';
};

/**
 * Change password for a specific profile role
 */
export const changeAdminPassword = (role, oldPassword, newPassword) => {
  if (!newPassword || newPassword.trim().length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  const passwords = getStoredPasswords();

  // Validate old password
  if (oldPassword !== passwords[role] && oldPassword !== 'dcore2026') {
    return { success: false, error: 'Current password is incorrect.' };
  }

  // Update password and reset 14-day timer
  passwords[role] = newPassword.trim();
  passwords.lastChanged = new Date().toISOString();

  try {
    localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(passwords));
    return { success: true, message: `Password for ${role} updated successfully! Next rotation in 14 days.` };
  } catch (e) {
    console.error('Failed to update password:', e);
    return { success: false, error: 'Failed to save updated password.' };
  }
};

/**
 * Get expiration and rotation timing information
 */
export const getPasswordExpiryInfo = () => {
  const passwords = getStoredPasswords();
  const lastChangedMs = new Date(passwords.lastChanged).getTime() || Date.now();
  const nowMs = Date.now();
  const elapsedMs = nowMs - lastChangedMs;
  const remainingMs = ROTATION_MS - elapsedMs;

  const daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
  const isExpired = elapsedMs >= ROTATION_MS;
  const isExpiringSoon = !isExpired && daysRemaining <= 1; // 1 day remaining (last day)

  const lastChangedDate = new Date(lastChangedMs).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const nextDueDate = new Date(lastChangedMs + ROTATION_MS).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return {
    daysRemaining,
    isExpired,
    isExpiringSoon,
    lastChangedDate,
    nextDueDate,
    rotationPeriodDays: ROTATION_DAYS
  };
};
