// pages/api/auth/me.js
// pages/api/auth/me.js
import { getServerSession } from 'next-auth';
import { authOptions } from './[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (session) {
    res.status(200).json({ user: session.user });
  } else {
    res.status(401).json({ error: 'Non authentifié' });
  }
}