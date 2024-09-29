import React from "react";

interface SidebarProps {
  files: { dir: string }[];
  onSelectFile: (file: { dir: string; content: string }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ files, onSelectFile }) => {
  return (
    <div className=" bg-gray-900 text-gray-400 w-2/5  p-4 h-full overflow-y-auto">
      <ul>
        {files.map((file) => (
          <li
            key={file.dir}
            className="p-2 cursor-pointer hover:bg-gray-300 rounded"
            onClick={() => onSelectFile(file)}
          >
            {file.dir}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
