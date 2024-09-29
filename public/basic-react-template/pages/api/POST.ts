import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string;
  data?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    try {
      const body = req.body;
      // Implement POST logic here
      res.status(201).json({ message: 'Resource created', data: body });
    } catch (error) {
      res.status(500).json({ message: 'Error creating resource' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}