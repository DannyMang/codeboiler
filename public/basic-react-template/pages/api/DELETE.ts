import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      // Implement DELETE logic here
      res.status(200).json({ message: `Resource ${id} deleted` });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      res.status(500).json({ message: 'Error deleting resource' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}