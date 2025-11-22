import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, User } from 'lucide-react';
import api from '../api/axios';
import StudentModal from '../components/StudentModal';
import ConfirmDialog from '../components/ConfirmDialog';

interface Group {
    id: number;
    name: string;
}

interface Student {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    dateBorn: string;
    group: Group | null;
}

const Students = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedStudent(null);
        setIsModalOpen(true);
    };

    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (student: Student) => {
        setStudentToDelete(student);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (studentToDelete) {
            try {
                await api.delete(`/students/${studentToDelete.id}`);
                setStudents(students.filter(s => s.id !== studentToDelete.id));
                setDeleteConfirmOpen(false);
                setStudentToDelete(null);
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Ошибка при удалении студента');
            }
        }
    };

    const handleSave = () => {
        fetchStudents();
    };

    const filteredStudents = students.filter(student => {
        const fullName = `${student.lastName} ${student.firstName} ${student.middleName || ''}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return <div className="p-6 text-center text-slate-500">Загрузка списка студентов...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Студенты</h1>
                    <p className="text-slate-500">Управление списком учащихся</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Добавить студента</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Поиск по имени или фамилии..."
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
                                <th className="px-6 py-4">Студент</th>
                                <th className="px-6 py-4">Группа</th>
                                <th className="px-6 py-4">Дата рождения</th>
                                <th className="px-6 py-4 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        Студенты не найдены
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">
                                                        {student.lastName} {student.firstName} {student.middleName}
                                                    </div>
                                                    <div className="text-xs text-slate-400">ID: {student.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.group ? (
                                                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                                    {student.group.name}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">Нет группы</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                            {student.dateBorn ? new Date(student.dateBorn).toLocaleDateString('ru-RU') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(student)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(student)}
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

            <StudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                student={selectedStudent}
            />

            <ConfirmDialog
                isOpen={deleteConfirmOpen}
                title="Удалить студента?"
                message={studentToDelete ? `Вы уверены, что хотите удалить ${studentToDelete.lastName} ${studentToDelete.firstName} ${studentToDelete.middleName}?` : ''}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteConfirmOpen(false)}
            />
        </div>
    );
};

export default Students;
