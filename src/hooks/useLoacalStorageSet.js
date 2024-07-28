import { useCallback, useState, useEffect } from "react";

export function useLocalStorageState(key, defaultValue) {
    return useStorage(key, defaultValue, window.localStorage);
}

export function useSessionStorageState(key, defaultValue) {
    return useStorage(key, defaultValue, window.sessionStorage);
}

function useStorage(key, defaultValue, storageObject) {
    const [value, setValue] = useState(() => {
        const jsonValue = storageObject.getItem(key);
        if (jsonValue != null) {
            try {
                return JSON.parse(jsonValue);
            } catch (error) {
                return jsonValue;
            }
        }

        if (typeof defaultValue === "function") {
            return defaultValue();
        } else {
            return defaultValue;
        }
    });

    useEffect(() => {
        if (value === undefined) {
            return storageObject.removeItem(key);
        }
        if (typeof value === "object") {
            storageObject.setItem(key, JSON.stringify(value));
        } else {
            storageObject.setItem(key, value);
        }
    }, [key, value, storageObject]);

    return [value, setValue];
}
