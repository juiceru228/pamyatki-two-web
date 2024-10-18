const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

// Настройка хранения файлов для сообщений
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/app/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Маршрут для создания новой темы
router.post('/threads/new', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const newThreadResult = await pool.query(
            'INSERT INTO threads (title, user_id) VALUES ($1, $2) RETURNING *',
            [title, req.session.user.id]
        );

        if (newThreadResult.rowCount > 0) {
            const newThread = newThreadResult.rows[0];
            res.json(newThread); // Возвращаем созданный тред
        } else {
            res.status(500).json({ error: 'Failed to create thread' });
        }
    } catch (error) {
        //console.error('Failed to create thread', error);
        res.status(500).json({ error: 'Failed to create thread' });
    }
});

// Маршрут для удаления треда
router.delete("/threads/:threadId/delete", async (req, res) => {
    const { threadId } = req.params;

    if (!req.session.user || (req.session.user.username !== "admin" && req.session.user.username !== "root")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const deleteThreadResult = await pool.query(
            "DELETE FROM threads WHERE id = $1",
            [threadId]
        );

        if (deleteThreadResult.rowCount > 0) {
            return res.status(200).json({ message: "Thread deleted successfully" });
        } else {
            return res.status(404).json({ error: "Thread not found" });
        }
    } catch (error) {
        //console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Маршрут для получения всех тем
router.get("/threads", async (req, res) => {
    try {
        const threads = await pool.query(`
            SELECT threads.*, users.username 
            FROM threads 
            JOIN users ON threads.user_id = users.id
        `);
        res.json(threads.rows);
    } catch (error) {
        //console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Маршрут для добавления сообщения с возможностью загрузки файлов
router.post("/threads/:threadId/messages", upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { threadId } = req.params;
    let { content } = req.body;
    const image = req.files.image ? `/uploads/${req.files.image[0].filename}` : null;
    const video = req.files.video ? `/uploads/${req.files.video[0].filename}` : null;

    if (!content && !image && !video) {
        return res.status(400).json({ error: "Content, image, or video is required" });
    }
    //content = content.replace(/\n/g, \n);
    try {
        // Get the current highest message number in the thread
        const messageNumberResult = await pool.query(
            "SELECT COALESCE(MAX(message_number), 0) AS max_message_number FROM messages WHERE thread_id = $1",
            [threadId]
        );
        const messageNumber = messageNumberResult.rows[0].max_message_number + 1;

        const newMessage = await pool.query(
            "INSERT INTO messages (thread_id, user_id, content, image_url, video_url, message_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [threadId, req.session.user.id, content, image, video, messageNumber]
        );
        res.json(newMessage.rows[0]);
    } catch (error) {
        //console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Маршрут для получения всех сообщений в теме
router.get("/threads/:threadId/messages", async (req, res) => {
    const { threadId } = req.params;

    try {
        const messages = await pool.query(
            "SELECT messages.*, users.username AS author, users.avatar_url FROM messages JOIN users ON messages.user_id = users.id WHERE thread_id = \$1",
            [threadId]
        );
        res.json(messages.rows);
    } catch (error) {
        //console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Затем при загрузке аватара:
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    let avatarUrl = '/uploads/' + req.file.filename; 
    const userId = req.session.user.id; // извлекаем userId из сессии

    try {
        await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [avatarUrl, userId]);
        res.send({ status: 'Success', avatarUrl: avatarUrl });
    } catch (error) {
        //console.log(error);
        res.status(500).send({ status: 'Error', message: 'Could not update avatar' });
    }
});

module.exports = router;