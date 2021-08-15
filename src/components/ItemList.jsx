import React from "react";
import * as db from "../firestore";

function ItemList({ listId }) {

    const [items, setItems] = React.useState([])                // add some state for items

    React.useEffect(() => {                                     // well useEffect so when the component mounts, were going to subscribe using a function from our firestore file well subscribe to all the items within a lists item collection
        return db.subscribeToListItems(listId, {                // for the callback, we'll provide an object and we want to use the next: function
            next: querySnapshot => {                            // here we will get access to our querySnapshot and we will write this as an arrow function
                const data = querySnapshot.docs.map(doc => ({   // this will be an array of objects that we'll map over
                    id: doc.id,                                 // get the id from doc.id
                    ...doc.data()                               // then spread in the rest of the data from the data() method
                }))
                setItems(data);
            }
        })
    }, [listId]) // we only want to run the effect function (aka only subscribe to list items) whenever the listId changes - so that would be for a different page.
    
    return (
        <section className="text-gray-500 body-font bg-gray-900">
        <div className="container px-5 py-5 mx-auto">
            <div className="flex flex-wrap -m-4"> {/* display items in list */}
                {items.map(item => (
                    <Item key={item.Id} listId={listId} item={item} />
                ))}
            </div> 
        </div>
        </section>
    );
}

function Item( { listId, item }) {  
    const {id, name, link, image, author, created } = item                  // destructuring the *id <<here>> within the item() function makes it possible for us to make a delete option for the users
    const date = created ? created.toDate().toLocaleDateString() : null     // the created field gives us access to the toDate method so we can convert that data to a date

    function handleDeleteItem() {
        if (window.confirm('Are you sure you want to delete this?')) {
            db.deleteListItem(listId, id) // we pass the *listId and item *id that is destructured ^ above // we place this handler on the Delete button with the onClick event
        }

    }

    return (
        <div className="xl:w-1/4 md:w-1/2 p-4">
            <div className="bg-gray-800 p-6 rounded-lg">
                <a href={link} target="_blank" rel="noopener noreferer">
                    <img
                        className="h-40 rounded w-full object-cover object-center mb-6"
                        src={image}
                        alt={name}
                    />
                </a>
                <h3 className="tracking-widest text-green-500 text-xs font-medium title-font">
                    {author.username}
                </h3>
                <h2 className="text-lg text-white font-medium title-font mb-4">{name}</h2>
                <div className="flex items-center justify-between">
                    <span className="leading-relaxed text-base">Posted {date}</span>
                    <button 
                        onClick={handleDeleteItem} 
                        className="inline-flex text-white bg-red-500 border-0 py-1 px-2 focus:outline-none hover:bg-red-600 rounded text-lg"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemList;