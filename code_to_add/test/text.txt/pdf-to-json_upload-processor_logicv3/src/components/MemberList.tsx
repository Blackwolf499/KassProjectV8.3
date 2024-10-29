import React from 'react';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import type { MemberData } from '../types';

interface MemberListProps {
  members: MemberData[];
  onSelectMember: (memberId: string) => void;
  selectedMemberId: string | null;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  onSelectMember,
  selectedMemberId,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900">Members</h2>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelectMember(member.id)}
            className={`w-full text-left p-4 rounded-lg border transition-colors ${
              selectedMemberId === member.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{member.name}</h3>
                {member.role && (
                  <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                )}
                {member.department && (
                  <p className="text-sm text-gray-500">{member.department}</p>
                )}
              </div>
              <div className="text-xs text-gray-500">ID: {member.id}</div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {member.contact?.email && (
                <div className="flex items-center space-x-1 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{member.contact.email}</span>
                </div>
              )}
              {member.contact?.phone && (
                <div className="flex items-center space-x-1 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{member.contact.phone}</span>
                </div>
              )}
              {member.joinDate && (
                <div className="flex items-center space-x-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{member.joinDate}</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};