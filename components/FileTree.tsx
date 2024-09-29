import React, { useState } from 'react';

interface FileTreeProps {
  files: { dir: string; content: string; }[];
  onSelectFile: (file: { dir: string; content: string }) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ files, onSelectFile }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['Root']));

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const buildFileTree = (files: { dir: string; content: string; }[]) => {
    const tree: any = {};
    files.forEach(file => {
      const parts = file.dir.split('/');
      let current = tree;
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = file;
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      });
    });
    return tree;
  };

  const renderTree = (node: any, path: string = '') => {
    if (node.dir && node.content) {
      return (
        <div key={node.dir} onClick={() => onSelectFile(node)} style={{ cursor: 'pointer', color: 'black' }}>
          {node.dir.split('/').pop()}
        </div>
      );
    }

    return (
      <div key={path}>
        <div onClick={() => toggleFolder(path)} style={{ cursor: 'pointer', color: 'black' }}>
          {expandedFolders.has(path) ? '▼' : '▶'} {path.split('/').pop() || 'Root'}
        </div>
        {expandedFolders.has(path) && (
          <div style={{ marginLeft: '20px' }}>
            {Object.entries(node).map(([key, value]) => renderTree(value, path ? `${path}/${key}` : key))}
          </div>
        )}
      </div>
    );
  };

  const fileTree = buildFileTree(files);

  return <div style={{ backgroundColor: 'white', padding: '10px' }}>{renderTree(fileTree)}</div>;
};

export default FileTree;