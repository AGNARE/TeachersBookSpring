import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

interface Group {
    id: number;
    name: string;
}

interface Student {
    id?: number;
    firstName: string;
    lastName: string;
    middleName: string;
    dateBorn: string;
    group: Group | null;
}

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    student?: Student | null;
}

const StudentModal = ({ isOpen, onClose, onSave, student }: StudentModalProps) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [dateBorn, setDateBorn] = useState('');
    const [groupId, setGroupId] = useState<string>('');
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchGroups();
            if (student) {
                setFirstName(student.firstName);
                setLastName(student.lastName);
                setMiddleName(student.middleName || '');
                setDateBorn(student.dateBorn ? student.dateBorn.split('T')[0] : '');
                setGroupId(student.group?.id.toString() || '');
            } else {
                resetForm();
            }
        }
    }, [isOpen, student]);

    const fetchGroups = async () => {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setMiddleName('');
        setDateBorn('');
        setGroupId('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const studentData = {
            firstName,
            lastName,
            middleName,
            dateBorn: dateBorn || null,
            group: groupId ? { id: parseInt(groupId) } : null
        };

        try {
            if (student?.id) {
                await api.put(`/students/${student.id}`, studentData);
            } else {
                await api.post('/students', studentData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Ошибка при сохранении');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900">
                        {student ? 'Редактировать студента' : 'Новый студент'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Фамилия</label>
                        <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Имя</label>
                        <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Отчество</label>
                        <input
                            type="text"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Дата рождения</label>
                        <input
                            type="date"
                            value={dateBorn}
                            onChange={(e) => setDateBorn(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Группа</label>
                        <select
                            required
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Выберите группу</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4 flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentModal;
