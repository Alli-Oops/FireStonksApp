// The CreateList.jsx component displays the features where - users can dynamically add new data. 

import React from "react";
import * as db from "../firestore";
import { mutate } from 'swr'

const DEFAULT_LIST = {
    name: "",
    description: "",
    image: null,
}


function CreateList({ user }) {
    const [list, setList] = React.useState(DEFUALT_STATE)       // create some state for the lists, make this state an object that we referece with DEFAULT_STATE -- consisting of the properties: name, description, and image
    const [submitting, setsubmitting] = React.useState(false)   // we can use this 'submitting' state for disabling the submit button, and to show our user that we're in the process of creating our list

    function handleInputChange(event) {                         // this function handles the change event and specifically gets data from event.target and we want 2 values *name* and *value*
        const {name, value, files } = event.target;
        if (files) {                                            // use files OR files.length > 0 *to check length
            const newImage = files[0]                               // the image will come from the first element in the files array
            setList(prevState => ({...prevState, image: newImage})) // this will set the image to the newImage
        } else {                                                // so if the taret does-not have a file in the target array... we will just update the other stuff *name* *desctiption* << both those fields are updated with the following code even tho *description* isnt explicitly referenced with the paramenter 'name' 
            setList(prevState => ({...prevState, [name]:value}))    // use an updating pattern/sequence where we get the previous list data pr 'state' to make sure we get the previous values but also update the new value that we need to update.
        }                                                       // ^ this will work for either the name OR description fields
    }

    async function handleCreateList() {
        try {
            setSubmitting(true)
            await db.createList(list, user);                        // pass in list and user - that we should be receiving from props.
            mutate(user.uid)
            setList(DEFAULT_LIST)                                   // this will reset the list to DEFAULT_LIST after a user submits a list. To make sure that the list is reset ONLY after the submission is done //... we we need to use async/ await syntax for createlist. (ensures things happen in the correct order.) 
            setSubmitting(false)
        } catch(error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col text-center w-full mb-12">
        <h1 className="text-2xl font-medium title-font mb-4 text-white tracking-widest">
            WELCOME, {user.displayName.toUpperCase()}!
        </h1>
        <p className="lg:w-2/3 mx-auto mb-12 leading-relaxed text-base">
            To get started, create a list with a name and a cover image
        </p>
        <div className="lg:w-2/6 mx-auto md:w-1/2 bg-gray-800 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
            <input
            className="bg-gray-900 rounded border text-white border-gray-900 focus:outline-none focus:border-green-500 text-base px-4 py-2 mb-4"
            placeholder="Add list name"
            type="text"
            name="name"
            onChange={handleInputChange}                        // this will handle the event when a user provides an input
            value={list.name}                                   // this makes it so that the value of the input is controlled by state
            required
            />
            <textarea
            className="bg-gray-900 rounded border text-white border-gray-900 focus:outline-none focus:border-green-500 text-base px-4 py-2 mb-4"
            placeholder="Add short description"
            type="text"
            name="description"
            onChange={handleInputChange}
            value={list.description}                            // this makes it so that the value of the input is controlled by state
            />
            <input
            className="bg-gray-900 rounded border text-white border-gray-900 focus:outline-none focus:border-green-500 text-base px-4 py-2 mb-4"
            placeholder="Add list name"
            type="file"
            name="image"
            onChange={handleInputChange}                        // the file cannot be controlled by state
            />
    {/* display preview image we need a conditional to use the image that a user inputs - IF we have it */} 
    {/* The && oprerator will return the list.image -- if we have that image -- */}
            {list.image && (
            <img className="mb-4" src={URL.createObjectURL(list.image)} />  
            )}
    {/* "mb-4" gives margin on the bottom */}
    {/* URL.createObjectURL(list.image)  <<-- this creates a preview image from the provided image*/}
    {/* onClick we need a handler function that creates a list */}
            <button onClick={handleCreateList} className="text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg">
            disabled={submitting}
            {submitting ? "Creating..." : "Create List"}
            </button>
            <p className="text-xs text-gray-600 mt-3">*List name required</p>
        </div>
        </div>
    );
}

export default CreateList;
