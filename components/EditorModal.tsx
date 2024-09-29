import React, { useState } from "react";
import Sidebar from "./Sidebar";
import CodeEditor from "./CodeEditor"; // Your custom CodeEditor or react-codemirror2
import { motion } from "framer-motion";
interface EditorModalProps {
  projectData: { dir: string; content: string; }[] | null;
  onClose: () => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ projectData, onClose }) => {
  console.log(projectData)
  const [selectedFile, setSelectedFile] = useState<{ dir: string; content: string; } | null>(
    projectData && projectData.length > 0 ? projectData[0] : null
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-lg justify-between w-4/5 h-4/5 shadow-lg flex">
        <Sidebar
          files={projectData}
          onSelectFile={(file) => setSelectedFile(file)}
        />
        <div className="flex flex-col w-full p-4">
          <CodeEditor
            fileContent={selectedFile.content}
            onChange={(newContent) => {
              setSelectedFile({ ...selectedFile, content: newContent });
            }}
          />
        </div>
        <button
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default EditorModal;
