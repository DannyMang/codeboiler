import React, { useState } from 'react';

const ProjectForm = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [repoUrl, setRepoUrl] = useState('');

  const handleGenerateProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generateProject', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      setProjectData(data);  // Set generated project data to be displayed or used for export
    } catch (error) {
      console.error('Error generating project:', error);
    }
    setIsLoading(false);
  };

  const handleExportToGithub = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/exportToGithub', {
        method: 'POST',
        body: JSON.stringify({ projectData }),
        headers: { 'Content-Type': 'application/json' }
      });

      const { repoUrl } = await response.json();
      setRepoUrl(repoUrl);  // Set GitHub URL for the created repo
    } catch (error) {
      console.error('Error exporting to GitHub:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Describe your project..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleGenerateProject} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Project'}
      </button>

      {projectData && (
        <div>
          <button onClick={handleExportToGithub}>
            Export to GitHub
          </button>
        </div>
      )}

      {repoUrl && (
        <div>
          <p>Repository created: <a href={repoUrl}>{repoUrl}</a></p>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
