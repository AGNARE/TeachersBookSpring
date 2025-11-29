import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

interface Subject {
    id?: number;
    name: string;
    shortName: string;
    description?: string;
    credits?: number;
    lessonTypes?: string[];
}

interface SubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    subject?: Subject | null;
}

const SubjectModal = ({ isOpen, onClose, onSave, subject }: SubjectModalProps) => {
    const [name, setName] = useState('');
    const [shortName, setShortName] = useState('');
    const [description, setDescription] = useState('');
    const [credits, setCredits] = useState<number>(0);
    const [lessonTypes, setLessonTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const availableLessonTypes = [
        { value: 'LECTURE', label: 'Лекция' },
        { value: 'SEMINAR', label: 'Семинар' },
        { value: 'PRACTICAL', label: 'Практическое занятие' },
        { value: 'LAB', label: 'Лабораторная работа' }
    ];

    useEffect(() => {
        if (isOpen) {
            if (subject) {
                setName(subject.name);
                setShortName(subject.shortName);
                setDescription(subject.description || '');
                setCredits(subject.credits || 0);
                setLessonTypes(subject.lessonTypes || []);
            } else {
                setName('');
                setShortName('');
                setDescription('');
                setCredits(0);
                setLessonTypes([]);
            }
        }
    }, [isOpen, subject]);

    const handleLessonTypeChange = (type: string) => {
        setLessonTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const subjectData = {
            name,
            shortName,
            description: description || null,
            credits: credits || null,
            lessonTypes
        };

        try {
            if (subject?.id) {
                await api.put(`/subjects/${subject.id}`, subjectData);
            } else {
                await api.post('/subjects', subjectData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving subject:', error);
            alert('Ошибка при сохранении');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="font-bold text-lg text-slate-900">
                        {subject ? 'Редактировать дисциплину' : 'Новая дисциплина'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Название дисциплины <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Например: Основы формальных спецификаций"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Краткое название <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={shortName}
                            onChange={(e) => setShortName(e.target.value)}
                            placeholder="Например: ОФС"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Описание
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Краткое описание дисциплины"
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Кредиты/часы
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={credits}
                            onChange={(e) => setCredits(parseInt(e.target.value) || 0)}
                            placeholder="Например: 4"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Типы занятий
                        </label>
                        <div className="space-y-2">
                            {availableLessonTypes.map((type) => (
                                <label key={type.value} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={lessonTypes.includes(type.value)}
                                        onChange={() => handleLessonTypeChange(type.value)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-slate-700 font-medium">{type.label}</span>
                                </label>
                            ))}
                        </div>
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

export default SubjectModal;
