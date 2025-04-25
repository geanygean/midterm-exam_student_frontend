'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/app/styles/section.css';

interface Section {
  sectionId: number;
  name: string;
  subject: {
    description: string;
  };
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch('https://localhost:7127/api/sections');
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setSections(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load sections.');
      }
    };
    fetchSections();
  }, []);

  return (
    <div className="sections-container">
      <h1 className="sections-header">📑 Sections List</h1>

      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <table className="sections-table">
          <thead>
            <tr>
              <th>Section Name</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {sections.length > 0 ? (
              sections.map((s) => (
                <tr key={s.sectionId}>
                  <td>{s.name}</td>
                  <td>{s.subject?.description ?? '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center">
                  No sections available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="back-link-holder">
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
