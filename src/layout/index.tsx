import "@/styles/style.css";
import "@/styles/nav.css";
import "@/styles/footer.css";
import "@/styles/feedback.css";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <title id="title">Feedback App</title>
        <meta name="theme-color" content="#4A90E2" />
        <link rel="shortcut icon" href="/brisa.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
