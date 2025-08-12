
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nn_bg1: "#0f1430",
        nn_bg2: "#1a1f44",
        nn_primary: "#6e63ff",
        nn_primary_hover: "#5e53e0",
        nn_card: "#12162d",
        nn_border: "#2a2f55",
        nn_text: "#e7e8f0",
        nn_muted: "#9aa0c3"
      },
      boxShadow: {
        'nn': "0 10px 30px rgba(0,0,0,.35)"
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
