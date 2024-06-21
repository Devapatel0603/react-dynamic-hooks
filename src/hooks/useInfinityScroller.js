import { useEffect, useState, useCallback, useRef } from "react";

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

export { useInfinityScroller };
