/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ED0213",   // Dark Red
        secondary: "#FF5A57", // Light Red
        accent: "#FFD54F",    // Yellow Accent
        base: "#FFF8F8",      // Light background for website
        dark: "#0D0D0E",
        light: "#FAFAFA",
        black:'#494949'
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
};
