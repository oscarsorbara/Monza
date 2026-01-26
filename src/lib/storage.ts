export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Session storage read error', e);
            return defaultValue;
        }
    },
    set: <T>(key: string, value: T): void => {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Session storage write error', e);
        }
    },
    remove: (key: string): void => {
        window.sessionStorage.removeItem(key);
    }
};
