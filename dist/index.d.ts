/**
 * A custom hook that runs an async function only when dependencies change.
 * 
 * @param effect An async function to be executed.
 * @param deps An array of dependencies that trigger the effect when changed. Defaults to an empty array.
 */
declare function useAsyncEffect<T>(
  effect: () => Promise<T>,
  deps?: Readonly<ReadonlyArray<unknown>> // readonly for immutability check
): void;

export { useAsyncEffect };

/**
 * Gets a cookie value by its name from the browser.
 * 
 * @param name The name of the cookie to retrieve.
 * @returns The value of the cookie as a string, or null if not found.
 */
declare function getCookie(name: string): string | null;

/**
 * Sets a cookie with a given name, value, and optional options.
 * 
 * @param name The name of the cookie to set.
 * @param value The value to store in the cookie.
 * @param options An optional object to customize cookie behavior:
 *  - expires: A number (in milliseconds) representing the expiration time.
 *  - path: A string specifying the path for which the cookie is valid. 
 *  - domain: A string specifying the domain for which the cookie is valid.
 *  - secure: A boolean indicating if the cookie should only be transmitted over HTTPS connections.
 *  - httpOnly: A boolean indicating if the cookie should only be accessible by server-side scripts.
 *  - maxAge: A number (in seconds) representing the maximum age of the cookie.
 *  - sameSite: A string specifying the SameSite attribute value. Valid values are "Strict", "Lax", and "None". Defaults to "Lax".
 */
declare function setCookie(name: string, value: any, options?: { 
  expires?: number, 
  path?: string, 
  domain?: string, 
  secure?: boolean, 
  httpOnly?: boolean, 
  maxAge?: number, 
  sameSite?: "Strict" | "Lax" | "None" 
}): void;

/**
 * Gets a cookie value by its name from the browser's document.cookie.
 * 
 * @param name The name of the cookie to retrieve.
 * @returns The value of the cookie as a string, or null if not found.
 */
declare function getCookie(name: string): string | null;

/**
 * Sets a cookie with a given name, value, and optional options.
 * 
 * @param name The name of the cookie to set.
 * @param value The value to store in the cookie.
 * @param options An optional object to customize cookie behavior:
 *  - expires: A number (in milliseconds) representing the expiration time.
 *  - path: A string specifying the path for which the cookie is valid. 
 *  - domain: A string specifying the domain for which the cookie is valid.
 *  - secure: A boolean indicating if the cookie should only be transmitted over HTTPS connections.
 *  - httpOnly: A boolean indicating if the cookie should only be accessible by server-side scripts.
 *  - maxAge: A number (in seconds) representing the maximum age of the cookie.
 *  - sameSite: A string specifying the SameSite attribute value. Valid values are "Strict", "Lax", and "None". Defaults to "Lax".
 */
declare function setCookie(name: string, value: any, options?: { 
  expires?: number, 
  path?: string, 
  domain?: string, 
  secure?: boolean, 
  httpOnly?: boolean, 
  maxAge?: number, 
  sameSite?: "Strict" | "Lax" | "None" 
}): void;

/**
 * A custom React hook that manages state based on a cookie value.
 * 
 * @param key The key (name) of the cookie to manage.
 * @param defaultValue (Optional)(Default : null)The default value to use if the cookie doesn't exist.
 * @param options An optional object to customize behavior:
 *  - skipCreation: A boolean indicating if creating a cookie with the default value should be skipped on initial render. Defaults to false.
 *  - (other options): Any other options to create cookie.
 * @returns The current value of the state based on the cookie.
 */
declare function useCookieState<T>(key: string, defaultValue: T, options?: { skipCreation?: boolean, [key: string]: any }): T;

export { useCookieState, setCookie, getCookie };

/**
 * useInfinityScroller - A custom React hook for implementing infinite scrolling.
 * @param scrollContainerRef - A ref object pointing to the scrollable container element.
 * @param setData - A function to update the data state with new data.
 * @param fetchData - An async function that fetches data. It should accept a page number and return a promise that resolves to an array of new items.
 * @param page - The current page number used for fetching data.
 * @param setPage - A function to update the page state.
 * @param loadTriggerOffset - An optional offset in pixels from the bottom of the container to trigger the loading of more data. Default is 50.
 * 
 * @returns An object containing:
 * - `isLoading`: A boolean indicating if data is currently being loaded.
 * - `hasMore`: A boolean indicating if there are more items to load.
 */
declare function useInfinityScroller<T>(
  scrollContainerRef: React.RefObject<HTMLElement>, 
  setData: React.Dispatch<React.SetStateAction<T[]>>, 
  fetchData: (page: number) => Promise<T[]>, 
  page: number, 
  setPage: React.Dispatch<React.SetStateAction<number>>, 
  loadTriggerOffset?: number
): {
  isLoading: boolean;
  hasMore: boolean;
};

export { useInfinityScroller };

/**
 * A custom React hook that manages state based on a localStorage value.
 * 
 * @param key The key (name) of the localStorage item to manage.
 * @param defaultValue (Optional) (Default : null)The default value to use if the item doesn't exist.
 * @returns The current value of the state based on the localStorage item.
 */
declare function useLocalStorageState<T>(key: string, defaultValue: T): T;

export { useLocalStorageState };

/**
 * A custom React hook that manages state based on a sessionStorage value.
 * 
 * @param key The key (name) of the sessionStorage item to manage.
 * @param defaultValue The default value to use if the item doesn't exist.
 * @returns The current value of the state based on the sessionStorage item.
 */
declare function useSessionStorageState<T>(key: string, defaultValue: T): [T, Error | null];

export { useSessionStorageState };
