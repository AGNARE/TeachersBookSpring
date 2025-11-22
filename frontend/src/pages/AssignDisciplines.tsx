import { useState, useEffect } from 'react';
import { Plus, Trash2, UserCircle } from 'lucide-react';
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

const AssignDisciplines = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [assignments, setAssignments] = useState<DisciplineGroup[]>([]);

    const [selectedSubject, setSelectedSubject] = useState<number>(0);
    const [selectedGroup, setSelectedGroup] = useState<number>(0);
    const [semester, setSemester] = useState<number>(1);
    const [year, setYear] = useState<number>(new Date().getFullYear());

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subjectsRes, groupsRes, assignmentsRes] = await Promise.all([
                api.get('/subjects'),
                api.get('/groups'),
                api.get('/discipline-groups')
            ]);

            setSubjects(subjectsRes.data);
            setGroups(groupsRes.data);
            setAssignments(assignmentsRes.data);

            // TODO: Добавить эндпоинт для получения преподавателей
            // const teachersRes = await api.get('/users/teachers');
            // setTeachers(teachersRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSubject || !selectedGroup) {
            alert('Заполните все обязательные поля');
            return;
        }

        setLoading(true);
        try {
            await api.post('/discipline-groups', {
                subject: { id: selectedSubject },
                group: { id: selectedGroup },
                // teacher omitted; nullable in DB
                semester,
                year
            });

            fetchData();
            // Reset form
            setSelectedSubject(0);
            setSelectedGroup(0);
            setSemester(1);
            setYear(new Date().getFullYear());
        } catch (error) {
            console.error('Error assigning discipline:', error);
            alert('Ошибка при назначении дисциплины');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить это назначение?')) {
            try {
                await api.delete(`/discipline-groups/${id}`);
                setAssignments(assignments.filter(a => a.id !== id));
            } catch (error) {
                console.error('Error deleting assignment:', error);
                alert('Ошибка при удалении');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Назначение дисциплин</h1>
                <p className="text-slate-500">Привязка дисциплин к группам с назначением преподавателя</p>
            </div>

            {/* Форма назначения */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Новое назначение</h2>
                <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <Plus className="w-5 h-5" />
                            <span>{loading ? 'Назначение...' : 'Назначить'}</span>
                        </button>
                    </div>
                </form>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    <strong>Примечание:</strong> Назначение преподавателя временно отключено. Все назначения будут для текущего пользователя (admin).
                </div>
            </div>

            {/* Список назначений */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Текущие назначения</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Дисциплина</th>
                                <th className="px-6 py-4">Группа</th>
                                <th className="px-6 py-4">Преподаватель</th>
                                <th className="px-6 py-4">Семестр</th>
                                <th className="px-6 py-4">Год</th>
                                <th className="px-6 py-4 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {assignments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        Нет назначений
                                    </td>
                                </tr>
                            ) : (
                                assignments.map((assignment) => (
                                    <tr key={assignment.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{assignment.subject.shortName}</div>
                                            <div className="text-sm text-slate-500">{assignment.subject.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium">
                                                {assignment.group.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <UserCircle className="w-5 h-5 text-slate-400" />
                                                <span className="text-slate-700">
                                                    {assignment.teacher.firstName} {assignment.teacher.lastName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{assignment.semester}</td>
                                        <td className="px-6 py-4 text-slate-600">{assignment.year}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(assignment.id)}
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
        </div>
    );
};

export default AssignDisciplines;
