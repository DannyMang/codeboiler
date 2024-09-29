import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import FileTree from "./FileTree";

const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });

interface EditorModalProps {
  projectData: { dir: string; content: string; }[] | null;
  onClose: (updatedProjectData: { dir: string; content: string; }[] | null) => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ projectData, onClose }) => {
  const [localProjectData, setLocalProjectData] = useState(projectData);
  const [selectedFile, setSelectedFile] = useState<{ dir: string; content: string; } | null>(
    null
  );

  // When selecting a file from the sidebar
 
  const handleClose = () => {
    onClose(localProjectData);
  };

  if (!localProjectData || localProjectData.length === 0) {
    return null;
  }

  const isBinaryFile = (content: string) => {
    // Simple check for binary content (you might want to improve this)
    return /[\x00-\x08\x0E-\x1F]/.test(content);
  };
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-lg justify-between w-4/5 h-4/5 shadow-lg flex">
        <div className="w-1/4 overflow-auto">
          <FileTree
            files={projectData || []}
            onSelectFile={(file) => setSelectedFile(file)}
          />
        </div>
        <div className="flex flex-col w-3/4 p-4">
          {selectedFile && (
            isBinaryFile(selectedFile.content) ? (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-black">{selectedFile.dir}</h2>
                <p className="text-black">[Binary file] Contents cannot be displayed</p>
              </div>
            ) : (
              <CodeEditor
  fileContent={selectedFile.content}
  onChange={(newContent) => {
    console.log(selectedFile)
    const updatedFile = { ...selectedFile, content: newContent };
    console.log(updatedFile)
    setSelectedFile(updatedFile);
    
    // Update localProjectData
    setLocalProjectData(prevData => 
      prevData.map(file => 
        file.dir === updatedFile.dir ? updatedFile : file
      )
    );
  }}
  filename={selectedFile.dir}
/>
            )
          )} 
        </div>
        <button
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default EditorModal;