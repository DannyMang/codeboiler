import React, { useEffect } from "react";
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