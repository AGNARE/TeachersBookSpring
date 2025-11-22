import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, Calendar } from 'lucide-react';
import api from '../api/axios';

interface LessonDTO {
    id: number;
    subjectName: string;
    groupName: string;
    type: string;
    startTime: string;
    endTime: string;
}

interface DashboardStats {
    totalStudents: number;
    totalGroups: number;
    averageGrade: number;
    lessonsToday: number;
    upcomingLessons: LessonDTO[];
}

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-6 text-center text-slate-500">Загрузка...</div>;
    }

    const statCards = [
        { title: "Всего студентов", value: stats?.totalStudents || 0, icon: <Users className="w-6 h-6 text-blue-600" />, color: "bg-blue-100" },
        { title: "Групп", value: stats?.totalGroups || 0, icon: <BookOpen className="w-6 h-6 text-purple-600" />, color: "bg-purple-100" },
        { title: "Средний балл", value: stats?.averageGrade || 0, icon: <GraduationCap className="w-6 h-6 text-green-600" />, color: "bg-green-100" },
        { title: "Занятий сегодня", value: stats?.lessonsToday || 0, icon: <Calendar className="w-6 h-6 text-orange-600" />, color: "bg-orange-100" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>
                    <p className="text-slate-500">Обзор учебного процесса</p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-500">
                        {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
                    <h3 className="font-bold text-lg mb-4">Ближайшие занятия</h3>
                    <div className="space-y-4 flex-1">
                        {stats?.upcomingLessons.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">Нет ближайших занятий</p>
                        ) : (
                            stats?.upcomingLessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50">
                                    <div className="text-center min-w-[60px]">
                                        <div className="font-bold text-slate-900">
                                            {new Date(lesson.startTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {new Date(lesson.endTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="w-1 h-10 bg-blue-500 rounded-full"></div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{lesson.subjectName}</h4>
                                        <p className="text-sm text-slate-500">{lesson.groupName} • {lesson.type}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col min-h-[400px]">
                    <h3 className="font-bold text-lg mb-4">Успеваемость по группам</h3>
                    {/* Placeholder for Chart */}
                    <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                        График успеваемости
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
