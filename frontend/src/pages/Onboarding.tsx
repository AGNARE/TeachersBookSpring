import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, BarChart2 } from 'lucide-react';

const Onboarding = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <BookOpen className="w-12 h-12 text-blue-500" />,
            title: "Удобный журнал",
            description: "Ведите учет посещаемости и успеваемости в пару кликов"
        },
        {
            icon: <CheckCircle className="w-12 h-12 text-green-500" />,
            title: "Контроль посещаемости",
            description: "Отмечайте студентов на лекциях и практиках"
        },
        {
            icon: <BarChart2 className="w-12 h-12 text-purple-500" />,
            title: "Наглядная статистика",
            description: "Анализируйте успеваемость групп и отдельных студентов"
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-12"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-slate-900">TeachersBook</h1>
                    <p className="text-slate-500 text-lg">Ваш цифровой помощник в обучении</p>
                </div>

                <div className="space-y-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50"
                        >
                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 text-lg">{feature.title}</h3>
                                <p className="text-slate-500">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/login')}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-200 flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                >
                    <span>Начать работу</span>
                    <ArrowRight className="w-5 h-5" />
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Onboarding;
