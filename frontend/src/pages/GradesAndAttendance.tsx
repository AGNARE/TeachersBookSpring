import { useState, useEffect } from 'react';
import {
    GraduationCap,
    Calendar,
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle
} from 'lucide-react';
import api from '../api/axios';
import GradeModal from '../components/GradeModal';
import AttendanceModal from '../components/AttendanceModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import StudentStatistics from '../components/StudentStatistics';

interface Student {
    id: number;
    firstName: string;
    lastName: string;
    group: {
        id: number;
        name: string;
    };
}

interface Subject {
    id: number;
    name: string;
    shortName: string;
}

interface Grade {
    id: number;
    student: Student;
    subject: Subject;
    type: 'CURRENT' | 'MIDTERM' | 'FINAL' | 'EXAM';
    value: number;
    date: string;
    comment: string;
}

interface Attendance {
    id: number;
    student: Student;
    subject: Subject;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    date: string;
    comment: string;
}

const GradesAndAttendance = () => {
    const [activeTab, setActiveTab] = useState<'grades' | 'attendance'>('grades');

    // Data
    const [grades, setGrades] = useState<Grade[]>([]);
    const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    // Statistics Data
    const [gradeStats, setGradeStats] = useState<any>(null);
    const [attendanceStats, setAttendanceStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(false);

    // Modals
    const [showGradeModal, setShowGradeModal] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [editingGrade, setEditingGrade] = useState<Grade | undefined>(undefined);
    const [editingAttendance, setEditingAttendance] = useState<Attendance | undefined>(undefined);
    const [deletingItem, setDeletingItem] = useState<{ id: number, type: 'grade' | 'attendance' } | null>(null);

    // Filters
    const [selectedSubject, setSelectedSubject] = useState<number>(0);
    const [selectedStudent, setSelectedStudent] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchInitialData();
        fetchGrades();
        fetchAttendance();
    }, []);

    // Fetch statistics when selected student changes
    useEffect(() => {
        if (selectedStudent !== 0) {
            fetchStudentStatistics(selectedStudent);
        } else {
            setGradeStats(null);
            setAttendanceStats(null);
        }
    }, [selectedStudent]);

    const fetchInitialData = async () => {
        try {
            const [studentsRes, subjectsRes] = await Promise.all([
                api.get('/students'),
                api.get('/subjects')
            ]);
            setStudents(studentsRes.data);
            setSubjects(subjectsRes.data);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    const fetchGrades = async () => {
        try {
            const response = await api.get('/grades');
            setGrades(response.data);
            // Refresh stats if a student is selected
            if (selectedStudent !== 0) fetchStudentStatistics(selectedStudent);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    const fetchAttendance = async () => {
        try {
            const response = await api.get('/attendance');
            setAttendanceList(response.data);
            // Refresh stats if a student is selected
            if (selectedStudent !== 0) fetchStudentStatistics(selectedStudent);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const fetchStudentStatistics = async (studentId: number) => {
        setLoadingStats(true);
        try {
            const [gradeStatsRes, attendanceStatsRes] = await Promise.all([
                api.get(`/grades/statistics/student/${studentId}`),
                api.get(`/attendance/statistics/student/${studentId}`)
            ]);
            setGradeStats(gradeStatsRes.data);
            setAttendanceStats(attendanceStatsRes.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingItem) return;

        try {
            if (deletingItem.type === 'grade') {
                await api.delete(`/grades/${deletingItem.id}`);
                fetchGrades();
            } else {
                await api.delete(`/attendance/${deletingItem.id}`);
                fetchAttendance();
            }
            setDeletingItem(null);
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Ошибка при удалении');
        }
    };

    const getFilteredGrades = () => {
        return grades.filter(g => {
            const matchSubject = selectedSubject === 0 || g.subject.id === selectedSubject;
            const matchStudent = selectedStudent === 0 || g.student.id === selectedStudent;
            const matchSearch = g.student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.student.firstName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchSubject && matchStudent && matchSearch;
        });
    };

    const getFilteredAttendance = () => {
        return attendanceList.filter(a => {
            const matchSubject = selectedSubject === 0 || a.subject.id === selectedSubject;
            const matchStudent = selectedStudent === 0 || a.student.id === selectedStudent;
            const matchSearch = a.student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.student.firstName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchSubject && matchStudent && matchSearch;
        });
    };

    const getGradeTypeLabel = (type: string) => {
        switch (type) {
            case 'CURRENT': return 'Текущая';
            case 'MIDTERM': return 'Рубежная';
            case 'FINAL': return 'Итоговая';
            case 'EXAM': return 'Экзамен';
            default: return type;
        }
    };

    const getAttendanceStatusIcon = (status: string) => {
        switch (status) {
            case 'PRESENT': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'ABSENT': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'LATE': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'EXCUSED': return <AlertCircle className="w-5 h-5 text-blue-500" />;
            default: return null;
        }
    };

    const getAttendanceStatusLabel = (status: string) => {
        switch (status) {
            case 'PRESENT': return 'Присутствовал';
            case 'ABSENT': return 'Отсутствовал';
            case 'LATE': return 'Опоздал';
            case 'EXCUSED': return 'Уважительная';
            default: return status;
        }
    };

    const getSelectedStudentName = () => {
        const student = students.find(s => s.id === selectedStudent);
        return student ? `${student.lastName} ${student.firstName}` : '';
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Журнал успеваемости</h1>
                    <p className="text-slate-500 mt-1">Оценки и посещаемость студентов</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setEditingGrade(undefined);
                            setShowGradeModal(true);
                        }}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Выставить оценку</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingAttendance(undefined);
                            setShowAttendanceModal(true);
                        }}
                        className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Отметить посещаемость</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2 text-slate-400 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 w-full md:w-64">
                    <Search className="w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Поиск студента..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-sm text-slate-700 w-full"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(parseInt(e.target.value))}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                        <option value={0}>Все предметы</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.shortName}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(parseInt(e.target.value))}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                        <option value={0}>Все студенты</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>{s.lastName} {s.firstName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Statistics Section */}
            {selectedStudent !== 0 && (
                <StudentStatistics
                    gradeStats={gradeStats}
                    attendanceStats={attendanceStats}
                    studentName={getSelectedStudentName()}
                    loading={loadingStats}
                />
            )}

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
                <button
                    onClick={() => setActiveTab('grades')}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'grades'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <GraduationCap className="w-4 h-4" />
                    <span>Оценки</span>
                </button>
                <button
                    onClick={() => setActiveTab('attendance')}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'attendance'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Calendar className="w-4 h-4" />
                    <span>Посещаемость</span>
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Студент</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Группа</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Предмет</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">
                                    {activeTab === 'grades' ? 'Тип оценки' : 'Статус'}
                                </th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">
                                    {activeTab === 'grades' ? 'Оценка' : 'Дата'}
                                </th>
                                {activeTab === 'grades' && (
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Дата</th>
                                )}
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {activeTab === 'grades' ? (
                                getFilteredGrades().map((grade) => (
                                    <tr key={grade.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {grade.student.lastName} {grade.student.firstName}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{grade.student.group?.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{grade.subject.shortName}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {getGradeTypeLabel(grade.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{grade.value}</td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{grade.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingGrade(grade);
                                                        setShowGradeModal(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingItem({ id: grade.id, type: 'grade' })}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                getFilteredAttendance().map((attendance) => (
                                    <tr key={attendance.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {attendance.student.lastName} {attendance.student.firstName}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{attendance.student.group?.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{attendance.subject.shortName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {getAttendanceStatusIcon(attendance.status)}
                                                <span className="text-sm text-slate-700">
                                                    {getAttendanceStatusLabel(attendance.status)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{attendance.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingAttendance(attendance);
                                                        setShowAttendanceModal(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingItem({ id: attendance.id, type: 'attendance' })}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                            {/* Empty States */}
                            {activeTab === 'grades' && getFilteredGrades().length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        Оценки не найдены
                                    </td>
                                </tr>
                            )}
                            {activeTab === 'attendance' && getFilteredAttendance().length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        Записи о посещаемости не найдены
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showGradeModal && (
                <GradeModal
                    onClose={() => setShowGradeModal(false)}
                    onSave={fetchGrades}
                    grade={editingGrade}
                />
            )}

            {showAttendanceModal && (
                <AttendanceModal
                    onClose={() => setShowAttendanceModal(false)}
                    onSave={fetchAttendance}
                    attendance={editingAttendance}
                />
            )}

            {deletingItem && (
                <DeleteConfirmModal
                    title={deletingItem.type === 'grade' ? "Удалить оценку?" : "Удалить запись?"}
                    message="Вы уверены? Это действие нельзя отменить."
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingItem(null)}
                />
            )}
        </div>
    );
};

export default GradesAndAttendance;
