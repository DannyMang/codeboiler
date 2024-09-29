import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const CodeMirror = dynamic(
  () => {
    import("codemirror/lib/codemirror.css");
    import("codemirror/theme/material.css");
    import("codemirror/mode/javascript/javascript");
    import("codemirror/mode/css/css");
    import("codemirror/mode/htmlmixed/htmlmixed");
    return import("react-codemirror2").then((mod) => mod.Controlled);
  },
  { ssr: false }
);

interface CodeEditorProps {
  fileContent: string;
  onChange: (newContent: string) => void;
  filename?: string; // Make filename optional
}

const CodeEditor: React.FC<CodeEditorProps> = ({ fileContent, onChange, filename = '' }) => { // Provide default value
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const getMode = (filename: string) => {
    if (filename.endsWith('.js') || filename.endsWith('.ts') || filename.endsWith('.jsx') || filename.endsWith('.tsx')) {
      return 'javascript';
    }
    if (filename.endsWith('.css')) {
      return 'css';
    }
    if (filename.endsWith('.html')) {
      return 'htmlmixed';
    }
    return 'javascript'; // default
  };

  return (
    <CodeMirror
      value={fileContent}
      options={{
        mode: getMode(filename),
        theme: "material",
        lineNumbers: true,
      }}
      onBeforeChange={(editor, data, value) => {
        onChange(value);
        console.log("CodeEditor onChange called with:", value);
      }}
    />
  );
};

export default CodeEditor;