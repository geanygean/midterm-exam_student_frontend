'use client';

import React from 'react';
import '@/app/styles/member.css';

type Member = {
  id: number;
  name: string;
  role: string;
  image: string;
};

const members: Member[] = [
  {
    id: 1,
    name: 'Arvegean J. Isagunde',
    role: 'UI/Front-end ',
    image: '/images/aaron.png',
  },
  {
    id: 2,
    name: 'Errol Montoya',
    role: 'Back-end/API',
    image: '/images/kervie.png',
  },
  {
    id: 3,
    name: 'Renz Jovenez',
    role: 'Database',
    image: '/images/martin.png',
  },
];

export default function MembersPage() {
  return (
    <div className="members-container">
      <h1 className="members-header">Meet the Team</h1>
      <div className="members-list">
        {members.map((member, index) => (
          <div className={`member-card position-${index + 1}`} key={member.id}>
            <img src={member.image} alt={member.name} className="member-image" />
            <h3 className="member-name">{member.name}</h3>
            <p className="member-role">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
