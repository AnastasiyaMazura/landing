const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const Form = require('./models/Form');

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения
const app = express();

// Подключение к базе данных
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// API для обработки формы
app.post('/api/submit-form', async (req, res) => {
    try {
        const { email, message, interests } = req.body;
        
        // Создаем новую запись в базе данных
        const formData = new Form({
            email,
            message,
            interests
        });
        
        await formData.save();
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Ошибка при сохранении формы:', error);
        res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
});

// Отдаем HTML для всех остальных маршрутов (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Настройка порта и запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));