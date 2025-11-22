import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, BookOpen } from 'lucide-react';
import api from '../api/axios';
import SubjectModal from '../components/SubjectModal';
import ConfirmDialog from '../components/ConfirmDialog';

interface Subject {
    id: number;
    name: string;
    shortName: string;
    description?: string;
    credits?: number;
}

const Subjects = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await api.get('/subjects');
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedSubject(null);
        setIsModalOpen(true);
    };

    const handleEdit = (subject: Subject) => {
        setSelectedSubject(subject);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (subject: Subject) => {
        setSubjectToDelete(subject);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (subjectToDelete) {
            try {
                await api.delete(`/subjects/${subjectToDelete.id}`);
                setSubjects(subjects.filter(s => s.id !== subjectToDelete.id));
                setDeleteConfirmOpen(false);
                setSubjectToDelete(null);
            } catch (error) {
                console.error('Error deleting subject:', error);
                alert('Ошибка при удалении дисциплины');
            }
        }
    };

    const handleSave = () => {
        fetchSubjects();
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.shortName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-6 text-center text-slate-500">Загрузка списка дисциплин...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Дисциплины</h1>
                    <p className="text-slate-500">Управление учебными предметами</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Добавить дисциплину</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Поиск по названию..."
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
                                <th className="px-6 py-4">Название</th>
                                <th className="px-6 py-4">Краткое</th>
                                <th className="px-6 py-4">Описание</th>
                                <th className="px-6 py-4">Кредиты</th>
                                <th className="px-6 py-4 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSubjects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Дисциплины не найдены
                                    </td>
                                </tr>
                            ) : (
                                filteredSubjects.map((subject) => (
                                    <tr key={subject.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                                <div className="font-medium text-slate-900">{subject.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                                {subject.shortName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">
                                            {subject.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {subject.credits || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(subject)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(subject)}
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

            <SubjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                subject={selectedSubject}
            />

            <ConfirmDialog
                isOpen={deleteConfirmOpen}
                title="Удалить дисциплину?"
                message={subjectToDelete ? `Вы уверены, что хотите удалить дисциплину "${subjectToDelete.name}"?\n\n⚠️ ВНИМАНИЕ: Будут удалены все назначения этой дисциплины группам, занятия и оценки!` : ''}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteConfirmOpen(false)}
            />
        </div>
    );
};

export default Subjects;
