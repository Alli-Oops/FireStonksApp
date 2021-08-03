import React from "react";                                          // import React in order to bring in the Hooks that we need
import * as db from "../firestore";

function useAuth() {
    const [user, setUser] = React.useState(null)                    // Create a piece of state <<HERE>> we put the User within local State
    const [loading, setLoading] = React.useState(true)              // piece of state for loading while we wait for the asynchronous function to complete. Set the default boolean value to true - we can assume that when it's used, we will fetch the user data                                               
    React.useEffect(() =>{                                          // useEffect to make the state-- so it will execute just ONCE when the app mounts
        return db.checkAuth((user) => {                             // write the callback function here where we get the user... but providing it here will give us accesst to it within app so we can store it locally within state. // we want to return db.checkAuth
            setLoading(false)                                       // once we checkAuth and we get our user, we want to change/update Loading to False                                          
            setUser(user)                                           // Once we get our user - this will change/update the user to whoever successfully logs in // to manage the situations when we don't have an authenticated user yet - we need a piece of state for loading]
        }); 
    }, []);  

    return { user, loading }                                        // *Important - we must return {user, loading} so these objects are available in the index.jsx's App function when useAuth is called
} 

export default useAuth;
