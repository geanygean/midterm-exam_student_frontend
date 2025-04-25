import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './styles/globals.css';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Management System",
  description: "Manage students with full CRUD functionality",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header>
          <nav>
            <div className="logo">Student Management</div>
            <div className="nav-links">
              <a href="/">Home</a>
              <a href="/students">Students</a>
              <a href="/sections">Sections</a>
              <a href="/members">Members</a>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="footer">
  <p>&copy; 2025 Student Management System. All rights reserved.</p>
</footer>
      </body>
    </html>
  );
}