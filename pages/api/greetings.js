import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('christmas_greetings');

    if (req.method === 'GET') {
      const messages = await db
        .collection('messages')
        .find({})
        .sort({ _id: -1 })
        .toArray();

      return res.status(200).json(messages);
    }

    if (req.method === 'POST') {
      const { name, companyName, message } = req.body;

      if (!name || !companyName || !message) {
        return res.status(400).json({ error: 'All fields required' });
      }

      const result = await db.collection('messages').insertOne({
        name,
        companyName,
        message,
        createdAt: new Date(),
      });

      return res.status(201).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}
