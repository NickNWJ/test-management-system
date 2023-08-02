import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

const CodeEditor = () => {
  const defaultValue = `/*** define your test script steps here like these ***/\nconst driver = await new Builder().forBrowser('chrome').build();
  \nconst scriptSteps = [
    {
      name: 'Accessing UTrust local home page',
      action: async () => {
        await driver.get('http://localhost:3000/');
      },
      message: 'UTrust Home Accessed',
      status: 'Passed',
      timeout: 2000,
    },
    {
      name: 'Accessing UTrust Login Page',
      action: async () => {
        await driver.get('http://localhost:3000/login');
      },
      message: 'UTrust Login Accessed',
      status: 'Passed',
      timeout: 2000,
    },
    {
      name: 'Entering email',
      action: async () => {
        const emailInput = await driver.findElement(By.css('input[placeholder="Enter your email"]'));
        await emailInput.sendKeys('uarehup@gmail.com');
      },
      message: 'Email entered',
      status: 'Passed',
    },
    // other actions  
  ];`;
  const [codeMiddle, setCodeMiddle] = useState(defaultValue);
  const [previousCodeMiddle, setPreviousCodeMiddle] = useState(defaultValue);
  const undo = () => {
    setCodeMiddle(previousCodeMiddle);
  };
  const restoreToDefault = () => {
    setPreviousCodeMiddle(codeMiddle);
    setCodeMiddle(defaultValue);
  };
  const handleCodeChange = (codeMiddle: React.SetStateAction<string>) => {
    setPreviousCodeMiddle(codeMiddle);
    setCodeMiddle(codeMiddle);
  };
  return (
    <>
      <div className="w-full rounded-t-3xl border-[1.5px] border-white drop-shadow-lg bg-gray py-4 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
      <Editor
        className="w-full py-3 pt-5 font-medium outline-none transition bg-white border-transparent"
        value={codeMiddle}
        onValueChange={handleCodeChange}
        placeholder={codeMiddle}
        highlight={(codeMiddle) => highlight(codeMiddle, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 18,
        }}
      />
      <div className="w-full rounded-b-3xl border-[1.5px] border-white drop-shadow bg-gray py-4 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
      <button className="font-bold text-xl" onClick={restoreToDefault}>Restore to Default</button>
    </>
  );
};

export default CodeEditor;