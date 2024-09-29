import { createGithubRepo } from '../../utils/github';

export default async function handler(req, res) {
  const accessToken = req.headers.authorization?.split(' ')[1]; // Assuming format: Bearer <token>
  const { projectData } = req.body;

  // Your logic to interact with GitHub API
  const repoUrl = await createGithubRepo(accessToken, projectData, 'Code-Boiler');
  
  res.status(200).json({ repoUrl });
}

