module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    fontFamily: {
      grandis: ['Grandis', 'serif'],
    },
    colors: {
      main: {
        sugar: '#FFFFFF',
        souffle: '#F8F8F8',
        waffle: '#D3D3D3',
        marzipan: '#A7A7A7',
        chocolate: '#090909',
        nuga: '#454545',
      },
      status: {
        success: '#77C044',
        warning: '#F2A000',
        error: '#DC5648',
      },
      transparent: 'transparent',
    },
    extend: {
      screens: {
        md: '768px',
        xl: '1280px',
        xxl: '1920px',
      },
      spacing: {
        100: '28rem',
        104: '30rem',
      },
      borderWidth: {
        '05': '0.5px'
      },
      letterSpacing: {
        widest: '.25em',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      gridTemplateColumns: {
        // Complex site-specific column configuration
        'fill-4': 'repeat(auto-fill, minmax(4rem, 1fr))',
        'fill-72': 'repeat(auto-fill, minmax(18rem, 1fr))',
      },
    },
  },
  variants: {
    extend: {
      textColor: ['disabled'],
      backgroundColor: ['disabled'],
      borderColor: ['disabled'],
      margin: ['last', 'first'],
    },
  },
  corePlugins: {
    container: false
  },

  plugins: [
    /* eslint-disable-next-line */
    require('postcss-import'),
  ],
}


