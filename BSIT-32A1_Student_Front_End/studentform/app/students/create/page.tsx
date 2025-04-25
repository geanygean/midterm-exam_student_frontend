'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/create.css';

interface Section {
  sectionId: number;
  name: string;
  subject: {
    description: string;
  };
}

export default function CreateStudent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [subject, setSubject] = useState<string>('');
  const [studentSection, setStudentSection] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch('https://localhost:7127/api/sections');
        if (!res.ok) throw new Error(`Failed to fetch sections: ${res.status}`);
        const data = await res.json();
        setSections(data);
      } catch (error) {
        console.error('Error fetching sections:', error);
        alert('Failed to load sections. Please try again later.');
      }
    };
    fetchSections();
  }, []);

  const selectedSection = sections.find(sec => sec.sectionId === selectedSectionId);

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sectionId = Number(e.target.value);
    if (!sectionId) {
      setSelectedSectionId(null);
      setSubject('');
      setStudentSection('');
      return;
    }

    setSelectedSectionId(sectionId);

    const section = sections.find(sec => sec.sectionId === sectionId);
    if (section) {
      setSubject(section.subject.description);
      setStudentSection(`${sectionId}-${Math.random().toString(36).substring(7)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedSectionId) {
      alert('Please select a section.');
      return;
    }
  
    const confirmation = window.confirm('Are you sure you want to add this student?');
    if (!confirmation) return;
  
    try {
      const res = await fetch('https://localhost:7127/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          sectionId: selectedSectionId,
          studentSection,
          subject,
        }),
      });
  
      if (res.ok) {
        alert('Student added successfully!');
        router.push('/students');
      } else {
        const errorText = await res.text();
        console.error('Server error:', errorText);
        alert(`Failed to add student. Server says: ${errorText}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('An error occurred while adding the student.');
    }
  };
  
  return (
    <div className="form-container">
      <h1 className="form-title">Add Student</h1>
      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-group">
          <label>First Name</label>
          <input
            className="form-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Enter first name"
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            className="form-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Enter last name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter email address"
          />
        </div>
        <div className="form-group">
          <label>Section</label>
          <select
            className="form-input"
            value={selectedSectionId ?? ''}
            onChange={handleSectionChange}
            required
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section.sectionId} value={section.sectionId}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
        {subject && (
          <div className="form-meta">
            <strong>Subject:</strong> {subject}
          </div>
        )}
        {studentSection && (
          <div className="form-meta">
            <strong>Student Section:</strong> {studentSection}
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="btn-submit">Add Student</button>
          <button
            type="button"
            onClick={() => router.push('/students')}
            className="btn-cancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
