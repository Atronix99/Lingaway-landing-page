// tailwind.config.js
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'poppins': ['Poppins', 'sans-serif'],
            },
            colors: {
                'lingaway': {
                    'primary': '#3ab18b',
                    'secondary': '#3ec6b8',
                    'accent': '#7ee8a5',
                    'light': '#F6F6F6',
                }
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '2.5rem',
                '5xl': '3rem',
            },
            boxShadow: {
                'card': '0 10px 20px rgba(0,0,0,0.08)',
                'avatar': '0 2px 8px rgba(62, 198, 184, 0.13)',
            },
            fontSize: {
                '50px': '3.125rem',  // 50px
                '40px': '2.5rem',   // 40px
                '38px': '2.375rem',  // 38px
                '36px': '2.25rem',  // 36px
                '24px': '1.5rem',   // 24px

                // Body/Description Sizes
                '20px': '1.25rem',  // 20px
                '18px': '1.125rem', // 18px
            },
            fontWeight: {
                'regular': '400',
                'medium': '500',
                'semibold': '600',
                'bold': '700',
            }
        }
    }
}