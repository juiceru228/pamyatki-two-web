const session = require("express-session");

const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET,
    //credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,

    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
})

const wrap = (expressMiddleware) => (socket, next) => 
    expressMiddleware(socket.request, {}, next);

module.exports = {sessionMiddleware, wrap};