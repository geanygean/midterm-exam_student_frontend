'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '@/app/styles/detail.css';

interface StudentDetail {
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
  section: {
    name: string;
    subject: {
      description: string;
    };
  };
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`https://localhost:7127/api/students/${id}`);
        if (!res.ok) throw new Error('Failed to fetch student');
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        setError('Error fetching student');
      }
    };

    fetchStudent();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!student) return <div>Loading...</div>;

  return (
    <div className="student-detail-container">
      <h1>{student.firstName} {student.lastName}</h1>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Section:</strong> {student.section.name}</p>
      <p><strong>Subject:</strong> {student.section.subject.description}</p>

      <div className="back-link-holder">
        <Link href="/students" className="back-link">
          ← Back to Students List
        </Link>
      </div>
    </div>
  );
}
