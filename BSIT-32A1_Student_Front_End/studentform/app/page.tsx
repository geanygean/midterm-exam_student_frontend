import Link from "next/link";

export default function Home() {
  return (
    <div className="hero">
      <h1>
        Welcome to the <span style={{ color: "var(--color-primary)" }}>Student Management System</span>
      </h1>
      <p>
        Seamlessly and intuitive way to keep your school organized.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/students" className="btn">
          View Students
        </Link>
        <Link href="/sections" className="btn" style={{ backgroundColor: "white", color: "var(--color-primary)", border: "2px solid var(--color-primary)" }}>
          View Sections
        </Link>
      </div>
    </div>
  );
}
