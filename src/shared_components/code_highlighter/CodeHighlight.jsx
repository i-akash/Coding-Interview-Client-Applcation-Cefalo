import React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import json from "react-syntax-highlighter/dist/cjs/languages/hljs/json";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("json", json);

export default function CodeHighlight({
  solutionCode,
  language = "javascript",
  onSelectLineNumber,
  lineClass,
}) {
  return (
    <SyntaxHighlighter
      language={language}
      style={docco}
      showLineNumbers={true}
      lineNumberProps={{
        onClick: (event) => onSelectLineNumber(event),
        class: lineClass,
      }}
    >
      {solutionCode}
    </SyntaxHighlighter>
  );
}
