import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useRouter } from "next/router";

interface ProjectData {
  name: string;
  files: { dir: string; content: string }[];
}

const ProjectForm: React.FC = () => {
  const { data: session } = useSession(); // Call useSession once at the top
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const accessToken = session.accessToken;
const router = useRouter()
  const handleGenerateProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generateProject", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setProjectData(data);
    } catch (error) {
      console.error("Error generating project:", error);
    }
    setIsLoading(false);
  };

  const handleExportToGithub = async () => {
    setIsLoading(true);

    if (!accessToken) {
      console.error("No access token available");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/exportToGithub", {
        method: "POST",
        body: JSON.stringify({ projectData, accessToken }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Use session here
        },
      });

      const { repoUrl } = await response.json();

      setRepoUrl(repoUrl);
      router.push(repoUrl)
    } catch (error) {
      console.error("Error exporting to GitHub:", error);
    }

    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className="flex flex-col w-full min-h-screen z-50 items-center justify-center fixed backdrop-blur-lg">
          <Loader />
        </div>
      )}

      <motion.div
        className="flex items-center justify-center flex-col w-full min-h-screen bg-gradient-to-br from-purple-600 to-blue-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex flex-col space-y-6 items-center w-full max-w-md p-8 bg-white bg-opacity-10 rounded-xl backdrop-filter backdrop-blur-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.h1
            className="text-6xl font-bold text-white text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            CodeBoiler
          </motion.h1>
          <motion.h2
            className="text-2xl text-white text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            yo we boilin&apos;
          </motion.h2>
          <motion.input
            type="text"
            placeholder="Describe your project..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="input-prompt text-gray-800 w-full bg-white bg-opacity-50 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          />
          <motion.button
            onClick={handleGenerateProject}
            disabled={isLoading || !prompt}
            className="mt-4 p-3 rounded-full text-white cursor-pointer w-full bg-purple-500 hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            {isLoading ? "Generating..." : "Generate Project"}
          </motion.button>
          <motion.button
            onClick={()=>{signOut()}}
            className="mt-4 p-3 rounded-full text-white cursor-pointer w-full bg-gray-500 hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            Logout
          </motion.button>
        </motion.div>

        {projectData && (
          <motion.div
            className="export-section mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={handleExportToGithub}
              className="export-btn bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition duration-300 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Export to GitHub
            </motion.button>
          </motion.div>
        )}

        {repoUrl && (
          <motion.div
            className="repo-section mt-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p>
              Repository created:{" "}
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-100 transition"
              >
                {repoUrl}
              </a>
            </p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default ProjectForm;
