// pages/api/exportToGithub.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { createGithubRepo } from '../../utils/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { projectData, accessToken } = req.body;

  if (!accessToken) {
    return res.status(401).json({ error: 'GitHub access token is required' });
  }

  try {
    // Call the GitHub API to create a repository and upload files
    const repoUrl = await createGithubRepo(accessToken, projectData);
    res.status(200).json({ repoUrl });
  } catch (error) {
    console.error('Error creating GitHub repository:', error);
    res.status(500).json({ error: 'Failed to create GitHub repository' });
  }
}
