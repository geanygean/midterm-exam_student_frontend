'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/student.css';

interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  section: {
    name: string;
    subject: {
      description: string;
    };
  };
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch('https://localhost:7127/api/students');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteStudent = async (studentId: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    if (!confirm('This action is permanent. Do you really want to proceed?')) return;

    const res = await fetch(`https://localhost:7127/api/students/${studentId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Student deleted successfully.');
      fetchStudents();
    } else {
      alert('Failed to delete student.');
    }
  };

  return (
    <div className="students-container">
      <h1 className="students-header">
        <span>📚</span> Students List
      </h1>

      <Link href="/students/create" className="btn-add">
        ➕ Add Student
      </Link>

      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Section</th>
              <th>Subject</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={s.studentId} className="clickable-row">
                  <td>
                    <Link href={`/studentdetail/${s.studentId}`} passHref>
                      <div className="row-content">
                        {s.firstName} {s.lastName}
                      </div>
                    </Link>
                  </td>
                  <td>
                    <Link href={`/studentdetail/${s.studentId}`} passHref>
                      <div className="row-content">
                        {s.section?.name ?? 'N/A'}
                      </div>
                    </Link>
                  </td>
                  <td>
                    <Link href={`/studentdetail/${s.studentId}`} passHref>
                      <div className="row-content">
                        {s.section?.subject?.description ?? 'N/A'}
                      </div>
                    </Link>
                  </td>
                  <td className="text-center">
                    <Link href={`/students/edit/${s.studentId}`} className="btn-edit">
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStudent(s.studentId);
                      }}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No students found.
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
