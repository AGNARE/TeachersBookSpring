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

interface Attendance {
    id?: number;
    student: Student;
    subject: Subject;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    date: string;
    comment: string;
}

interface AttendanceModalProps {
    onClose: () => void;
    onSave: () => void;
    attendance?: Attendance;
    preselectedStudentId?: number;
    preselectedSubjectId?: number;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ onClose, onSave, attendance, preselectedStudentId, preselectedSubjectId }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const [selectedStudent, setSelectedStudent] = useState<number>(attendance?.student.id || preselectedStudentId || 0);
    const [selectedSubject, setSelectedSubject] = useState<number>(attendance?.subject.id || preselectedSubjectId || 0);
    const [status, setStatus] = useState<string>(attendance?.status || 'PRESENT');
    const [date, setDate] = useState<string>(attendance?.date || new Date().toISOString().split('T')[0]);
    const [comment, setComment] = useState<string>(attendance?.comment || '');

    const [loading, setLoading] = useState(false);

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

        if (!selectedStudent || !selectedSubject) {
            alert('Заполните обязательные поля');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                student: { id: selectedStudent },
                subject: { id: selectedSubject },
                status,
                date,
                comment
            };

            if (attendance?.id) {
                await api.put(`/attendance/${attendance.id}`, payload);
            } else {
                await api.post('/attendance', payload);
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Ошибка при сохранении посещаемости');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'PRESENT': return 'bg-green-100 text-green-700 border-green-500';
            case 'ABSENT': return 'bg-red-100 text-red-700 border-red-500';
            case 'LATE': return 'bg-yellow-100 text-yellow-700 border-yellow-500';
            case 'EXCUSED': return 'bg-blue-100 text-blue-700 border-blue-500';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
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
                        {attendance ? 'Редактировать посещаемость' : 'Отметить посещаемость'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Студент */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Студент</label>
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(parseInt(e.target.value))}
                            disabled={!!attendance}
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Предмет</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(parseInt(e.target.value))}
                            disabled={!!attendance}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={0}>Выберите предмет</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.shortName} - {s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Статус */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Статус</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'PRESENT', label: 'Присутствовал' },
                                { id: 'ABSENT', label: 'Отсутствовал' },
                                { id: 'LATE', label: 'Опоздал' },
                                { id: 'EXCUSED', label: 'Уважительная' }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setStatus(s.id)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${status === s.id
                                            ? getStatusColor(s.id) + ' border-2'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Дата */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Дата</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Комментарий */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Комментарий</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                            placeholder="Например: Опоздал на 15 минут"
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

export default AttendanceModal;
