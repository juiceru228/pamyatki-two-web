const express = require("express");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./routers/authRoutes");
const forumRouter = require("./routers/forumRoutes");
const server = require("http").createServer(app);
const { sessionMiddleware, wrap } = require("./controllers/serverController");

require("dotenv").config();
const io = new Server(server, {
    cors: {
        origin: ["https://p2w.pro", "https://www.p2w.pro", "http://p2w.pro", "http://www.p2w.pro", "http://localhost:4050", "http://172.19.0.1:4050"],
        credentials: "true",
    },
});
app.use(express.json({ limit: '100mb' })); // Установите нужный максимальный размер
app.use(express.urlencoded({ limit: '100mb', extended: true })); // Установите нужный максимальный размер

app.use(helmet());
app.use(cors({
    origin:  ["https://p2w.pro", "https://www.p2w.pro", "http://p2w.pro", "http://www.p2w.pro", "http://localhost:4050", "http://172.19.0.1:4050"],
    credentials: true,
}));
app.use(express.json());
app.use(sessionMiddleware);
app.use("/auth", authRouter);
app.use("/forum", forumRouter);
app.use('/uploads', express.static('uploads'));

io.use(wrap(sessionMiddleware));
io.use((socket, next) => {
    // Получаем идентификатор сессии из заголовка Authorization
    const sessionId = socket.handshake.headers.authorization;

    // Устанавливаем идентификатор сессии для текущего соединения
    socket.sessionId = sessionId;
    
    next();
});
io.on("connect", socket => {
    console.log(socket.request.session.user.username);
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(413).send({ error: 'Request Entity Too Large' });
    } else {
        next();
    }
});

// Обработка других ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

server.listen(4000, () => {
    console.log("Server listening on port 4000");
});

