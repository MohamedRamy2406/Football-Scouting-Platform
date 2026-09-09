import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: false,
    },
  })
);

app.get('/', (req, res) => {
  res.send('Path2Pro API is running...');
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});