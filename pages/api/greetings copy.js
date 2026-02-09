// import clientPromise from '../../lib/mongodb';

// export default async function handler(req, res) {
//   try {
//     const client = await clientPromise;
//     const db = client.db('christmas_greetings'); // exact DB name

//     if (req.method === 'GET') {
//       const messages = await db.collection('messages').find({}).sort({ _id: -1 }).toArray();
//       return res.status(200).json(messages);
//     }

//     if (req.method === 'POST') {
//       const { name, designation, message } = req.body;

//       if (!name || !message) {
//         return res.status(400).json({ error: 'Name and message are required' });
//       }

//       const result = await db.collection('messages').insertOne({ name, designation, message });
//       return res.status(201).json(result);
//     }

//     return res.status(405).json({ error: 'Method not allowed' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// pages/api/greetings.js

import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('christmas_greetings'); // exact DB name

    if (req.method === 'GET') {
      const messages = await db.collection('messages').find({}).sort({ _id: -1 }).toArray();
      // NOTE: Documents stored with the old 'designation' field will still be fetched.
      // The frontend must check for both 'companyName' (new) and 'designation' (old/legacy) fields.
      return res.status(200).json(messages);
    }

    if (req.method === 'POST') {
      // 🚀 FIX 1: Destructure and save 'companyName' instead of 'designation'
      const { name, companyName, message } = req.body; 

      if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
      }

      // 🚀 FIX 2: Insert 'companyName' into MongoDB
      const result = await db.collection('messages').insertOne({ name, companyName, message });
      return res.status(201).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}