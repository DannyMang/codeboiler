export async function createGithubRepo(accessToken, projectData) {
  const repoResponse = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      'Authorization': `token ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'generated-react-project',
      private: false
    })
  });

  const repo = await repoResponse.json();

  // Upload each file to the repository
  for (const file of projectData) {
    await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/${file.dir}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Adding ${file.dir}`,
        content: Buffer.from(file.content).toString('base64')
      })
    });
  }

  return repo.html_url;
}