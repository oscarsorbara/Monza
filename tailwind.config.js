/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        monza: {
          red: '#DC2626',   // Bright racing red
          dark: '#991B1B',  // Darker red for hover/active
        },
        carbon: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2D2D2D',
          600: '#3F3F46',
        },
        metallic: {
          silver: '#E5E7EB',
          chrome: '#F3F4F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'carbon-pattern': "url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M1 1h2v2H1V1zm4 0h2v2H5V1zm4 0h2v2H9V1zm4 0h2v2h-2V1zm4 0h2v2h-2V1zm-16 4h2v2H1V5zm4 0h2v2H5V5zm4 0h2v2H9V5zm4 0h2v2h-2V5zm4 0h2v2h-2V5zM1 9h2v2H1V9zm4 0h2v2H5V9zm4 0h2v2H9V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9zm-16 4h2v2H1v-2zm4 0h2v2H5v-2zm4 0h2v2H9v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM1 17h2v2H1v-2zm4 0h2v2H5v-2zm4 0h2v2H9v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z\\' fill=\\'%2318181b\\' fill-opacity=\\'0.4\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [],
}
