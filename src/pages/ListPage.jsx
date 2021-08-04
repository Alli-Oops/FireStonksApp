// The ListPage.jsx is where we are going to create List items and display them

import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/shared/Layout";
import useSWR from "swr";
import CreateItem from "../components/CreateItem";
import ItemList from "../components/ItemList";
import JoinList from "../components/JoinList";
import Error from "../components/shared/Error";
import Loading from "../components/shared/Loading";
import * as db from "../firestore";
import { UserContext } from "..";

function ListPage({location}) {                             // get from props a location we are at 
    const user = React.useContext(UserContext)
    const listId = location.pathname;                       // and relying on React routerDOM in the index.jsx file we can get the /:listId from the route "path"
    const {data: list, error} = useSWR(listId, db.getlist)  // with this listId we can execute our getList() function 
                // ^^ we will call the data list
    if (error) return <Error message={error.message} />     // if error, return <Error/> where the message is set to error.message
    if (!list) return <Loading/>                            // if we don't have the list, return loading
    return (
        <Layout>
        <section className="text-gray-500 bg-gray-900 body-font">
            <div className="container mx-auto flex flex-col px-5 py-4 justify-center items-center">
            <div className="w-full md:w-2/3 flex flex-col mb-16 items-center text-center">
                <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium font-bold text-white">
                {list.name} 
                </h1>
                <p className="mb-8 leading-relaxed">{list.description}</p>
                {/* Create new list item - pass down use as its own prop as well as listId as its own prop */}
                <CreateItem user={user} listId={listId}/>
                <p className="text-sm mt-2 text-gray-500 mb-8 w-full">
                New links appear below in realtime ✨
                </p>
                <div className="flex text-gray-300">
                <button className="bg-orange-500 inline-flex py-3 px-5 rounded-lg items-center hover:bg-orange-600 hover:text-white focus:outline-none">
                    <span className="flex items-start flex-col leading-none">
                    <span className="text-xs text-gray-200 mb-1">
                        Share With Friends
                    </span>
                    <span className="title-font font-medium">Copy Link</span>
                    </span>
                </button>
                <Link
                    to="/"
                    className="bg-gray-800 inline-flex py-3 px-5 rounded-lg items-center ml-4 hover:bg-gray-700 hover:text-white focus:outline-none"
                >
                    <span className="flex items-start flex-col leading-none">
                    <span className="text-xs text-gray-600 mb-1">
                        Visit Home Page
                    </span>
                    <span className="title-font font-medium">Create List</span>
                    </span>
                </Link>
                </div>
            </div>
            </div>
        </section>
        {/* display all items in list is <ItemList/> and to it, we just need to pass down the listId */}
        <ItemList listId={listId}/>
        </Layout>
    );
}

export default ListPage;
