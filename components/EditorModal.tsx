import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import CodeEditor from "./CodeEditor";
import { motion } from "framer-motion";
interface EditorModalProps {
  projectData: { dir: string; content: string; }[] | null;
  onClose: (updatedProjectData: { dir: string; content: string; }[] | null) => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ projectData, onClose }) => {
  const [localProjectData, setLocalProjectData] = useState(projectData);
  const [selectedFile, setSelectedFile] = useState<{ dir: string; content: string; } | null>(null);

  useEffect(() => {
    if (localProjectData && localProjectData.length > 0) {
      setSelectedFile(localProjectData[0]);
    }
  }, [localProjectData]);
  
  // When selecting a file from the sidebar
  const handleSelectFile = (file: { dir: string; content: string; }) => {
    setSelectedFile(file);
    console.log("Selected new file:", file);
  };

  const handleFileChange = (newContent: string) => {
    if (selectedFile && localProjectData) {
      const updatedFile = { ...selectedFile, content: newContent };
      setSelectedFile(updatedFile);
      
      const updatedProjectData = localProjectData.map(file => 
        file.dir === updatedFile.dir ? updatedFile : file
      );
      setLocalProjectData(updatedProjectData);
      
      console.log("Updated file:", updatedFile);
      console.log("Updated project data:", updatedProjectData);
    }
  };

  const handleClose = () => {
    onClose(localProjectData);
  };

  if (!localProjectData || localProjectData.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
     <div className="bg-white rounded-lg w-full h-full max-w-6xl flex flex-row">
  <Sidebar
    files={localProjectData}
    onSelectFile={handleSelectFile}
  />
  <div className="flex-grow p-4 overflow-auto">
    {selectedFile ? (
      <CodeEditor
        key={selectedFile?.dir}
        fileContent={selectedFile?.content || ""}
        onChange={handleFileChange}
      />
    ) : (
      <p>Select a file to start editing</p>
    )}
  </div>
</div>

<button
  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
  onClick={handleClose} // Save changes on close
>
  Close
</button>

    </motion.div>
  );
};

export default EditorModal;