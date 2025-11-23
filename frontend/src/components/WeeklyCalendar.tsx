import { Calendar, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { ScheduleItem } from '../pages/ScheduleManager';

interface WeeklyCalendarProps {
    scheduleItems: ScheduleItem[];
    currentWeekStart: Date;
    onWeekChange: (weekStart: Date) => void;
    onEditItem: (item: ScheduleItem) => void;
    canEdit: boolean;
}

const WeeklyCalendar = ({ scheduleItems, currentWeekStart, onWeekChange, onEditItem, canEdit }: WeeklyCalendarProps) => {
    // Time slots from 08:30 to 20:00 (every hour)
    const timeSlots = [
        '08:30', '09:30', '10:30', '11:30', '12:30',
        '13:30', '14:30', '15:30', '16:30', '17:30',
        '18:30', '19:30'
    ];

    // Get week days (Monday to Saturday)
    const getWeekDays = (weekStart: Date): Date[] => {
        const days: Date[] = [];
        for (let i = 0; i < 6; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const weekDays = getWeekDays(currentWeekStart);
    const dayNamesShort = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

    // Navigate weeks
    const goToPreviousWeek = () => {
        const prevWeek = new Date(currentWeekStart);
        prevWeek.setDate(currentWeekStart.getDate() - 7);
        onWeekChange(prevWeek);
    };

    const goToNextWeek = () => {
        const nextWeek = new Date(currentWeekStart);
        nextWeek.setDate(currentWeekStart.getDate() + 7);
        onWeekChange(nextWeek);
    };

    const goToCurrentWeek = () => {
        const today = new Date();
        const monday = new Date(today);
        const day = monday.getDay();
        const diff = day === 0 ? -6 : 1 - day; // If Sunday (0), go back 6 days, else go to Monday
        monday.setDate(today.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        onWeekChange(monday);
    };

    // Format week range
    const formatWeekRange = (): string => {
        const start = weekDays[0];
        const end = weekDays[5];
        const startStr = `${start.getDate()} ${start.toLocaleDateString('ru-RU', { month: 'short' })}`;
        const endStr = `${end.getDate()} ${end.toLocaleDateString('ru-RU', { month: 'short' })}`;
        return `${startStr} - ${endStr}`;
    };

    // Check if date matches
    const isSameDate = (date1: Date, date2: Date): boolean => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    // Get lessons for specific day and time slot
    const getLessonsForSlot = (day: Date, timeSlot: string): ScheduleItem[] => {
        return scheduleItems.filter(item => {
            // Parse date string (YYYY-MM-DD) without timezone issues
            const [year, month, dayNum] = item.date.split('-').map(Number);
            const itemDate = new Date(year, month - 1, dayNum);

            if (!isSameDate(itemDate, day)) return false;

            // Check if lesson starts at this time slot
            const [slotHour, slotMin] = timeSlot.split(':').map(Number);
            const [itemHour, itemMin] = item.startTime.split(':').map(Number);

            // Show lesson if it starts at this exact time slot
            return itemHour === slotHour && itemMin === slotMin;
        });
    };

    const getLessonTypeColor = (type: string) => {
        const colors = {
            'LECTURE': 'bg-blue-500 border-blue-600',
            'LAB': 'bg-green-500 border-green-600',
            'PRACTICE': 'bg-purple-500 border-purple-600'
        };
        return colors[type as keyof typeof colors] || 'bg-gray-500 border-gray-600';
    };

    const getLessonTypeLabel = (type: string) => {
        const labels = {
            'LECTURE': 'Л',
            'LAB': 'ЛР',
            'PRACTICE': 'ПР'
        };
        return labels[type as keyof typeof labels] || type;
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return isSameDate(date, today);
    };

    // Check if we're viewing the current week
    const isCurrentWeek = (): boolean => {
        const today = new Date();
        const todayMonday = new Date(today);
        const day = todayMonday.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        todayMonday.setDate(today.getDate() + diff);
        todayMonday.setHours(0, 0, 0, 0);
        return isSameDate(currentWeekStart, todayMonday);
    };

    return (
        <div className="space-y-4">
            {/* Week Navigation */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <button
                    onClick={goToPreviousWeek}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Предыдущая неделя"
                >
                    <ChevronLeft size={20} className="text-slate-600" />
                </button>

                <div className="flex items-center gap-4">
                    <Calendar size={20} className="text-indigo-600" />
                    <span className="text-lg font-semibold text-slate-800">
                        {formatWeekRange()}
                    </span>
                    {!isCurrentWeek() && (
                        <button
                            onClick={goToCurrentWeek}
                            className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                            Текущая неделя
                        </button>
                    )}
                </div>

                <button
                    onClick={goToNextWeek}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Следующая неделя"
                >
                    <ChevronRight size={20} className="text-slate-600" />
                </button>
            </div>

            {/* Weekly Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="w-24 p-3 text-left text-sm font-semibold text-slate-600 sticky left-0 bg-slate-50 z-10">
                                    Время
                                </th>
                                {weekDays.map((day, index) => (
                                    <th
                                        key={index}
                                        className={`p-3 text-center text-sm font-semibold min-w-[140px] ${isToday(day) ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-bold">{dayNamesShort[index]}</span>
                                            <span className={`text-xs ${isToday(day) ? 'font-semibold' : 'text-slate-500'}`}>
                                                {day.getDate()} {day.toLocaleDateString('ru-RU', { month: 'short' })}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map((timeSlot, timeIndex) => (
                                <tr key={timeIndex} className="border-b border-slate-100 hover:bg-slate-50/50">
                                    <td className="p-2 text-sm font-medium text-slate-600 text-center sticky left-0 bg-white border-r border-slate-100">
                                        {timeSlot}
                                    </td>
                                    {weekDays.map((day, dayIndex) => {
                                        const lessons = getLessonsForSlot(day, timeSlot);
                                        return (
                                            <td
                                                key={dayIndex}
                                                className={`p-1 align-top ${isToday(day) ? 'bg-indigo-50/30' : ''
                                                    }`}
                                            >
                                                {lessons.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {lessons.map((lesson) => (
                                                            <div
                                                                key={lesson.id}
                                                                className={`${getLessonTypeColor(lesson.lessonType)} text-white rounded-md p-2 text-xs border-l-4 cursor-pointer hover:opacity-90 transition-opacity group relative`}
                                                                onClick={() => canEdit && onEditItem(lesson)}
                                                                title={`${lesson.subject.name}\n${lesson.groups.map(g => g.name).join(', ')}\n${lesson.startTime} - ${lesson.endTime}`}
                                                            >
                                                                <div className="flex items-start justify-between gap-1">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-1 mb-1">
                                                                            <span className="font-bold text-[10px] bg-white/20 px-1 rounded">
                                                                                {getLessonTypeLabel(lesson.lessonType)}
                                                                            </span>
                                                                            <span className="text-[10px] font-semibold truncate">
                                                                                {lesson.subject.shortName || lesson.subject.name}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-[10px] opacity-90 truncate">
                                                                            {lesson.groups.map(g => g.name).join(', ')}
                                                                        </div>
                                                                        <div className="text-[9px] opacity-75 mt-0.5">
                                                                            {lesson.startTime} - {lesson.endTime}
                                                                        </div>
                                                                    </div>
                                                                    {canEdit && (
                                                                        <Pencil size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="h-16" /> // Empty slot height
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="font-semibold">Типы занятий:</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Лекция</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Лабораторная</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Практика</span>
                </div>
            </div>
        </div>
    );
};

export default WeeklyCalendar;
