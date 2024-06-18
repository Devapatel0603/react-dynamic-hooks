import { useState, useEffect } from "react";

const getCookie = (name) => {
    const cookies = document.cookie;
    const cookieParts = cookies.split(";");

    for (const part of cookieParts) {
        const cookie = part.trim();
        if (cookie.startsWith(`${name}=`)) {
            const value = cookie.substring(name.length + 1);
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
    }
    return null;
};

const setCookie = (name, value, options = {}) => {
    if (typeof value === "object") {
        value = JSON.stringify(value);
    }
    let cookieString = `${name}=${value}`;

    if (options.expires) {
        const expirationDate = new Date();
        expirationDate.setTime(
            expirationDate.getTime() + options.expires * 1000
        );
        cookieString += `; expires=${expirationDate.toUTCString()}`;
    }

    if (options.path) {
        cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
        cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
        cookieString += `; secure`;
    }

    if (options.httpOnly) {
        cookieString += `; httpOnly`;
    }

    if (options.maxAge) {
        cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.sameSite) {
        const validSameSiteValues = ["Strict", "Lax", "None"];
        if (validSameSiteValues.includes(options.sameSite)) {
            cookieString += `; SameSite=${options.sameSite}`;
        } else {
            console.warn(
                `Invalid SameSite value: ${options.sameSite}. Using default (Lax)`
            );
            cookieString += `; SameSite=Lax`;
        }
    }

    document.cookie = cookieString;
};

const useCookieState = (key, defaultValue = null, options = {}) => {
    if (!key) {
        throw new Error("Key is required");
    }

    const [state, setState] = useState(() => {
        const value = getCookie(key);
        if (!value) {
            if (!options.skipCreation) {
                const { skipCreation, ...newOptions } = options;
                setCookie(key, defaultValue, newOptions);
            }
        }
        return value ?? defaultValue;
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newValue = getCookie(key);
            if (newValue !== state) {
                setState(newValue);
            }
        }, 700);

        return () => clearInterval(intervalId);
    }, [key, state]);

    return state;
};

export { useCookieState, setCookie, getCookie };
