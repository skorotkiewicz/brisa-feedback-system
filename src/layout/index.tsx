import "@/styles/style.css";
import "@/styles/nav.css";
import "@/styles/footer.css";
import "@/styles/feedback.css";
import Nav from "@/components/navigation";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <title id="title">Feedback App</title>
        <meta name="theme-color" content="#4A90E2" />
        <link rel="shortcut icon" href="/brisa.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div class="dashboard-layout">
          <Nav />
          <main class="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
