/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#0b1017",
        panel: "#111926",
        line: "#243043",
        cyan: "#55d8ff",
        mint: "#4fe0b5",
        amber: "#f8c15c",
        danger: "#ff6b6b"
      },
      boxShadow: {
        glow: "0 20px 80px rgba(85, 216, 255, 0.10)"
      }
    }
  },
  plugins: []
};

