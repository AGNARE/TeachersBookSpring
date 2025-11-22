import { useState } from 'react';
import api from '../api/axios';
import { UserPlus, RefreshCw } from 'lucide-react';

interface UserModalProps {
    onClose: () => void;
    refresh: () => void;
}

type RoleOption = 'TEACHER' | 'STUDENT';

const UserModal: React.FC<UserModalProps> = ({ onClose, refresh }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<RoleOption>('TEACHER');
    const [generatedUsername, setGeneratedUsername] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');

    const generateCredentials = async () => {
        const res = await api.post('/users/generate-credentials', { firstName, lastName });
        setGeneratedUsername(res.data.username);
        setGeneratedPassword(res.data.password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            username: generatedUsername,
            password: generatedPassword,
            firstName,
            lastName,
            role,
        };
        await api.post('/users', payload);
        refresh();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Создать пользователя</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Имя</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Фамилия</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Роль</label>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value as RoleOption)}
                            className="w-full border rounded px-2 py-1"
                        >
                            <option value="TEACHER">Преподаватель</option>
                            <option value="STUDENT">Студент</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={generateCredentials}
                            className="flex items-center space-x-1 bg-gray-200 px-3 py-1 rounded"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Сгенерировать логин/пароль</span>
                        </button>
                    </div>
                    {generatedUsername && (
                        <div className="text-sm">
                            <p>Логин: <strong>{generatedUsername}</strong></p>
                            <p>Пароль: <strong>{generatedPassword}</strong></p>
                        </div>
                    )}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button type="button" onClick={onClose} className="px-3 py-1">Отмена</button>
                        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
                            <UserPlus className="inline w-4 h-4 mr-1" />Создать
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
