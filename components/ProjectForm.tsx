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
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold">Project Generator</h1>
        {session && <p>Signed in as {session.user?.name}</p>}
      </header>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
              message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-800 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Message ChatGPT..."
            className="flex-grow p-3 bg-transparent outline-none"
          />
          <button onClick={handleSendMessage} className="p-3 text-gray-400 hover:text-white">
            <Send size={20} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Describe your project..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-4 p-2 w-full bg-gray-800 rounded-md"
        />
        <button
          onClick={handleGenerateProject}
          disabled={isLoading || !prompt}
          className="mt-4 p-2 bg-blue-600 rounded-md disabled:bg-blue-400"
        >
          {isLoading ? 'Generating...' : 'Generate Project'}
        </button>
        {projectData && (
          <button
            onClick={handleExportToGithub}
            className="mt-4 ml-4 p-2 bg-green-600 rounded-md"
          >
            Export to GitHub
          </button>
        )}
        {repoUrl && (
          <div className="mt-4">
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              View created repository
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;