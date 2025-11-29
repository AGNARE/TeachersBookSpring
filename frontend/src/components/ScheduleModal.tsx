import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

interface Group {
    id: number;
    name: string;
}

interface Subject {
    id: number;
    name: string;
    shortName: string;
}

interface Teacher {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
}

interface ScheduleItem {
    id?: number;
    date: string;
    startTime: string;
    endTime: string;
    groups: Group[];
    subject: Subject;
    teacher: Teacher;
    lessonType: 'LECTURE' | 'LAB' | 'PRACTICE';
}

interface ScheduleItemDTO {
    date: string;
    startTime: string;
    endTime: string;
    groupIds: number[];
    subjectId: number;
    teacherId: number;
    lessonType: string;
}

interface ScheduleModalProps {
    item: ScheduleItem | null;
    onClose: () => void;
    onSave: () => void;
}

const ScheduleModal = ({ item, onClose, onSave }: ScheduleModalProps) => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
    const [subjectId, setSubjectId] = useState<number | null>(null);
    const [teacherId, setTeacherId] = useState<number | null>(null);
    const [lessonType, setLessonType] = useState<string>('LECTURE');
    const [loading, setLoading] = useState(false);

    // Lists for dropdowns
    const [groups, setGroups] = useState<Group[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    const lessonTypes = [
        { value: 'LECTURE', label: 'Лекция' },
        { value: 'LAB', label: 'Лабораторная' },
        { value: 'PRACTICE', label: 'Практика' }
    ];

    useEffect(() => {
        fetchDropdownData();
    }, []);

    useEffect(() => {
        if (item) {
            setDate(item.date);
            setStartTime(item.startTime);
            setEndTime(item.endTime);
            setSelectedGroupIds(item.groups.map(g => g.id));
            setSubjectId(item.subject.id);
            setTeacherId(item.teacher.id);
            setLessonType(item.lessonType);
        } else {
            // Set defaults for new item
            const today = new Date().toISOString().split('T')[0];
            setDate(today);
            setStartTime('09:00');
            setEndTime('10:30');
            setSelectedGroupIds([]);
            setSubjectId(null);
            setTeacherId(null);
            setLessonType('LECTURE');
        }
    }, [item]);

    const fetchDropdownData = async () => {
        try {
            const [groupsRes, subjectsRes, teachersRes] = await Promise.all([
                api.get('/groups'),
                api.get('/subjects'),
                api.get('/users/teachers')
            ]);
            setGroups(groupsRes.data);
            setSubjects(subjectsRes.data);
            setTeachers(teachersRes.data);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
            alert('Ошибка при загрузке данных');
        }
    };

    const handleGroupToggle = (groupId: number) => {
        setSelectedGroupIds(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!subjectId || !teacherId || selectedGroupIds.length === 0) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        if (startTime >= endTime) {
            alert('Время окончания должно быть позже времени начала');
            return;
        }

        const scheduleDTO: ScheduleItemDTO = {
            date,
            startTime,
            endTime,
            groupIds: selectedGroupIds,
            subjectId,
            teacherId,
            lessonType
        };

        setLoading(true);
        try {
            if (item?.id) {
                await api.put(`/schedule/${item.id}`, scheduleDTO);
            } else {
                await api.post('/schedule', scheduleDTO);
            }
            onSave();
            onClose();
        } catch (error: any) {
            console.error('Error saving schedule:', error);
            const message = error.response?.data?.message || 'Ошибка при сохранении расписания';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const getTeacherName = (teacher: Teacher) => {
        if (teacher.firstName && teacher.lastName) {
            return `${teacher.lastName} ${teacher.firstName}`;
        }
        return teacher.username;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {item ? 'Редактировать занятие' : 'Добавить занятие'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Дата <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Тип занятия <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={lessonType}
                                onChange={(e) => setLessonType(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {lessonTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Время начала <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Время окончания <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Дисциплина <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={subjectId || ''}
                            onChange={(e) => setSubjectId(Number(e.target.value))}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Выберите дисциплину</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name} ({subject.shortName})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Преподаватель <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={teacherId || ''}
                            onChange={(e) => setTeacherId(Number(e.target.value))}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Выберите преподавателя</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {getTeacherName(teacher)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Группы <span className="text-red-500">*</span> (выберите минимум одну)
                        </label>
                        <div className="border border-slate-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-white">
                            {groups.length === 0 ? (
                                <p className="text-slate-500 text-sm">Загрузка групп...</p>
                            ) : (
                                <div className="space-y-2">
                                    {groups.map(group => (
                                        <label
                                            key={group.id}
                                            className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedGroupIds.includes(group.id)}
                                                onChange={() => handleGroupToggle(group.id)}
                                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded flex-shrink-0"
                                            />
                                            <span className="text-sm text-slate-700 font-medium">
                                                {group.name || `Группа ${group.id}`}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        {selectedGroupIds.length > 0 && (
                            <p className="text-sm text-slate-500 mt-1">
                                Выбрано групп: {selectedGroupIds.length}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading || selectedGroupIds.length === 0 || !subjectId || !teacherId}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;
