const STORAGE_KEY = 'mt_app_wechat_authenticated_v3';
const VIEW_KEY = 'mt_app_active_view_v3';

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Local storage may be unavailable in restricted browser contexts.
  }
};

export const authStorage = {
  // Always start from the QR login screen on app boot.
  readIsAuthenticated: () => false,

  saveIsAuthenticated: (isAuthenticated: boolean) => {
    write(STORAGE_KEY, isAuthenticated ? 'true' : 'false');
  },

  readActiveView: (): 'portal' | 'operation' => {
    const val = read(VIEW_KEY);
    return val === 'operation' ? 'operation' : 'portal';
  },

  saveActiveView: (view: 'portal' | 'operation') => {
    write(VIEW_KEY, view);
  },

  clear: () => {
    write(STORAGE_KEY, 'false');
    write(VIEW_KEY, 'portal');
  },
};
