'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import '@/app/styles/edit.css';

interface Section {
  sectionId: number;
  name: string;
  subject: {
    description: string;
  };
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  sectionId: number;
}

export default function EditStudent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [subject, setSubject] = useState<string>('');
  const router = useRouter();
  const { id } = useParams();

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

  useEffect(() => {
    if (sections.length > 0 && id) {
      const fetchStudent = async () => {
        try {
          const res = await fetch(`https://localhost:7127/api/students/${id}`);
          if (!res.ok) throw new Error(`Failed to fetch student: ${res.status}`);
          const studentData = await res.json();
          setFirstName(studentData.firstName);
          setLastName(studentData.lastName);
          setEmail(studentData.email);
          setSelectedSectionId(studentData.sectionId);

          const selectedSection = sections.find(
            (sec) => sec.sectionId === studentData.sectionId
          );
          if (selectedSection) {
            setSubject(selectedSection.subject.description);
          }
        } catch (error) {
          console.error('Error fetching student:', error);
          alert('Failed to load student data. Please try again later.');
        }
      };
      fetchStudent();
    }
  }, [sections, id]);

  const selectedSection = sections.find(
    (sec) => sec.sectionId === selectedSectionId
  );

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sectionId = Number(e.target.value);
    setSelectedSectionId(sectionId);

    const section = sections.find((sec) => sec.sectionId === sectionId);
    if (section) {
      setSubject(section.subject.description);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSectionId) {
      alert('Please select a section.');
      return;
    }

    const confirmation = window.confirm('Are you sure you want to update this student?');
    if (!confirmation) return;

    try {
      const res = await fetch(`https://localhost:7127/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          firstName,
          lastName,
          email,
          sectionId: selectedSectionId,
          studentSections: [
            {
              Section: {
                sectionId: selectedSectionId,
                name: selectedSection?.name,
                subject: {
                  description: selectedSection?.subject.description,
                },
              },
            },
          ],
        }),
      });

      if (res.ok) {
        alert('Student updated successfully!');
        router.push('/students');
      } else {
        const errorText = await res.text();
        console.error('Server error:', errorText);
        alert(`Failed to update student. Server says: ${errorText}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('An error occurred while updating the student.');
    }
  };

  return (
    <div className="edit-container">
      <h1 className="edit-header">Edit Student</h1>
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input
            className="form-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input
            className="form-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Section</label>
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
          <div className="subject-info">
            <span className="subject-label">Subject:</span> {subject}
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="submit-button">Update Student</button>
          <button type="button" onClick={() => router.push('/students')} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
