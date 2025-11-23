import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../api/axios';

interface Subject {
    id: number;
    name: string;
    shortName: string;
}

interface Group {
    id: number;
    name: string;
}

interface User {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
}

interface DisciplineGroup {
    id: number;
    subject: Subject;
    group: Group;
    teacher: User;
    semester: number;
    year: number;
}

interface AssignmentEditModalProps {
    assignment: DisciplineGroup;
    onClose: () => void;
    onSave: () => void;
}

const AssignmentEditModal: React.FC<AssignmentEditModalProps> = ({ assignment, onClose, onSave }) => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);

    const [selectedSubject, setSelectedSubject] = useState<number>(assignment.subject.id);
    const [selectedGroup, setSelectedGroup] = useState<number>(assignment.group.id);
    const [selectedTeacher, setSelectedTeacher] = useState<number>(assignment.teacher.id);
    const [semester, setSemester] = useState<number>(assignment.semester);
    const [year, setYear] = useState<number>(assignment.year);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subjectsRes, groupsRes, teachersRes] = await Promise.all([
                api.get('/subjects'),
                api.get('/groups'),
                api.get('/users/teachers')
            ]);

            setSubjects(subjectsRes.data);
            setGroups(groupsRes.data);
            setTeachers(teachersRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSubject || !selectedGroup || !selectedTeacher) {
            alert('Заполните все обязательные поля');
            return;
        }

        setLoading(true);
        try {
            await api.put(`/discipline-groups/${assignment.id}`, {
                subject: { id: selectedSubject },
                group: { id: selectedGroup },
                teacher: { id: selectedTeacher },
                semester,
                year
            });

            onSave();
            onClose();
        } catch (error) {
            console.error('Error updating assignment:', error);
            alert('Ошибка при обновлении назначения');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Редактировать назначение</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Дисциплина <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(parseInt(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={0}>Выберите дисциплину</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.shortName} - {s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Группа <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(parseInt(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={0}>Выберите группу</option>
                            {groups.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Преподаватель <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(parseInt(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={0}>Выберите преподавателя</option>
                            {teachers.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.firstName} {t.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Семестр
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="8"
                                value={semester}
                                onChange={(e) => setSemester(parseInt(e.target.value))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Год
                            </label>
                            <input
                                type="number"
                                min="2020"
                                max="2030"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{loading ? 'Сохранение...' : 'Сохранить'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignmentEditModal;
