/* ######### index.js contains code that involves the database - << hence being in the firestore folder >> ########## */

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

/* ######### Integrates Firebase with existing FireStinksApp ########## */
var firebaseConfig = {
    apiKey: "AIzaSyAfP2G73bTgAoGJg-dQUTJBgLRN6jeVDeI",
    authDomain: "firestonks-8f437.firebaseapp.com",
    projectId: "firestonks-8f437",
    storageBucket: "firestonks-8f437.appspot.com",
    messagingSenderId: "518004201385",
    appId: "1:518004201385:web:d59f4f6ad0acd8bc6156b8"
};


const firebaseApp = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();
const db = firebaseApp.firestore();                                 // reference to the firestore database
const auth = firebaseApp.auth();                                    // reference to the auth module
const storage = firebaseApp.storage();                              // reference to the storage module

/* ######### Export Functions for Sign-In, Authentication, Log-Out ########## */
export async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()         // "firebase.auth" is not referencing this as a method but rather, as a property and then we want to access the GoogleAuthProvider() // we store our reference to that in our "provider" variable
    await auth.signInWithPopup(provider)                            // we want to await it because this method returns a promise **Not going to resolve immeditaely but after the user completes the signup flow
    window.location.reload()                                        // after signing in with the popup, we can reload the page with window.location.reload()   -- this lets us redirect away from the "Splash" Page and actually show the authenticated content.
}     

export function checkAuth(cb) {
    return auth.onAuthStateChanged(cb);                             // << Here >> within a callback function, we can get access to the user.  
}

export async function logOut() {
    await auth.signOut();                                           // this returns a promise and then after doing so, will reload the page
    window.location.reload();                                       // we want to use this function when we hit the logout button in the NavBar component
}