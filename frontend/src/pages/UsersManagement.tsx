import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserCheck, UserPlus, Users, User } from 'lucide-react';
import api from '../api/axios';
import UserModal from '../components/UserModal';

interface UserItem {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
}

const UsersManagement = () => {
    const [teachers, setTeachers] = useState<UserItem[]>([]);
    const [students, setStudents] = useState<UserItem[]>([]);
    const [activeTab, setActiveTab] = useState<'teachers' | 'students'>('teachers');
    const [showModal, setShowModal] = useState(false);

    const fetchTeachers = async () => {
        const res = await api.get('/users/teachers');
        setTeachers(res.data);
    };
    const fetchStudents = async () => {
        const res = await api.get('/users/students');
        setStudents(res.data);
    };

    useEffect(() => {
        fetchTeachers();
        fetchStudents();
    }, []);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const renderTable = (list: UserItem[]) => (
        <table className="min-w-full bg-white border">
            <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2">First Name</th>
                    <th className="px-4 py-2">Last Name</th>
                    <th className="px-4 py-2">Role</th>
                </tr>
            </thead>
            <tbody>
                {list.map(u => (
                    <tr key={u.id} className="border-t">
                        <td className="px-4 py-2">{u.id}</td>
                        <td className="px-4 py-2">{u.username}</td>
                        <td className="px-4 py-2">{u.firstName}</td>
                        <td className="px-4 py-2">{u.lastName}</td>
                        <td className="px-4 py-2">{u.role}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Управление пользователями</h1>
                <button
                    onClick={openModal}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded"
                >
                    <UserPlus className="w-5 h-5" />
                    <span>Создать</span>
                </button>
            </div>
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setActiveTab('teachers')}
                    className={`px-4 py-2 rounded ${activeTab === 'teachers' ? 'bg-blue-100' : 'bg-gray-100'}`}
                >Преподаватели</button>
                <button
                    onClick={() => setActiveTab('students')}
                    className={`px-4 py-2 rounded ${activeTab === 'students' ? 'bg-blue-100' : 'bg-gray-100'}`}
                >Студенты</button>
            </div>
            {activeTab === 'teachers' ? renderTable(teachers) : renderTable(students)}
            {showModal && <UserModal onClose={closeModal} refresh={() => { fetchTeachers(); fetchStudents(); }} />}
        </div>
    );
};

export default UsersManagement;
