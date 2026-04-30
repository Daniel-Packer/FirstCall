import { type PageProps } from "$fresh/server.ts";
import DemoBar from "../islands/DemoBar.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ClearPath | First Community Bank</title>
        <script src="https://cdn.tailwindcss.com" />
      </head>
      <body class="bg-slate-50 text-gray-900 min-h-screen">
        <Component />
        <DemoBar />
      </body>
    </html>
  );
}
