import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import session from 'express-session';

import authRoutes from './routes/auth.js';
import playerRoutes from './routes/player.js';
import videoRoutes from './routes/video.js';
import {
  errorHandler
} from './middleware/errorHandler.js';

import achievementRoutes from './routes/achievement.js';
import clubHistoryRoutes from './routes/clubHistory.js';
const app = express();
app.use(express.static('public'));


const PORT =
  process.env.PORT;

// ============================================
// CORS
// ============================================

app.use(
  cors({

    origin:
      process.env.FRONTEND_URL,

    credentials: true,

  })
);

// ============================================
// JSON
// ============================================

app.use(
  express.json()
);

// ============================================
// SESSION
// ============================================

app.use(
  session({

    secret:
      process.env.SESSION_SECRET,

    resave:
      false,

    saveUninitialized:
      false,

    cookie: {

      maxAge:
        1000 * 60 * 60 * 24,

      httpOnly:
        true,

      secure:
        false,

    },

  })
);

// ============================================
// API HEALTH CHECK
// ============================================

app.get(
  '/',
  (req, res) => {

    res.send(
      'Path2Pro API is running...'
    );

  }
);

// ============================================
// AUTH ROUTES
// ============================================

app.use(
  '/api/auth',
  authRoutes
);

// ============================================
// PLAYER ROUTES
// ============================================

app.use(
  '/api/player',
  playerRoutes
);

// ============================================
// ERROR HANDLER
// ============================================



app.use(
  '/api/player/achievements',
  achievementRoutes
);
app.use('/api/club-history', clubHistoryRoutes);

app.use(
  '/api/player/videos',
  videoRoutes
);

app.use(
  errorHandler
);
// ============================================
// START SERVER
// ============================================

app.listen(
  PORT,
  () => {

    console.log(
      `Server running on http://localhost:${PORT}`
    );

  }
);