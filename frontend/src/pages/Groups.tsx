import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react';
import api from '../api/axios';
import GroupModal from '../components/GroupModal';
import ConfirmDialog from '../components/ConfirmDialog';

interface Group {
    id: number;
    name: string;
    studentCount?: number;
}

const Groups = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedGroup(null);
        setIsModalOpen(true);
    };

    const handleEdit = (group: Group) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (group: Group) => {
        // Fetch student count for this group
        try {
            const studentsResponse = await api.get('/students');
            const studentsInGroup = studentsResponse.data.filter(
                (s: any) => s.group && s.group.id === group.id
            );
            setGroupToDelete({ ...group, studentCount: studentsInGroup.length });
            setDeleteConfirmOpen(true);
        } catch (error) {
            console.error('Error fetching students:', error);
            setGroupToDelete(group);
            setDeleteConfirmOpen(true);
        }
    };

    const handleDeleteConfirm = async () => {
        if (groupToDelete) {
            try {
                await api.delete(`/groups/${groupToDelete.id}`);
                setGroups(groups.filter(g => g.id !== groupToDelete.id));
                setDeleteConfirmOpen(false);
                setGroupToDelete(null);
            } catch (error) {
                console.error('Error deleting group:', error);
                alert('Ошибка при удалении группы');
            }
        }
    };

    const handleSave = () => {
        fetchGroups();
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-6 text-center text-slate-500">Загрузка списка групп...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Группы</h1>
                    <p className="text-slate-500">Управление учебными группами</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Добавить группу</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Поиск по названию группы..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Название группы</th>
                                <th className="px-6 py-4 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredGroups.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                                        Группы не найдены
                                    </td>
                                </tr>
                            ) : (
                                filteredGroups.map((group) => (
                                    <tr key={group.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <span className="text-slate-400 text-sm">#{group.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{group.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(group)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(group)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <GroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                group={selectedGroup}
            />

            <ConfirmDialog
                isOpen={deleteConfirmOpen}
                title="Удалить группу?"
                message={
                    groupToDelete
                        ? `Вы уверены, что хотите удалить группу "${groupToDelete.name}"?${groupToDelete.studentCount && groupToDelete.studentCount > 0
                            ? `\n\n⚠️ В группе ${groupToDelete.studentCount} ${groupToDelete.studentCount === 1 ? 'студент' : groupToDelete.studentCount < 5 ? 'студента' : 'студентов'}. Все студенты будут удалены!`
                            : ''
                        }`
                        : ''
                }
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteConfirmOpen(false)}
            />
        </div>
    );
};

export default Groups;
