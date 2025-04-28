/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html", "./src/**/*.js", "./src/*.js", "./src/*.html"],
  safelist: [
    {
      pattern: /(bg|text|border)\-green\-300/
    }
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3c5b66",
        secondary: "#FEF2B8"
      }
    },
  },
  plugins: [],
}

