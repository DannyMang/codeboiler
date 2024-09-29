import React, { useState } from 'react';

const ProjectForm = () => {
  const [prompt, setPrompt] = useState(''); // Project description prompt
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [projectData, setProjectData] = useState(null); // Holds the generated project data
  const [repoUrl, setRepoUrl] = useState(''); // Holds the GitHub repo URL after export

  // Function to handle project generation based on the user's prompt
  const handleGenerateProject = async () => {
    setIsLoading(true); // Set loading state to true while generating the project
    try {
      const response = await fetch('/api/generateProject', {
        method: 'POST',
        body: JSON.stringify({ prompt }), // Send the prompt to the backend
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json(); // Get the generated project data
      setProjectData(data); // Set the project data in state for display or further actions
    } catch (error) {
      console.error('Error generating project:', error); // Log any errors
    }
    setIsLoading(false); // Set loading state back to false after completion
  };

  // Function to handle exporting the generated project to GitHub
  const handleExportToGithub = async () => {
    setIsLoading(true); // Set loading state to true while exporting
    try {
      const response = await fetch('/api/exportToGithub', {
        method: 'POST',
        body: JSON.stringify({ projectData }), // Send project data to the export API
        headers: { 'Content-Type': 'application/json' },
      });

      const { repoUrl } = await response.json(); // Get the repo URL from the API response
      setRepoUrl(repoUrl); // Set the GitHub repo URL to be displayed in the UI
    } catch (error) {
      console.error('Error exporting to GitHub:', error); // Log any errors
    }
    setIsLoading(false); // Set loading state back to false after completion
  };

  return (
    <div className="project-form-container">
      <input
        type="text"
        placeholder="Describe your project..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="input-prompt"
      />
      <button 
        onClick={handleGenerateProject} 
        disabled={isLoading || !prompt}
        className="generate-btn"
      >
        {isLoading ? 'Generating...' : 'Generate Project'}
      </button>

      {/* Display the export button only if projectData is available */}
      {projectData && (
        <div className="export-section">
          <button onClick={handleExportToGithub} className="export-btn">
            Export to GitHub
          </button>
        </div>
      )}

      {/* Display the GitHub repo URL once it's available */}
      {repoUrl && (
        <div className="repo-section">
          <p>Repository created: <a href={repoUrl} target="_blank" rel="noopener noreferrer">{repoUrl}</a></p>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
