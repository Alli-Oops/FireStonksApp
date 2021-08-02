////////////// HOW DO YOU GET vite TO WORK? ///////////////////
/* vite - A dev dependency/ built-in tool that runs our 
program faster than other tools like create-react-app
*vite is going to pre-bundle our dependencies to speed up our 
dev-server page load (or build-server page load respectively)
*/


// @ts-check
const reactPlugin = require("vite-plugin-react");

/**
 * @type { import('vite').UserConfig }
 */
const config = {
    jsx: "react",
    plugins: [reactPlugin],
};

module.exports = config;


/////////////////////////////////