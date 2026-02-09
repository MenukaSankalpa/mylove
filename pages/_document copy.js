import { Html, Head, Main, NextScript } from 'next/document'


export default function Document() {
return (
<Html lang="en">
<Head>
<script src="https://cdn.tailwindcss.com"></script>
<script
dangerouslySetInnerHTML={{
__html: `tailwind.config = {
darkMode: 'class',
theme: {
extend: {
colors: {
primary: '#7C3AED',
glass: 'rgba(255,255,255,0.08)'
}
}
}
}`
}}
/>
</Head>
<body className="bg-gradient-to-br from-black via-[#0b0518] to-black text-white overflow-x-hidden">
<Main />
<NextScript />
</body>
</Html>
)
}