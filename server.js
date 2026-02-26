require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize PostgreSQL Connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'silvercare',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Initialize OpenAI Chat (Optional for actual deployment)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// API endpoints
app.get('/api/medicines/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query('SELECT * FROM Medications WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/medicines', async (req, res) => {
    try {
        const { user_id, medicine_name, dosage, scheduled_time, status } = req.body;
        const result = await pool.query(
            'INSERT INTO Medications (user_id, medicine_name, dosage, scheduled_time, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, medicine_name, dosage, scheduled_time, status]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/medicines/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await pool.query(
            'UPDATE Medications SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Emergency SOS Endpoint
app.post('/api/sos', async (req, res) => {
    try {
        const { user_id, lat, lng } = req.body;
        const result = await pool.query('SELECT * FROM EmergencyContacts WHERE user_id = $1', [user_id]);

        // Simulate sending SMS Integration (e.g., Twilio)
        console.log(`Sending EMERGENCY SMS for User ${user_id} with Location: ${lat}, ${lng}`);
        result.rows.forEach(contact => {
            console.log(`Alerting ${contact.contact_name} at ${contact.phone_number}`);
        });

        res.json({ message: 'Emergency contacts notified', contactsAlerted: result.rowCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to trigger SOS' });
    }
});

// AI Assistant Chat Route
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!process.env.OPENAI_API_KEY) {
            return res.json({ reply: 'I am a simulated assistant. Please take your medicines on time and rest well!' });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are SilverCare, an empathetic, clear, and reassuring AI health assistant for elderly patients. Provide concise, simple advice. Never replace professional diagnosis. End serious complaints with a reminder to see a doctor." },
                { role: "user", content: message }
            ],
            max_tokens: 150
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
        console.error('Chat error:', err);
        res.status(500).json({ error: 'Failed to connect to AI server' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SilverCare Backend Server running on port ${PORT}`);
});
