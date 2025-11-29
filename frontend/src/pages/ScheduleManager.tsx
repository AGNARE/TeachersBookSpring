import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Calendar, Clock, Users, User, List, CalendarDays } from 'lucide-react';
import api from '../api/axios';
import ScheduleModal from '../components/ScheduleModal';
import ConfirmDialog from '../components/ConfirmDialog';
import WeeklyCalendar from '../components/WeeklyCalendar';

export interface Group {
    id: number;
    name: string;
}

export interface Subject {
    id: number;
    name: string;
    shortName: string;
}

export interface Teacher {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
}

export interface ScheduleItem {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    groups: Group[];
    subject: Subject;
    teacher: Teacher;
    lessonType: 'LECTURE' | 'LAB' | 'PRACTICE';
}

const ScheduleManager = () => {
    const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ScheduleItem | null>(null);

    // View mode and week navigation
    const [viewMode, setViewMode] = useState<'list' | 'week'>('week');
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
        const today = new Date();
        const monday = new Date(today);
        const day = monday.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        monday.setDate(today.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    });

    useEffect(() => {
        fetchSchedule();
    }, [selectedDate]);

    const fetchSchedule = async () => {
        try {
            const url = selectedDate
                ? `/schedule/date/${selectedDate}`
                : '/schedule';
            const response = await api.get(url);
            setScheduleItems(response.data);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: ScheduleItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (item: ScheduleItem) => {
        setItemToDelete(item);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            try {
                await api.delete(`/schedule/${itemToDelete.id}`);
                setScheduleItems(scheduleItems.filter(s => s.id !== itemToDelete.id));
                setDeleteConfirmOpen(false);
                setItemToDelete(null);
            } catch (error) {
                console.error('Error deleting schedule item:', error);
                alert('Ошибка при удалении расписания');
            }
        }
    };

    const handleSave = () => {
        fetchSchedule();
    };

    const getLessonTypeLabel = (type: string) => {
        const labels = {
            'LECTURE': 'Лекция',
            'LAB': 'Лабораторная',
            'PRACTICE': 'Практика'
        };
        return labels[type as keyof typeof labels] || type;
    };

    const getLessonTypeBadge = (type: string) => {
        const colors = {
            'LECTURE': 'bg-blue-100 text-blue-800',
            'LAB': 'bg-green-100 text-green-800',
            'PRACTICE': 'bg-purple-100 text-purple-800'
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getTeacherName = (teacher: Teacher) => {
        if (teacher.firstName && teacher.lastName) {
            return `${teacher.lastName} ${teacher.firstName}`;
        }
        return teacher.username;
    };

    const filteredItems = scheduleItems.filter(item =>
        item.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.groups.some(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        getTeacherName(item.teacher).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by date and time
    const sortedItems = [...filteredItems].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
    });

    if (loading) {
        return <div className="p-6 text-center text-slate-500">Загрузка расписания...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Управление расписанием</h1>
                <p className="text-slate-600">Создание и редактирование расписания занятий</p>
            </div>

            <div className="mb-6 flex flex-col lg:flex-row gap-4">
                {viewMode === 'list' && (
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Поиск по дисциплине, группе, преподавателю..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {/* View Toggle */}
                    <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('week')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${viewMode === 'week'
                                    ? 'bg-white text-indigo-600 shadow-sm font-medium'
                                    : 'text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            <CalendarDays size={18} />
                            <span className="hidden sm:inline">Неделя</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${viewMode === 'list'
                                    ? 'bg-white text-indigo-600 shadow-sm font-medium'
                                    : 'text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            <List size={18} />
                            <span className="hidden sm:inline">Список</span>
                        </button>
                    </div>

                    {viewMode === 'list' && (
                        <>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate('')}
                                    className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Все даты
                                </button>
                            )}
                        </>
                    )}

                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Добавить занятие</span>
                        <span className="sm:hidden">Добавить</span>
                    </button>
                </div>
            </div>

            {/* Render based on view mode */}
            {viewMode === 'week' ? (
                <WeeklyCalendar
                    scheduleItems={scheduleItems}
                    currentWeekStart={currentWeekStart}
                    onWeekChange={setCurrentWeekStart}
                    onEditItem={handleEdit}
                    canEdit={true}
                />
            ) : (
                <>
                    {sortedItems.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="mx-auto text-slate-300 mb-4" size={64} />
                            <p className="text-slate-500 text-lg">Расписание пусто</p>
                            <p className="text-slate-400 mt-2">Добавьте первое занятие</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-slate-800">
                                                    {item.subject.name}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLessonTypeBadge(item.lessonType)}`}>
                                                    {getLessonTypeLabel(item.lessonType)}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-slate-400" />
                                                    <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-slate-400" />
                                                    <span>{item.startTime} - {item.endTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-slate-400" />
                                                    <span>{getTeacherName(item.teacher)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mt-3">
                                                <Users size={16} className="text-slate-400" />
                                                <div className="flex flex-wrap gap-2">
                                                    {item.groups.map((group) => (
                                                        <span
                                                            key={group.id}
                                                            className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm"
                                                        >
                                                            {group.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Редактировать"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(item)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Удалить"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {isModalOpen && (
                <ScheduleModal
                    item={selectedItem}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {deleteConfirmOpen && (
                <ConfirmDialog
                    isOpen={deleteConfirmOpen}
                    title="Удалить занятие?"
                    message={`Вы уверены, что хотите удалить занятие "${itemToDelete?.subject.name}" (${itemToDelete ? new Date(itemToDelete.date).toLocaleDateString('ru-RU') : ''})?`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => {
                        setDeleteConfirmOpen(false);
                        setItemToDelete(null);
                    }}
                />
            )}
        </div>
    );
};

export default ScheduleManager;
