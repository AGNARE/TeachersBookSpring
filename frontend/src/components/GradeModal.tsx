import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../api/axios';

interface Student {
    id: number;
    firstName: string;
    lastName: string;
    group: {
        name: string;
    };
}

interface Subject {
    id: number;
    name: string;
    shortName: string;
}

interface Grade {
    id?: number;
    student: Student;
    subject: Subject;
    type: 'CURRENT' | 'MIDTERM' | 'FINAL' | 'EXAM';
    lessonType?: 'LECTURE' | 'SEMINAR' | 'PRACTICAL' | 'LAB';
    value: number;
    date: string;
    comment: string;
}

interface GradeModalProps {
    onClose: () => void;
    onSave: () => void;
    grade?: Grade; // Если передано - редактирование
    preselectedStudentId?: number; // Для быстрого создания
    preselectedSubjectId?: number;
}

const GradeModal: React.FC<GradeModalProps> = ({ onClose, onSave, grade, preselectedStudentId, preselectedSubjectId }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const [selectedStudent, setSelectedStudent] = useState<number>(grade?.student.id || preselectedStudentId || 0);
    const [selectedSubject, setSelectedSubject] = useState<number>(grade?.subject.id || preselectedSubjectId || 0);
    const [type, setType] = useState<string>(grade?.type || 'CURRENT');
    const [lessonType, setLessonType] = useState<string>(grade?.lessonType || '');
    const [value, setValue] = useState<string>(grade?.value.toString() || '');
    const [date, setDate] = useState<string>(grade?.date || new Date().toISOString().split('T')[0]);
    const [comment, setComment] = useState<string>(grade?.comment || '');

    const [loading, setLoading] = useState(false);

    const lessonTypes = [
        { value: 'LECTURE', label: 'Лекция' },
        { value: 'SEMINAR', label: 'Семинар' },
        { value: 'PRACTICAL', label: 'Практическое' },
        { value: 'LAB', label: 'Лабораторная' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentsRes, subjectsRes] = await Promise.all([
                api.get('/students'),
                api.get('/subjects')
            ]);
            setStudents(studentsRes.data);
            setSubjects(subjectsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedStudent || !selectedSubject || !value) {
            alert('Заполните обязательные поля');
            return;
        }

        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue < 1 || numValue > 10) {
            alert('Оценка должна быть целым числом от 1 до 10');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                student: { id: selectedStudent },
                subject: { id: selectedSubject },
                type,
                lessonType: lessonType || null,
                value: numValue,
                date,
                comment: comment || null
            };

            if (grade?.id) {
                await api.put(`/grades/${grade.id}`, payload);
            } else {
                await api.post('/grades', payload);
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving grade:', error);
            alert('Ошибка при сохранении оценки');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                        {grade ? 'Редактировать оценку' : 'Выставить оценку'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Студент */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Студент <span className="text-red-500">*</span></label>
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(parseInt(e.target.value))}
                            disabled={!!grade} // Нельзя менять студента при редактировании
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={0}>Выберите студента</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.lastName} {s.firstName} ({s.group?.name})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Предмет */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Предмет <span className="text-red-500">*</span></label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(parseInt(e.target.value))}
                            disabled={!!grade}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={0}>Выберите предмет</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.shortName} - {s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Тип оценки */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Тип контроля</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['CURRENT', 'MIDTERM', 'FINAL', 'EXAM'].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${type === t
                                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                        }`}
                                >
                                    {t === 'CURRENT' && 'Текущая'}
                                    {t === 'MIDTERM' && 'Рубежная'}
                                    {t === 'FINAL' && 'Итоговая'}
                                    {t === 'EXAM' && 'Экзамен'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Тип занятия (только для текущих) */}
                    {type === 'CURRENT' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Тип занятия</label>
                            <div className="grid grid-cols-2 gap-2">
                                {lessonTypes.map((lt) => (
                                    <button
                                        key={lt.value}
                                        type="button"
                                        onClick={() => setLessonType(lt.value === lessonType ? '' : lt.value)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${lessonType === lt.value
                                            ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                            }`}
                                    >
                                        {lt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Оценка и Дата */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Оценка (1-10) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                step="1"
                                min="1"
                                max="10"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                                placeholder="8"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Дата</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Комментарий */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Комментарий (необязательно)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                            placeholder="Например: Отличная работа на семинаре"
                        />
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
                            <span>Сохранить</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GradeModal;
