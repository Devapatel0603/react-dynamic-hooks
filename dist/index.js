import { useState, useEffect, useCallback } from 'react';

const useInfinityScroller = (
    scrollContainerRef,
    setData,
    fetchData,
    page,
    setPage,
    loadTriggerOffset = 50
) => {
    if (!scrollContainerRef) {
        throw new Error(
            "useInfinityScroller : Container reference is required"
        );
    }
    if (!fetchData) {
        throw new Error(
            "useInfinityScroller : function is required to set fetchData"
        );
    }
    if (!page) {
        throw new Error("useInfinityScroller : page is required");
    }
    if (!setPage) {
        throw new Error(
            "useInfinityScroller : setPage function is required to set page"
        );
    }
    if (!setData) {
        throw new Error(
            "useInfinityScroller : function is required to set data"
        );
    }
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    useEffect(() => {
        setIsLoading(true);
    }, []);

    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container || isLoading) {
            setIsLoading(false);
            return;
        }
        if (!hasMore) {
            setIsLoading(false);
            return;
        }
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isNearBottom =
            scrollTop + clientHeight + loadTriggerOffset >= scrollHeight;

        if (isNearBottom && hasMore) {
            setIsLoading(true);
        }
    }, [scrollContainerRef, hasMore]);

    useEffect(() => {
        const currentContainer = scrollContainerRef.current;
        if (currentContainer) {
            currentContainer.addEventListener("scroll", handleScroll);

            return () => {
                currentContainer.removeEventListener("scroll", handleScroll);
            };
        }
    }, [handleScroll, scrollContainerRef]);

    useEffect(() => {
        const loadMore = async () => {
            try {
                const newItems = await fetchData(page);
                if (newItems.length === 0) {
                    setIsLoading(false);
                    setHasMore(false);
                } else {
                    setData((prevData) => [...prevData, ...newItems]);
                    scrollContainerRef.current.scrollTop =
                        scrollContainerRef.current.scrollTop;
                    setPage((prevPage) => prevPage + 1);
                }
            } catch (error) {
                console.error("Error loading more data:", error);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoading && hasMore) {
            loadMore();
        }
    }, [isLoading, fetchData, page, setData, setPage, hasMore]);

    return { isLoading, hasMore };
};

const useAsyncEffect = (effect, deps = []) => {
    if (typeof effect !== "function") {
        throw new Error("useAsyncEffect: effect must be a function");
    }

    useEffect(() => {
        const executeEffect = async () => {
            try {
                await effect();
            } catch (error) {
                console.error("Error in useAsyncEffect:", error);
            }
        };

        executeEffect();
        return undefined;
    }, deps);
};

const useCopyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error("Failed to copy text:", err);
        return false;
    }
};

const useGeolocation = (options = {}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [data, setData] = useState({});

    useEffect(() => {
        const successHandler = (position) => {
            setLoading(false);
            setError(null);
            setData(position.coords);
        };
        const errorHandler = (error) => {
            setLoading(false);
            setError(error);
        };
        navigator.geolocation.getCurrentPosition(
            successHandler,
            errorHandler,
            options
        );
        const id = navigator.geolocation.watchPosition(
            successHandler,
            errorHandler,
            options
        );
        return () => navigator.geolocation.clearWatch(id);
    }, [options]);

    return { loading, error, data };
};

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

    const updateState = (newValue, options = {}) => {
        setCookie(key, newValue, options);
        setState(newValue);
    };

    return [state, updateState];
};

function useLocalStorageState(key, defaultValue) {
    return useStorage(key, defaultValue, window.localStorage);
}

function useSessionStorageState(key, defaultValue) {
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

export { getCookie, setCookie, useAsyncEffect, useCookieState, useCopyToClipboard, useGeolocation, useInfinityScroller, useLocalStorageState, useSessionStorageState };
