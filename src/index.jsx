/* index.jsx file has our FireStonksApp that we render. It renders our Authenticated routes to the
pages that our App consists of (Homepage and Listpage)
*/

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ListPage from "./pages/ListPage";
import HomePage from "./pages/HomePage";
import SignIn from "./components/SignIn";
import * as db from "./firestore";                          // no longer need to execute checkAuth here because of the useAuth Hook
import Loading from "./components/shared/Loading";
import useAuth from "./hooks/useAuth";

export const UserContext = React.createContext()            //useContext ** this lets us utilize/share *user* data among the various components / pages - wherever we need it. 

function App() {     
    const { user, loading } = useAuth() 
    if (loading) return <Loading />   
    return user ? <AuthApp user={user}/> : <UnAuthApp/>;  
}

function AuthApp({ user }) {     
    return (
        <BrowserRouter>
        <Switch>
            <UserContext.Provider value={user}>             {/*The value prop is set to user and this is going to make consuming our user data easy*/}
            <Route path="/:listId" component={ListPage} />
            <Route exact path="/" component={HomePage} />
            </UserContext.Provider>
        </Switch>
        </BrowserRouter>
    );
}

function UnAuthApp() {
    return <SignIn/>                                         //This returns the SignIn component for rendering
}

ReactDOM.render(
    <React.StrictMode>
        < App />
    </React.StrictMode>,
document.getElementById("root")
); 