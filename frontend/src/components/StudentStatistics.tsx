import React from 'react';
import {
    TrendingUp,
    UserCheck,
    BookOpen,
    Clock,
    Award,
    AlertCircle
} from 'lucide-react';

interface GradeStats {
    totalGrades: number;
    averageGrade: number;
}

interface AttendanceStats {
    totalClasses: number;
    presentClasses: number;
    attendancePercentage: number;
}

interface StudentStatisticsProps {
    gradeStats: GradeStats | null;
    attendanceStats: AttendanceStats | null;
    studentName: string;
    loading: boolean;
}

const StudentStatistics: React.FC<StudentStatisticsProps> = ({
    gradeStats,
    attendanceStats,
    studentName,
    loading
}) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl h-32 border border-slate-200"></div>
                ))}
            </div>
        );
    }

    if (!gradeStats && !attendanceStats) return null;

    const getAverageColor = (avg: number) => {
        if (avg >= 8.5) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (avg >= 7.0) return 'text-blue-600 bg-blue-50 border-blue-100';
        if (avg >= 5.0) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
        return 'text-red-600 bg-red-50 border-red-100';
    };

    const getAttendanceColor = (percent: number) => {
        if (percent >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (percent >= 75) return 'text-blue-600 bg-blue-50 border-blue-100';
        if (percent >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
        return 'text-red-600 bg-red-50 border-red-100';
    };

    return (
        <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Статистика: {studentName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Average Grade Card */}
                <div className={`p-6 rounded-2xl border transition-all ${gradeStats ? getAverageColor(gradeStats.averageGrade) : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-xl bg-white/60 backdrop-blur-sm">
                            <Award className="w-6 h-6" />
                        </div>
                        {gradeStats && (
                            <span className="text-3xl font-bold tracking-tight">
                                {gradeStats.averageGrade.toFixed(1)}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="font-medium opacity-90">Средний балл</p>
                        <p className="text-sm opacity-75 mt-1">
                            Всего оценок: {gradeStats?.totalGrades || 0}
                        </p>
                    </div>
                </div>

                {/* Attendance Card */}
                <div className={`p-6 rounded-2xl border transition-all ${attendanceStats ? getAttendanceColor(attendanceStats.attendancePercentage) : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-xl bg-white/60 backdrop-blur-sm">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        {attendanceStats && (
                            <span className="text-3xl font-bold tracking-tight">
                                {Math.round(attendanceStats.attendancePercentage)}%
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="font-medium opacity-90">Посещаемость</p>
                        <p className="text-sm opacity-75 mt-1">
                            Присутствовал: {attendanceStats?.presentClasses || 0} из {attendanceStats?.totalClasses || 0}
                        </p>
                    </div>
                </div>

                {/* Summary/Status Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">Статус</p>
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center text-sm text-slate-600">
                                <BookOpen className="w-4 h-4 mr-2 text-slate-400" />
                                <span>Активность: {((gradeStats?.totalGrades || 0) > 0) ? 'Высокая' : 'Низкая'}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                <span>Пропусков: {(attendanceStats?.totalClasses || 0) - (attendanceStats?.presentClasses || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentStatistics;
