import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

interface Group {
    id?: number;
    name: string;
}

interface GroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    group?: Group | null;
}

const GroupModal = ({ isOpen, onClose, onSave, group }: GroupModalProps) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (group) {
                setName(group.name);
            } else {
                setName('');
            }
        }
    }, [isOpen, group]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const groupData = { name };

        try {
            if (group?.id) {
                await api.put(`/groups/${group.id}`, groupData);
            } else {
                await api.post('/groups', groupData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving group:', error);
            alert('Ошибка при сохранении');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900">
                        {group ? 'Редактировать группу' : 'Новая группа'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Название группы</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Например: ИС-21"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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

export default GroupModal;
