import e from 'express';
import 'dotenv/config';

import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import router from './src/routes/route.js';
import { configPassport } from './config/passport.js';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { prisma } from './src/model/prismamodel.js';

const app = e();

app.set("trust proxy", 1);
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS bloqueado: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.set('io', io);

// Track online users: userId -> Set of socketIds
const onlineUsers = new Map();

function broadcastOnlineUsers() {
  io.emit('online users', Array.from(onlineUsers.keys()));
}

io.on('connection', (socket) => {
  socket.on("joinRoom", (userId) => {
    if (!userId) return;
    socket.join(userId);
    socket.data.userId = userId;
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    broadcastOnlineUsers();
  });

  socket.on("NotificationRoom", (userId) => {
    if (!userId) return;
    socket.join(userId);
    socket.data.userId = userId;
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    broadcastOnlineUsers();
  });

  socket.on("typing", ({ from, to }) => {
    if (to) {
      io.to(to).emit("typing", { from });
    }
  });

  socket.on("stop typing", ({ from, to }) => {
    if (to) {
      io.to(to).emit("stop typing", { from });
    }
  });

  socket.on("chat message", async ({ from, text, to }) => {
    try {
      if (!from || !to || !text) return;
      const message = await prisma.messages.create({
        data: {
          content: text,
          sender_id: from,
          receptor_id: to,
        }
      });

      io.to(to).emit("chat message", message);
      socket.emit("chat message", message);
    } catch (e) {
      console.error("Socket chat message error:", e);
    }
  });

  socket.on('publicationRomm', (publicationId) => {
    if (publicationId) {
      socket.join(publicationId);
    }
  });

  socket.on('publication comments', async ({ publicationId, from, text }) => {
    try {
      if (!publicationId || !from || !text) return;
      const comment = await prisma.comments.create({
        data: {
          content: text,
          post_id: publicationId,
          user_id: from
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profileImg: true
            }
          }
        }
      });

      io.to(publicationId).emit("publication comments", comment);

      // Create & emit real-time notification for the post author
      const post = await prisma.publications.findUnique({
        where: { id: publicationId },
        select: { user_id: true }
      });

      if (post && post.user_id !== from) {
        const notification = await prisma.notifcations.create({
          data: {
            user_id: post.user_id,
            type: 'comment',
            actorId: from
          },
          include: {
            actor: {
              select: {
                id: true,
                username: true,
                profileImg: true
              }
            }
          }
        });
        io.to(post.user_id).emit('notifications', notification);
      }
    } catch (e) {
      console.error("Socket comment error:", e);
    }
  });

  socket.on('disconnect', () => {
    const userId = socket.data.userId;
    if (userId && onlineUsers.has(userId)) {
      const set = onlineUsers.get(userId);
      set.delete(socket.id);
      if (set.size === 0) {
        onlineUsers.delete(userId);
      }
      broadcastOnlineUsers();
    }
  });
});

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS bloqueado: " + origin));
  },
  credentials: true
}));

const isHttpsProd = process.env.NODE_ENV === "production" && Boolean(process.env.RENDER || process.env.RAILWAY_ENVIRONMENT);

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: isHttpsProd ? "none" : "lax",
    secure: isHttpsProd
  }
}));
configPassport();

app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);
app.get('/', (req, res) => {
  res.send('¡Hola desde mi app!');
});
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.use((err, req, res, next) => {
  console.error(err);

  if (err.status) {
    return res.status(err.status).json({
      error: err.message
    });
  }

  return res.status(500).json({
    error: 'Internal server error'
  });
});
export { server, io };
export default app;
