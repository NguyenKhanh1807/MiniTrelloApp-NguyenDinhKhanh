import express from 'express';
import { db } from '../firebase/admin.js';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/sendEmail.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

// --- Email Signup ---
router.post('/signup', async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await db.collection('verifications').doc(email).set({
    code,
    createdAt: new Date().toISOString(),
  });

  await sendVerificationEmail(email, code);

  res.status(201).json({ message: 'Code sent to email' });
});

// --- Email Signin ---
router.post('/signin', async (req, res) => {
  const { email, verificationCode } = req.body;

  const doc = await db.collection('verifications').doc(email).get();
  if (!doc.exists || doc.data().code !== verificationCode) {
    return res.status(401).json({ error: 'Invalid email or code' });
  }

  const userRef = db.collection('users').doc(email);
  let userDoc = await userRef.get();

  if (!userDoc.exists) {
    await userRef.set({ email, name: '', createdAt: new Date() });
    userDoc = await userRef.get(); // reload
  }

  const user = userDoc.data();

  const token = jwt.sign(
    { email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.status(200).json({ accessToken: token, user_id: email });
});

// --- GitHub Login ---
router.get('/github/login', (req, res) => {
  const encodedCallback = encodeURIComponent(CALLBACK_URL);
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodedCallback}`;
  console.log("🔁 Redirecting to GitHub:", redirectUrl);
  res.redirect(redirectUrl);
});

// --- GitHub Callback ---
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${access_token}` },
    });

    const { id, login, avatar_url } = userRes.data;
    const email = `${login}@github.local`;

    const userRef = db.collection('users').doc(email);
    let userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        email,
        githubId: id,
        username: login,
        avatar: avatar_url,
        createdAt: new Date(),
      });
      userDoc = await userRef.get();
    }

    const token = jwt.sign(
      { email, githubId: id, username: login },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.redirect(`http://localhost:5173/github-login-success?token=${token}`);
  } catch (error) {
    res.status(500).send('GitHub OAuth failed.');
  }
});

export default router;
