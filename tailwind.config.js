/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: ["class"], // allows dark mode toggling via class
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",       // App Router pages
        "./components/**/*.{js,ts,jsx,tsx}",// your custom components
        "./pages/**/*.{js,ts,jsx,tsx}",     // legacy Pages Router (if any)
        "./lib/**/*.{js,ts,jsx,tsx}",       // for any utility components with Tailwind
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],  // you can change this later
            },
        },
    },
    plugins: [],
};
