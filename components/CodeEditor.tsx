import React, { useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

interface CodeEditorProps {
  fileContent: string;
  onChange: (newContent: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ fileContent, onChange }) => {
  useEffect(() => {
    console.log("CodeEditor received new content:", fileContent);
  }, [fileContent]);

  return (
    <CodeMirror
      value={fileContent}
      options={{
        mode: "javascript",
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