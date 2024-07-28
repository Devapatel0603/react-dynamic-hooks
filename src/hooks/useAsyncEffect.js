import { useEffect } from "react";

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

export { useAsyncEffect };
