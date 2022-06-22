const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
    purge: {
        content: ['./src/**/*.{ts,tsx}'],
        options: {
            keyframes: true,
            fontFace: true,
            variables: true
        },
    },
    darkMode: 'class',
    theme: {
        colors: {
            white: colors.white,
            blue: colors.blue,
            red: colors.red,
            gray: colors.coolGray
        },
        screens: {
            'lg': '1024px'
        },
        extend: {
            fontFamily: {
                sans: ['Roboto', ...defaultTheme.fontFamily.sans],
            },
            boxShadow: {
                switch: '0px 1px 5px rgba(0, 0, 0, 0.2)'
            }
        }
    },
    variants: {
        extend: {
            textColor: ['disabled'],
            borderWidth: ['first'],
            backgroundColor: ['disabled'],
            cursor: ['disabled']
        }
    }
}