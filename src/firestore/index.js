import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// integrates Firebase with existing FireStinksApp
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
const db = firebaseApp.firestore();             // reference to the firestore database
const auth = firebaseApp.auth();                // reference to the auth module
const storage = firebaseApp.storage();          // reference to the storage module

