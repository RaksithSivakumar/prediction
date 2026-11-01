
import "./globals.css";

export const metadata = {
  title: "AI_disease_prediction",
  description: "AI-powered disease prediction and health assistance system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
