import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

interface ProjectData {
  name: string;
  files: { dir: string; content: string }[];
}

const ProjectForm: React.FC = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [repoUrl, setRepoUrl] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: "This is a simulated AI response.", sender: 'ai' }]);
      }, 1000);
    }
  };

  const handleGenerateProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generateProject', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setProjectData(data);
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
      setRepoUrl(repoUrl);
    } catch (error) {
      console.error('Error exporting to GitHub:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center flex-row w-full min-h-screen">
      <div className="flex flex-col space-y-4 items-center w-1/2">
        <h1 className="text-6xl text-white text-center">CodeBoiler</h1>
        <h2 className="text-2xl text-white text-center">yo we boilin'</h2>
      <input
        type="text"
        placeholder="Describe your project..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="input-prompt text-gray-300 w-full bg-transparent p-4 "
      />
      <button 
        onClick={handleGenerateProject} 
        disabled={isLoading || !prompt}
        className=" mt-8 p-3 rounded-full text-black cursor-pointer w-1/2 bg-gray-300 "
      >
        {isLoading ? 'Generating...' : 'Generate Project'}
      </button>

      </div>

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