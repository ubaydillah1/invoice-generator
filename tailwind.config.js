/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        neu: "0 0 10px rgba(0, 0, 0, 0.1)",
        "neu-white": "0 0 15px 5px rgba(255,255,255,255)",
      },
    },
  },
  plugins: [],
};
