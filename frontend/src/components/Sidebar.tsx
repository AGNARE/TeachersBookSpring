import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, BookOpen, Link2, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user, role } = useAuth();

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
        { path: '/subjects', icon: BookOpen, label: 'Дисциплины' },
        { path: '/assign-disciplines', icon: Link2, label: 'Назначение' },
        { path: '/groups', icon: Users, label: 'Группы' },
        { path: '/students', icon: GraduationCap, label: 'Студенты' },
        { path: '/users-management', icon: UserCheck, label: 'Пользователи' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col flex-shrink-0">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        TB
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-800">TeachersBook</h1>
                        <p className="text-xs text-slate-500">v1.0.0</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="mb-6">
                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Меню</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 truncate">{user}</p>
                            <p className="text-xs text-slate-500 truncate">{role}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Выйти</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
