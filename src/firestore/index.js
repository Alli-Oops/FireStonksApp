/* ######### index.js contains code that involves the database - << hence being in the firestore folder >> ########## */

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

//////////////////////////////////////////////////////////////////////////
/* ######### Integrates Firebase with existing FireStonksApp ########## */
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
const db = firebaseApp.firestore();                                             // reference to the firestore database
const auth = firebaseApp.auth();                                                // reference to the auth module
const storage = firebaseApp.storage();                                          // reference to the storage module

////////////////////////////////////////////////////////////////////////////////
/* ######### Export Functions for Sign-In, Authentication, Log-Out ########## */
export async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()                     // "firebase.auth" is not referencing this as a method but rather, as a property and then we want to access the GoogleAuthProvider() // we store our reference to that in our "provider" variable
    await auth.signInWithPopup(provider)                                        // we want to await it because this method returns a promise **Not going to resolve immeditaely but after the user completes the signup flow
    window.location.reload()                                                    // after signing in with the popup, we can reload the page with window.location.reload()   -- this lets us redirect away from the "Splash" Page and actually show the authenticated content.
}     

export function checkAuth(cb) {
    return auth.onAuthStateChanged(cb);                                         // << Here >> within a callback function, we can get access to the user.  
}

export async function logOut() {
    await auth.signOut();                                                       // this returns a promise and then after doing so, will reload the page
    window.location.reload();                                                   // we want to use this function when we hit the logout button in the NavBar component
}

/////////////////////////////////////////////////////////////////////////
/* ######### CRUD Data from Firestore ########## */       

/* ######### READ - GET all the Lists Data from Firestore ########## */                // we pass in the collection with "id" which is going to be the 'lists' collection
export async function getCollection(id) {                                       // to get all the data we need to reference the collection and use the get()
    const snapshot = await db
    .collection(id)
    .get()                                                                      // it will be in the form of a promise, so we need to make the function async and await the response // we will get back a query "snapshot" so we'll call the variable holding this "snapshot"
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))       // then all of the data- will be provided on snapshot.docs // then we use the map() function to map over it and for each document, we want to create a new array where we return an object
    console.log(data)                                                           // so an array of objects where we set the id to the document id, and then use the method data() and ... spread in all the fields we're getting from the database into this object
}

/* ######### READ - GET a Specific User's Lists Data from Firestore ########## */                                                                                // Then - query collection data from our lists collection // getUserLists(userId) function iss specific for getting a specific user's lists // how we use the data (once it's fetched) is in the Lists.jsx component
export async function getUserLists(userId) {                                    // we pass in the user id with "userId" 
    const snapshot = await db
    .collection('lists')                                                        // we reference the collection called lists 
    // .where('author', '==', userId)                                              // then use the where() to say lists where the author is equal to the 'userID'
    .where('userIds', 'array-contains', userId)
    .get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()})) ;
    return data
}

/* ######### UPDATE - ADD a List the Firestore Database ########## */ 
export async function createList(list, user) {                      // pass in 2 arguments, list and user
    const { name, description, image } = list                       // we can ^^destructure the list to get back name, description, and image.
    await db
    .collection('lists')
    .add({                                                          // to put data on our collection use: db.collection, then reference the *lists* collection
        name,                                                       // then, add the fields -- name, description, and image (is either going to be am image OR null):
        description,
        image: image ? await uploadCoverImage(image) : null, 
    
        created: firebase.firestore.FieldValue.serverTimestamp(),   // This timestamps the date the data was created with the server method serverTimestamp()
        author: user.uid,                                           // The author field is the user's id
        userIds: [user.uid],                                        // then we store the userIds in an array
        users: [                                                    // but we also store the users in array that gives us more information about each user 
            {
                id: user.uid,
                name: user.displayName
            }
        ]
    })
}

/* ######### UPDATE - PUT a uploaded Image File in the Firestore Database ########## */ 
/* this function doesnt need to be exported because we are using it within the createList() function */
function uploadCoverImage(file) {                                                                                // The uploadCoverImage function lets us upload the image tot he database/ It accepts the user's file // And to use storage, we have a reference to that (towards the top of this file -- const storage = firebaseApp.storage();)
    const uploadTask = storage
        .ref(`images/${file.name}-${file.lastModified}`)                                                         // this `images/${file.name}` images/ creates a folder called images, that we put in the ${} location - giving the file a name with "file.name" (note: there is a name property for the image when the user uploads it)
        .put(file)                                                                                               // then we pass the file to the put method
    return new Promise((resolve, reject) => {                                                                    // for each promise, we get the resolve and reject functions.. and pass all the code for uploadTask.on() into the promise
        uploadTask.on(                                                                                           // << we can listen to the progress of this task with uploadTask.on() and give it the first argument as the string "state_changed"
            'state_changed',                                                    
            (snapshot) => console.log("image uploading", snapshot),
            reject,                                                                                              // reject <<here>> and then we can resolve the promise in the *.then() 
            () => {
                storage.ref('images').child(`${file.name}-${file.lastModified}`).getDownloadURL().then(resolve)  // THen, << the callback where we can get the URL and the URL comes from: storage.ref() where we pass in images. We need to resolve this as a promise with .then()
            }                                                                                                    // Since we need to pass the URL to the creatList() function *below* we need to promisify the uploadCoverImage() function.. // by returning a promise, the createList() function can easily resolve it with the *async* *await* syntax.
        );                                                                                                       // We promisify the the uploadCoverImage(file) function with the line new Promise()        
    })
}

/* ######### READ - GET a list from the database ########## */ 
export async function getList(listId) {
    try {
    const list = await db.collection('lists').doc(listId).get();    // this will get back the specific list
    if (!list.exists) throw Error(`List doesn't exist`);             // if the list doesnt exist, throw an error
    return list.data();                                             // if the list exists, return the data
    } catch (error) {
        console.error(error);                                       // to make sure that the useSWR hook gets access to the error -  we need to throw the error <<here in the catch
        throw Error(error);                                         // throw Error with the error we recieve here.
    }
}

/* ######### CREATE - ADD List Item ########## */ 
export async function createListItem({ user, listId, item }) {
    try {
    const response = await fetch(`https://shot.screenshotapi.net/screenshot?token=TS0APB6-Y7K4KNE-P9ERC74-VN7JJ5M&url=${item.link}`) // `https://screenshotapi.net/api/v1/screenshot?url=${item.link}&token=TS0APB6-Y7K4KNE-P9ERC74-VN7JJ5M`
    const { screenshot } = await response.json()                            // to get back our data as json data, we need to await again. and this respone will be an object called screenhot that we can pass to the image field of the list object we're creating
    db.collection('lists').doc(listId).collection('items').add({            // here we are adding a new docoument to the *items subcollection of a particular list
        name: item.name, 
        link: item.link,
        image: screenshot,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        author: {                                                           // the author is an object
            id: user.uid,
            username: user.displayName
        }
    })
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

/* ######### UPDATE? - Subscribe to List Items ########## */
export function subscribeToListItems(listId, cb) {        // provide the listId and a callback function
    return db.collection('lists')
    .doc(listId)                                          // doc will be the list id
    .collection('items')                                  // collections will be the subcollection items
    .orderBy('created', 'desc')                           // we order the collections in decending order (newest to oldest) using the orderBy method and the *created field that we have on each item
    .onSnapshot(cb)                                       // onSnapshot returns a subscription function and this is where we pass the callback to. THis is so we can get all of our snapshot data within item list
} 


/* ######### DELETE - Delete List Items ########## */ // We dont need to make this function async because we have a subscription using the .onSnapshot() method ^ to listen for any changes - so we dont need to reload the page or anything
export function deleteListItem(listId, itemId) {
    return db.collection('lists')
    .doc(listId)
    .collection('items')
    .doc(itemId)
    .delete();
}

/* ######### UPDATE - users can join another users list ########## */
export async function addUserToList(user, listId) {                     // This looks up the user data and the listId
    await db.collection('lists').doc(listId).update({                   // then we specify the collection 'lists' in the database, the document by it's 'listId' and then update that data
        userIds: firebase.firestore.FieldValue.arrayUnion(user.uid),    // specifically updating the userIds array - by passing the user.uid to the arrayUnion method - this just adds the specific users id to the correct spot
        users: firebase.firestore.FieldValue.arrayUnion({               
            id: user.uid,
            name: user.displayName
        })
    })
    window.location.reload();       // this reloads the page
}