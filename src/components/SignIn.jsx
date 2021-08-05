/* SignIn.jsx displays the sign in portal, including the button with an onClick event 
that triggers — db.signInWithGoogle — for authentication.*/

import React from "react";
import fsSvg from "../../static/fs.svg";
import * as db from "../firestore"; // This * is importing everything fromt eh firestore folder as "db". So this is aliasing everything to db which enables us to use the functions that we export from index.js (i.e. the signInWithGoogle)

function SignIn() {
    return (
        <div>
        <section className="text-gray-500 bg-gray-900 body-font">
            <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
            <img
                className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded"
                alt="hero"
                src={fsSvg}

            />
            <div className="text-center lg:w-2/3 w-full">
                <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium italic text-white">
                FireStonks.com
                </h1>
                <p className="leading-relaxed mb-8 ">
                Firestonk.com is a social app that enables you to share your stonk picks in
                lists with friends in realtime.
                </p>
                <div className="flex justify-center">
                <button
                    onClick={db.signInWithGoogle}   // whenever a user clicks this button, we attempt to sign them in -- we need to switch from rendering the "unAuthApp"  component to the "authApp"
                    className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
                >
                    Sign In With Google
                </button>
                </div>
            </div>
            </div>
        </section>
        </div>
    );
}

export default SignIn;