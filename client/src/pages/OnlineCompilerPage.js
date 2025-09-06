import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css';
import './OnlineCompilerPage.css';

const languageConfig = {
  javascript: {
    id: 93,
    syntax: languages.js,
    boilerplate: `// Welcome to the CodeQuark Compiler!\n\nfunction greet(name) {\n  console.log("Hello, " + name + "!");\n}\n\ngreet("World");`,
  },
  python: {
    id: 71,
    syntax: languages.python,
    boilerplate: `# Welcome to the CodeQuark Compiler!\n\ndef greet(name):\n    print(f"Hello, {name}!")\n\ngreet("World")`,
  },
  c: {
    id: 50,
    syntax: languages.c,
    boilerplate: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  },
  cpp: {
    id: 54,
    syntax: languages.cpp,
    boilerplate: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
  },
};

function OnlineCompilerPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(languageConfig.javascript.boilerplate);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCode(languageConfig[selectedLanguage].boilerplate);
  }, [selectedLanguage]);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleRunCode = async () => {
    setOutput('');
    setLoading(true);
    try {
      const languageId = languageConfig[selectedLanguage].id;
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/compiler/run`,
        { code, languageId }
      );
      if (data.stdout) {
        setOutput(data.stdout);
      } else if (data.stderr) {
        setOutput(`Error: ${data.stderr}`);
      } else if (data.compile_output) {
        setOutput(`Compilation Error: ${data.compile_output}`);
      } else if (data.message) {
        setOutput(data.message);
      } else {
        setOutput('Code executed successfully, but produced no output.');
      }
    } catch (error) {
      console.error("Error running code:", error);
      const message = error.response?.data?.message || 'An unexpected error occurred.';
      setOutput(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compiler-page-container">
      <div className="compiler-controls">
        <div className="language-selector-wrapper">
          <label htmlFor="language-select">Language:</label>
          <select id="language-select" value={selectedLanguage} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <button className="run-button" onClick={handleRunCode} disabled={loading}>
          {loading ? 'Running...' : 'Run Code'}
        </button>
      </div>

      <div className="compiler-layout">
        <div className="editor-panel">
          <div className="editor-wrapper">
            <Editor
              value={code}
              onValueChange={newCode => setCode(newCode)}
              highlight={code => highlight(code, languageConfig[selectedLanguage].syntax, selectedLanguage)}
              padding={15}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                outline: 0,
              }}
            />
          </div>
        </div>
        <div className="output-panel">
          <h3>Output</h3>
          <pre className="output-content">{loading ? 'Executing...' : output}</pre>
        </div>
      </div>
    </div>
  );
}

export default OnlineCompilerPage;