// ChatGPT Design Tokens — 2026-08-16. Generado por scripts/build-tailwind.cjs
// Uso: cambia la paleta según el tema activo (light/dark) con "darkMode: 'class'".
// Para un arranque rápido en un proyecto nuevo, copia este objeto a tu tailwind.config.
import type { Config } from 'tailwindcss'

const chatgptLight = {"blue":{"25":"#f6fafe","50":"#e8f3fe","75":"#d1e5fd","100":"#a4cdfb","200":"#63a8f8","300":"#539af8","400":"#3a83f7","500":"#2c67c5","600":"#1f4e94","700":"#173e76","800":"#133463","900":"#0c274a","1000":"#020d18","a50":"#0285ff21","a75":"#0285ff40"},"gray":{"0":"#fff","25":"#fcfcfc","50":"#f9f9f9","75":"#f2f2f2","100":"#ececec","150":"#e8e8e8","200":"#e3e3e3","250":"#d8d8d8","300":"#cdcdcd","400":"#b4b4b4","450":"#a8a8a8","500":"#9b9b9b","550":"#818181","600":"#676767","650":"#545454","700":"#424242","750":"#2f2f2f","800":"#212121","850":"#1c1c1c","900":"#171717","925":"#121212","950":"#0d0d0d","975":"#0c0c0c","1000":"#0b0b0b"},"green":{"25":"#effaf3","50":"#def3e5","75":"#c2eace","100":"#9fddb1","200":"#83d197","300":"#6bc67f","400":"#53b559","500":"#48a04c","600":"#3a843f","700":"#2c6732","800":"#1f4e25","900":"#14361a","1000":"#041208","a50":"#04b84c26","a75":"#04b84c4a"},"orange":{"25":"#fdf5f1","50":"#fbe8db","75":"#f7d1b8","100":"#f4ba96","200":"#f1a275","300":"#ef8b57","400":"#ee7c37","500":"#d25e28","600":"#ac4f23","700":"#87401d","800":"#653218","900":"#45240d","1000":"#1f1209","a50":"#fb6a2229","a75":"#fb6a2254"},"pink":{"25":"#fef8fb","50":"#fdedf4","75":"#fcd8e7","100":"#fbbfd7","200":"#f8a6c8","300":"#f68ebc","400":"#f077af","500":"#cf6194","600":"#ab4f7a","700":"#873e60","800":"#663049","900":"#462132","1000":"#1d0f15","a50":"#ff66ad29","a75":"#ff66ad47"},"purple":{"25":"#f8f5fd","50":"#ede5fc","75":"#ddcffa","100":"#c9b1f6","200":"#b897f4","300":"#a67df2","400":"#8952ee","500":"#7849d1","600":"#643cae","700":"#4e2f88","800":"#3b2366","900":"#291947","1000":"#0f0a18","a50":"#924ff726","a75":"#924ff747"},"red":{"25":"#fff0f0","50":"#ffe1e0","75":"#ffc6c5","100":"#ffa4a2","200":"#ff8583","300":"#ff6764","400":"#fa423e","500":"#ff002a","600":"#ba2623","700":"#911e1b","800":"#6e1615","900":"#4d100e","1000":"#1f0909","a50":"#fa423e29","a75":"#fa423e4c"},"yellow":{"25":"#fefbee","50":"#fdf6dc","75":"#fcefbe","100":"#fae598","200":"#f9dc78","300":"#f8d45d","400":"#f6c543","500":"#d9a337","600":"#b8802b","700":"#95611f","800":"#734615","900":"#51300c","1000":"#221403","a50":"#ffc30026","a75":"#ffc30045"}}

const chatgptDark = {"blue":{"25":"#f6fafe","50":"#e8f3fe","75":"#d1e5fd","100":"#a4cdfb","200":"#63a8f8","300":"#539af8","400":"#3a83f7","500":"#2c67c5","600":"#1f4e94","700":"#173e76","800":"#133463","900":"#0c274a","1000":"#020d18","a50":"#0285ff21","a75":"#0285ff40"},"gray":{"0":"#fff","25":"#fcfcfc","50":"#f9f9f9","75":"#f2f2f2","100":"#ececec","150":"#e8e8e8","200":"#e3e3e3","250":"#d8d8d8","300":"#cdcdcd","400":"#b4b4b4","450":"#a8a8a8","500":"#9b9b9b","550":"#818181","600":"#676767","650":"#545454","700":"#424242","750":"#2f2f2f","800":"#212121","850":"#1c1c1c","900":"#171717","925":"#121212","950":"#0d0d0d","975":"#0c0c0c","1000":"#0b0b0b"},"green":{"25":"#effaf3","50":"#def3e5","75":"#c2eace","100":"#9fddb1","200":"#83d197","300":"#6bc67f","400":"#53b559","500":"#48a04c","600":"#3a843f","700":"#2c6732","800":"#1f4e25","900":"#14361a","1000":"#041208","a50":"#04b84c26","a75":"#04b84c4a"},"orange":{"25":"#fdf5f1","50":"#fbe8db","75":"#f7d1b8","100":"#f4ba96","200":"#f1a275","300":"#ef8b57","400":"#ee7c37","500":"#d25e28","600":"#ac4f23","700":"#87401d","800":"#653218","900":"#45240d","1000":"#1f1209","a50":"#fb6a2229","a75":"#fb6a2254"},"pink":{"25":"#fef8fb","50":"#fdedf4","75":"#fcd8e7","100":"#fbbfd7","200":"#f8a6c8","300":"#f68ebc","400":"#f077af","500":"#cf6194","600":"#ab4f7a","700":"#873e60","800":"#663049","900":"#462132","1000":"#1d0f15","a50":"#ff66ad29","a75":"#ff66ad47"},"purple":{"25":"#f8f5fd","50":"#ede5fc","75":"#ddcffa","100":"#c9b1f6","200":"#b897f4","300":"#a67df2","400":"#8952ee","500":"#7849d1","600":"#643cae","700":"#4e2f88","800":"#3b2366","900":"#291947","1000":"#0f0a18","a50":"#924ff726","a75":"#924ff747"},"red":{"25":"#fff0f0","50":"#ffe1e0","75":"#ffc6c5","100":"#ffa4a2","200":"#ff8583","300":"#ff6764","400":"#fa423e","500":"#ff002a","600":"#ba2623","700":"#911e1b","800":"#6e1615","900":"#4d100e","1000":"#1f0909","a50":"#fa423e29","a75":"#fa423e4c"},"yellow":{"25":"#fefbee","50":"#fdf6dc","75":"#fcefbe","100":"#fae598","200":"#f9dc78","300":"#f8d45d","400":"#f6c543","500":"#d9a337","600":"#b8802b","700":"#95611f","800":"#734615","900":"#51300c","1000":"#221403","a50":"#ffc30026","a75":"#ffc30045"}}

const surfacesLight = {"bg-primary":"#fff","bg-secondary":"#e8e8e8","bg-tertiary":"#f3f3f3","text-primary":"#0d0d0d","text-secondary":"#5d5d5d","text-tertiary":"#8f8f8f","main-surface-primary":"#fcfcfc","main-surface-secondary":"#f9f9f9","main-surface-tertiary":"#ececec","sidebar-surface-primary":"#fcfcfc","sidebar-surface-secondary":"#ececec","sidebar-surface-tertiary":"#e3e3e3","border-default":"#0000001a","border-light":"#0000000d","border-medium":"#00000026"}
const surfacesDark = {"bg-primary":"#212121","bg-secondary":"#303030","bg-tertiary":"#414141","text-primary":"#fff","text-secondary":"#cdcdcd","text-tertiary":"#afafaf","main-surface-primary":"#000","main-surface-secondary":"#424242","main-surface-tertiary":"#676767","sidebar-surface-primary":"#000","sidebar-surface-secondary":"#303030","sidebar-surface-tertiary":"#414141","border-default":"#ffffff26","border-light":"#ffffff0d","border-medium":"#ffffff26"}

export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: chatgptLight,
      fontFamily: {
        sans: ["-apple-system-body", "ui-sans-serif", "-apple-system", "system-ui", "Segoe UI", "Helvetica", "Apple Color Emoji", "Arial", "sans-serif", "Segoe UI Emoji", "Segoe UI Symbol"],
        mono: ["ui-monospace", "SFMono-Regular", "SF Mono", "Menlo", "Consolas", "Liberation Mono", "monospace"],
      },
      borderRadius: {
        xs: '.125rem', sm: '.25rem', md: '.375rem', lg: '.5rem', xl: '.75rem',
        '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem',
      },
      boxShadow: {
        xs: '0 0 15px #0000001a',
        sm: '0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a',
        md: '0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a',
        lg: '0 10px 15px -3px #0000001a, 0 4px 6px -4px #0000001a',
      },
    },
  },
  plugins: [],
} satisfies Config
