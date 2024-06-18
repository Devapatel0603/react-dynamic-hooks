import { useState, useEffect } from "react";

const useLocalStorageState = (key, defaultValue = null) => {
    if (!key) {
        throw new Error("Key is required");
    }

    const [state, setState] = useState(() => {
        const value = localStorage.getItem(key);
        if (!value) {
            if (typeof defaultValue === "object") {
                defaultValue = JSON.stringify(value);
            }
            localStorage.setItem(key, defaultValue);
        }
        try {
            return JSON.parse(value) || defaultValue;
        } catch (error) {
            return defaultValue;
        }
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newValue = localStorage.getItem(key);
            if (newValue !== state) {
                setState(newValue);
            }
        }, 700);

        return () => clearInterval(intervalId);
    }, [state]);

    return state;
};

export { useLocalStorageState };
