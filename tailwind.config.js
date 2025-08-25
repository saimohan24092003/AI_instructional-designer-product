/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Clamshell palette: Indigo/Teal, Coral, Navy, Light Gray
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1", // Indigo base
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        },
        coral: {
          50: "#fff1f0",
          100: "#ffe0de",
          200: "#ffbdb7",
          300: "#ff958d",
          400: "#ff766c",
          500: "#f9736b", // Coral accent
          600: "#ea5f57",
          700: "#cd4b43",
          800: "#a83c35",
          900: "#8a322d"
        },
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6", // Teal accent
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a"
        },
        navy: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a" // Navy ink
        }
      },
      fontFamily: {
        brand: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"]
      },
      backgroundImage: {
        "clam-gradient": "linear-gradient(90deg, #60A5FA 0%, #34D399 35%, #F59E0B 70%, #F472B6 100%)"
      }
    }
  },
  plugins: []
};


