import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string;
  data?: unknown;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const body = req.body;
      // Implement PUT logic here
      res.status(200).json({ message: `Resource ${id} updated`, data: body });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      res.status(500).json({ message: 'Error updating resource' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}