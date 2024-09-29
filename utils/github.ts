import fetch from 'node-fetch';

interface ProjectFile {
  dir: string; // File path (e.g., 'src/app.tsx')
  content: string; // File content
}

const GITHUB_API_BASE = 'https://api.github.com';

export async function createGithubRepo(accessToken: string, projectFiles: ProjectFile[], repoName: string): Promise<string> {
  // Step 1: Create a new GitHub repository
  const repoResponse = await fetch(`${GITHUB_API_BASE}/user/repos`, {
    method: 'POST',
    headers: {
      Authorization: `token ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: repoName, // Use the provided repo name
      private: false, // Set to 'true' if you want private repos
      auto_init: false, // We'll upload our own files
    }),
  });

  const repoJson = await repoResponse.json();
  if (!repoResponse.ok) {
    throw new Error(`GitHub API error: ${repoJson.message}`);
  }

  const repoUrl = repoJson.html_url;
  const repoFullName = repoJson.full_name;

  // Step 2: Upload files to the newly created repository
  for (const file of projectFiles) {
    await uploadFileToGithubRepo(accessToken, repoFullName, file.dir, file.content);
  }

  // Step 3: Return the repository URL
  return repoUrl;
}

async function uploadFileToGithubRepo(
  accessToken: string,
  repoName: string,
  filePath: string,
  fileContent: string
) {
  const contentBase64 = Buffer.from(fileContent).toString('base64');
  const response = await fetch(`${GITHUB_API_BASE}/repos/${repoName}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Add ${filePath}`,
      content: contentBase64,
    }),
  });

  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(`GitHub upload error for ${filePath}: ${errorJson.message}`);
  }
}
