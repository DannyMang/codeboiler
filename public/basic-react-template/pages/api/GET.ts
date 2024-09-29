import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string;
  data?: unknown;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    try {
      // Implement GET logic here
      const data = { id: 1, name: 'Example' };
      res.status(200).json({ message: 'Success', data });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}