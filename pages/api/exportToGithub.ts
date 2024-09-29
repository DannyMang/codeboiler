import { NextApiRequest, NextApiResponse } from 'next';
import { createGithubRepo } from '../../utils/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { projectData } = req.body;

    // Ensure project data is provided
    if (!projectData || !projectData.name || !projectData.files) {
      return res.status(400).json({ error: 'Invalid project data' });
    }

    // Call the GitHub API to create a repository and upload files
    const repoUrl = await createGithubRepo('YOUR_GITHUB_ACCESS_TOKEN', projectData);

    return res.status(200).json({ repoUrl });
  } catch (error) {
    console.error('Error exporting project to GitHub:', error);
    return res.status(500).json({ error: 'Failed to export project to GitHub' });
  }
}
