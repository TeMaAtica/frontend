/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#B54FE5",
                secondary: "#C1F032",
                dimWhite: "#6F6F6F",
                white: "#fff",
                background: "#000",
                cards: "#161619",
                background2: "#202224",
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
                Inter: ["'Inter', sans-serif"],
                outfit: ["'Outfit', sans-serif"],
                RobotoMono: ["'Roboto Mono', monospace"],
                PublicSans: ["'Public Sans', sans-serif"],
                Monserrat: ["'Montserrat', sans-serif"],
                Syne: ["'Syne', sans-serif"],
                Orkney: ["'Orkney', sans-serif"],
                Cerebri: ["'Cerebri Sans', sans-serif"],
            },
            fontSize: {
                13.5: ["13.5px", "16.34px"],
                18.5: ["18.5px", "22.34px"],
            },
        },
        screens: {
            xs: "480px",
            ss: "600px",
            sm: "768px",
            ms: "1024px",
            md: "1140px",
            lg: "1200px",
            xl: "1700px",
        },
    },
    plugins: [require("tailwindcss")],
};
