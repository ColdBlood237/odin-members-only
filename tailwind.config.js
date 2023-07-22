/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: ["./views/*.ejs"],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
};
