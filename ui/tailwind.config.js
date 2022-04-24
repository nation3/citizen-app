module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      display: ['Poppins', 'sans-serif'],
      body: ['UniversalSans', 'sans-serif'],
    },
    fontWeight: {
      light: 200,
      normal: 300,
      medium: 400,
      semibold: 500,
      bold: 500,
    },
    extend: {
      colors: {
        n3blue: '#69C9FF',
        n3green: '#88F1BB',
        'n3blue-100': '#DCFFFF',
        'n3green-100': '#D5FFFF',
        n3bg: '#F4FAFF',
        n3nav: '#7395B2',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#69C9FF',
          secondary: '#88F1BB',
          accent: '#88F1BB',
          neutral: '#3d4451',
          'primary-content': '#ffffff',
          'base-100': '#ffffff',
          'base-content': '#224059',
        },
      },
    ],
  },
}
