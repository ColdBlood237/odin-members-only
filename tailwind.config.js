/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.ejs",
    "./src/**/*.{html,js}",
    "./node_modules/flowbite/**/*.js",
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  plugins: [
    require("flowbite/plugin"),
    require("daisyui"),
    require("@tailwindcss/forms"),
  ],
};
