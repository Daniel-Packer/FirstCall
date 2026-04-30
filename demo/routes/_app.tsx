import { type PageProps } from "$fresh/server.ts";
import DemoBar from "../islands/DemoBar.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ClearPath | FirstCall</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="https://cdn.tailwindcss.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    fontFamily: {
                      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                    },
                    colors: {
                      brand: {
                        navy: '#0A1224',
                        'navy-2': '#131F38',
                        blue: '#2D5BFF',
                        'blue-hover': '#1E47E0',
                        'blue-soft': '#EEF2FF',
                        slate: '#F5F7FB',
                      },
                    },
                  },
                },
              };
            `,
          }}
        />
      </head>
      <body class="bg-brand-slate text-brand-navy min-h-screen font-sans antialiased">
        <Component />
        <DemoBar />
      </body>
    </html>
  );
}
