const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db');
const WaitlistEntry = require('./models/WaitlistEntry');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// API для формы из предыдущей задачи
app.post('/api/submit-form', async (req, res) => {
    try {
        // Код для обработки основной формы
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API для формы с вейтлистом
app.post('/api/submit-waitlist', async (req, res) => {
    try {
        const { email, questions } = req.body;
        
        // Проверка обязательных полей
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }
        
        // Создаем запись в базе данных
        const waitlistEntry = new WaitlistEntry({
            email,
            questions,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
        
        await waitlistEntry.save();
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error submitting waitlist form:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Отдача фронтенда
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Обработка ошибок 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});