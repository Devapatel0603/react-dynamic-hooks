import { useEffect } from "react";

const useAsyncEffect = (effect, deps = []) => {
    if (!effect) {
        throw new Error("useAsyncEffect: function is required");
    }
    useEffect(() => {
        (async () => {
            try {
                await effect();
            } catch (error) {
                console.error(error);
            }
        })();
    }, deps);
};

export { useAsyncEffect };
