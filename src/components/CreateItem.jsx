import React from "react";
import * as db from "../firestore";
import Error from "./shared/Error";

function CreateItem({ user, listId }) {                         // user and listId are props 
    const [name, setName] = React.useState('')                  // add some state to store the item name
    const [link, setLink] = React.useState('')                  // add some state to store the item link
    const [error, setError] = React.useState('')                // add some deticated error state 
    const [submitting, setSubmitting] = React.useState(false)   // add some submitting state and set it to false

    async function handleCreateItem(event) {
        try {
        event.preventDefault();                                 // this prevents reloading the page
        setSubmitting(true)
        const item = { name, link }                             // this creates an item out of the *name and *link data << we provide them as properties on this item object
        await db.createListItem({ user, listId, item });
        setName(''),                                             // clear out our name state
        setLink('')                                             // clear out our link state
        } catch (error) {
            setError(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
        <form onSubmit={handleCreateItem} className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:px-0">
            <input
                className="flex-grow w-full bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:border-green-500 text-base px-4 py-2 mr-4 mb-4 sm:mb-0"
                name="name"
                placeholder="Add item name"
                // whenever the input value changes for the *name* input specifically, we call setName and pass to it the value from event.target
                onChange={event => setName(event.target.value)} 
                value={name} // set the value to the name from state
                type="text"
            />
            <input
                className="flex-grow w-full bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:border-green-500 text-base px-4 py-2 mr-4 mb-4 sm:mb-0"
                name="link"
                placeholder="Add link"
                type="url"
                // similarly, whenever the input value changes for the *link* input specifically, we call setName and pass to it the value from event.target
                onChange={event => setLink(event.target.value)} 
                value={link}
                required
            />
            <button
                type="submit"
                disabled={submitting}
                className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
            >
                {submitting ? "Creating..." : "Create"}
            </button>
        </form>
      {/* display error */}
        <Error message={error}/>
        </>
    );
}

export default CreateItem;
