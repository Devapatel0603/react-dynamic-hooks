# React Dynamic Hooks

`react-dynamic-hooks` is a set of React hooks for handling infinite scrolling, cookie state management, and storage state management (session and local storage). These hooks aim to simplify common tasks in React applications.

## Table Content

-   [Installation](#installation)
-   [Hooks](#hooks)
    -   [useInfinityScroller](#useInfinityScroller)
    -   [useAsyncEffect](#useAsyncEffect)
    -   [useCookieState](#useCookieState)
    -   [useSessionStorageState](#useSessionStorageState)
    -   [useLocalStorageState](#useLocalStorageState)
-   [License](#license)
-   [Author](#author)

## Installation

Install the package using npm or yarn:

```bash
npm install react-dynamic-hooks
```

or

```bash
yarn add react-dynamic-hooks
```

## Hooks

### **_`useInfinityScroller`_**

This hook takes care of infinite scrolling logic, allowing you to focus on rendering data and handling loading states.

**Parameters :**

-   `scrollContainerRef` : A reference to the scroll container element.
-   `setData` : Function to set the fetched data.
-   `fetchData` : Async function to fetch data. It should accept a page number as an argument.
-   `page` : The current page number.
-   `setPage` : Function to update the page number.
-   `loadTriggerOffset`(optional): Offset from the bottom to trigger the load more action. Default is 50.

**Returns :**

-   `isLoading` : Boolean indicating if data is being loaded.
-   `hasMore` : Boolean indicating if there are more items to load.

```javascript
import React, { useRef, useState } from "react";
import { useInfinityScroller } from "react-dynamic-hooks";

const MyComponent = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const containerRef = useRef(null);

    const fetchData = async (page) => {
        // Ensure to pass the "page" parameter (you can name it as you like) to fetch the corresponding data.

        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=10`
            );

            const jsonData = await response.json();
            return jsonData; // Must return data(Array)
        } catch (error) {
            console.log(error); //Handle errors
            return []; // Return empty array in case of error
        }
    };

    const { isLoading, hasMore } = useInfinityScroller(
        containerRef,
        setData,
        fetchData,
        page,
        setPage
    );

    return (
        <div
            className=""
            style={{
                display: "grid",
                placeItems: "center",
                height: "90vh",
                width: "90vw",
            }}
        >
            <div
                className=""
                style={{
                    overflowY: "auto",
                    height: "40vh",
                    width: "40vw",
                    background: "aliceblue",
                    padding: "10px",
                }} //overflowY must be 'auto' or 'scroll' (other than 'hidden')
                //Giving height is also necessary for this div
                ref={containerRef}
            >
                {data &&
                    data.length > 0 &&
                    data.map((d, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <div className="">{d.id} id</div>
                            <div className="">{d.userId} userId</div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
```

### **_`useAsyncEffect`_**

A hook for using asynchronous functions in `useEffect`. This hook is similar to `useEffect` only change is in this hook we can pass Async function.

**Parameters :**

-   `effect` : Async function to run
-   `deps` : Dependency array (Optional) (default : [] )

```javascript
import { useAsyncEffect } from "react-dynamic-hooks";

const ExampleComponent = () => {
    useAsyncEffect(async () => {
        const data = await fetchData();
        console.log(data);
    }, []);

    return <div>Check the console for data</div>;
};
```

### **_`useCookieState`_**

`useCookieState` acts like `useState` for cookies. It retrieves a cookie's value and automatically updates your component's state when the cookie changes, allowing you to react to cookie modifications in your React components.

**Parameters :**

-   `key` : The name of the cookie
-   `defaultValue` : The initial value to use if the cookie doesn't exist.

**Returns :**

-   `state` : The current value of the cookie

```javascript
import { useCookieState } from "react-dynamic-hooks";

const MyComponent = () => {
    const token = useCookieState("authToken", null); //If cookie not exist then set to null

    return (
        <>
            {!token ? (
                <>
                    <h1>User is logged in</h1>
                </>
            ) : (
                <>
                    <h1>Please login</h1>
                </>
            )}
        </>
    );
};
```

There is also two additional functions for your convenience :

### `setCookie`

**Parameters :**

-   `name` : The name of the cookie
-   `value` : Value of the cookie
-   `options`(Optional) : Options for cookie like expires, path, domain, secure, httpOnly, maxAge, sameSite

```javascript
setCookie("authToken", token);
```

### `getCookie`

**Parameters :**

-   `name` : The name of the cookies

**Returns :**

-   `value` : Cookie value or null if not exist

```javascript
getCookie("authToken");
```

### **_`useLocalStorageState`_**

`useLocalStorageState` behaves like `useState` for local storage. It retrieves a value from local storage based on a key, and automatically updates your component's state when the value changes. This allows your component to stay in sync with local storage data.

**Parameters :**

-   `key` : The name of the key in localstorage
-   `defaultValue` : The initial value to use if the key doesn't exist in localstorage

**Returns :**

-   `state` : The current value of the key in localstorage

```javascript
import { useLocalStorageState } from "react-dynamic-hooks";

const MyComponent = () => {
    const theme = useLocalStorageState("theme", 'light'); //If theme not exist then set to light

    return (
        <>
            <div className=`${theme}`>
                //Component
            </div>
        </>
    );
};
```

### **_`useSessionStorageState`_**

`useSessionStorageState` behaves like `useState` for session storage. It retrieves a value from session storage based on a key, and automatically updates your component's state when the value changes. This allows your component to stay in sync with session storage data.

**Parameters :**

-   `key` : The name of the key in session storage
-   `defaultValue` : The initial value to use if the key doesn't exist in session storage

**Returns :**

-   `state` : The current value of the key in session storage

```javascript
import { useSessionStorageState } from "react-dynamic-hooks";

const MyComponent = () => {
    const theme = useSessionStorageState("theme", 'light'); //If theme not exist then set to light

    return (
        <>
            <div className=`${theme}`>
                //Component
            </div>
        </>
    );
};
```

## License

[MIT](https://github.com/Devapatel0603/react-dynamic-hooks/blob/main/LICENCE)

## Authors

-   [@Dev Patel](https://github.com/Devapatel0603)
