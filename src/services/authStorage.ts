const STORAGE_KEY = 'mt_app_wechat_authenticated';

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

const remove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Local storage may be unavailable in restricted browser contexts.
  }
};

export const authStorage = {
  readIsAuthenticated: () => read(STORAGE_KEY) === 'true',

  saveIsAuthenticated: (isAuthenticated: boolean) => {
    if (isAuthenticated) {
      write(STORAGE_KEY, 'true');
      return;
    }

    remove(STORAGE_KEY);
  },

  clear: () => remove(STORAGE_KEY),
};
