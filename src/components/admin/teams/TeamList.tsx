import { Edit2, Trash2, UserPlus, Users2, Star, BarChart3 } from 'lucide-react';
import React from 'react';

import type { Team } from '@types/teams';

interface TeamListProps {
    teams: Team[];
    onEdit: (team: Team) => void;
    onDelete: (teamId: string) => void;
    onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
}

const TeamList: React.FC<TeamListProps> = ({ teams, onEdit, onDelete, onUpdateTeam }) => {
    return (
        <div className="p-6 pb-48">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                    <tr key={team.id}>
                        <td>{team.name}</td>
                        <td>{team.members.length}</td>
                        <td>{team.leader}</td>
                        <td>
                            <button onClick={() => onEdit(team)}>Edit</button>
                        </td>
                    </tr>
                ))}
            </div>
        </div>
    );
};

export default TeamList;
