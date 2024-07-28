import { useEffect, useState } from "react";

const useSessionStorageState = (key, defaultValue) => {
    if (!key || !defaultValue) {
        throw new Error("Key and default value are required");
    }
    const [error, setError] = useState(null);

    const [state, setState] = useState(() => {
        const value = sessionStorage.getItem(key);
        if (!value) {
            sessionStorage.setItem(key, defaultValue);
        }
        try {
            return JSON.parse(value) || defaultValue;
        } catch (error) {
            return defaultValue;
        }
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newValue = sessionStorage.getItem(key);
            if (newValue !== state) {
                setState(newValue);
            }
        }, 700);

        return () => clearInterval(intervalId);
    }, [state]);

    return state;
};
