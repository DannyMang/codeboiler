import { createGithubRepo } from '../../utils/github';

export default async function handler(req, res) {
  const { projectData } = req.body;

  // Call the GitHub API to create a repository and upload files
  const repoUrl = await createGithubRepo('YOUR_GITHUB_ACCESS_TOKEN', projectData);

  res.status(200).json({ repoUrl });
}
