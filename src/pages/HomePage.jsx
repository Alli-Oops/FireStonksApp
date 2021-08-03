/* The Homepage.jsx is the Authenticated-User’s Home Page - the place where users can create new lists or see/click on the lists they created. */

import React from "react";
import CreateList from "../components/CreateList";
import Lists from "../components/Lists";
import Layout from "../components/shared/Layout";
import { UserContext } from '../index'; // Need to import UserContext as a *named import between curly braces

function HomePage() {
    const user = React.useContext(UserContext);
    console.log("We should see the User Id Here:");
    console.log(user.uid); // see that it's working
    console.log("Is ^^that^^ the user ID or what?");
    return (
        <Layout>
        <CreateList user={ user } />  {/* You COULD alternatively put the userContext inside the CreateList component, but <<here>> we are passing the UserContext in as a prop*/}
        <Lists user={ user } />
        </Layout>
    );
}

export default HomePage;