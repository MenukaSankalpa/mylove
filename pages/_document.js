import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  colors: {
                    primary: '#7C3AED',
                    glass: 'rgba(255,255,255,0.08)'
                  },
                  keyframes: {
                    fall: { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(120vh)' } },
                    blink: { '0%, 49%, 100%': { opacity: '0' }, '25%, 75%': { opacity: '1' } },
                    santaFly: { '0%': { transform: 'translateX(-150%)' }, '100%': { transform: 'translateX(120%)' } }
                  },
                  animation: {
                    fall: 'fall linear infinite',
                    blink: 'blink 1s infinite',
                    santaFly: 'santaFly 10s linear infinite'
                  }
                }
              }
            }`
          }}
        />
      </Head>
      <body className="bg-gradient-to-br from-white via-purple-200 to-purple-400 dark:from-black dark:via-[#0b0518] dark:to-black text-black dark:text-white overflow-x-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
