import React from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

interface CodeEditorProps {
  fileContent: string;
  onChange: (newContent: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ fileContent, onChange }) => {
  return (
    <CodeMirror
      value={fileContent}
      options={{
        mode: "javascript",
        theme: "material",
        lineNumbers: true,
      }}
      onBeforeChange={(editor, data, value) => onChange(value)}
    />
  );
};

export default CodeEditor;
