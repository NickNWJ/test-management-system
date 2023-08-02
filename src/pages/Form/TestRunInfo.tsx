import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import axios from 'axios';


import CodeEditor from '../CodeEditor/CodeEditor';
import Tooltip from '../../components/Tooltip';

import Alerts from '../UiElements/Alerts';

const TestRunInfo = () => {
  const defaultValue = 
  `/*** define your test script steps here like these ***/
  // define your driver
  // supported browser 'chrome', 'firefox', and 'edge'
  // replace the browser string to below, e.g: const driver = await new Builder().forBrowser('firefox').build();
  const driver = await new Builder().forBrowser('chrome').build();
  const scriptSteps = [
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

  const [selectedFile, setSelectedFile] = useState(null);
  const allowedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png"];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("file", file);

    if (file && allowedFileTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };


  const [codeMiddle, setCodeMiddle] = useState(defaultValue);
  const [previousCodeMiddle, setPreviousCodeMiddle] = useState(defaultValue);

  const restoreToDefault = () => {
    setPreviousCodeMiddle(codeMiddle);
    setCodeMiddle(defaultValue);
  };
  const handleCodeChange = (codeMiddle: React.SetStateAction<string>) => {
    setPreviousCodeMiddle(codeMiddle);
    setCodeMiddle(codeMiddle);
  };

  const getFileContentAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    console.log(codeMiddle);
    try {
      // Send the automation test script to your API
      const response = await axios.post('http://localhost:8888/api/test-cases/create', {
        automationTestScript: codeMiddle,
      });

      // Handle the response from the API
      console.log('API response:', response.data);
    } catch (error) {
      // Handle errors
      console.error('API error:', error);
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'List of Test Runs', link: '/test/test-runs' },
    { label: 'Execute Automation Test', link: '/test/test-run/details' },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <form>
        <div className="flex flex-col w-full">
          <div>
            <label className="mb-3 block text-black dark:text-white">
              Test Case ID
            </label>
            <div className="relative z-20 bg-white dark:bg-form-input">
              <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor"
                className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>

              </span>
              <select
                name="testcaseid"
                defaultValue={""}
                required
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                <option value="" disabled>
                  Select Test Case ID
                </option>
                <option value="1">TC001</option>
                <option value="2">TC002</option>
              </select>
              <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                      fill="#637381"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            {/* <!-- Textarea Fields --> */}
            <div className="rounded-3xl flex flex-row border border-stroke drop-shadow-xl bg-whiten shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex flex-col w-1/2">
                <label className="w-full rounded-t-3xl border-[1.5px] border-white drop-shadow-lg bg-gray py-4 px-5 
                outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter 
                dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-2xl bg-primary text-whiten">
                  Test Run Information
                </label>
                  <div>
                    <label className="w-full py-3 pt-5 pl-3 text-lg outline-none transition border-transparent">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter Test Run Name"
                      defaultValue={""}
                      required
                      className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                    ></input>
                  </div>

                  <div>
                    <label className="w-full py-3 pt-5 pl-3 text-lg outline-none transition border-transparent">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={6}
                      placeholder="Give This Test Run A Description"
                      defaultValue={""}
                      required
                      className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                    ></textarea>
                  </div>
                  
                  {selectedFile ? 
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                          Generated Test Result
                        </h3>
                      </div>
                      <div className="flex flex-col gap-5.5 p-6.5">
                        {selectedFile && (
                          <div className="flex flex-col h-full">
                            <span className="mb-3 block text-black dark:text-white">
                              Uploaded File Preview
                            </span>
                            <div className="flex">
                              <span className="font-bold underline underline-offset-0 text-indigo-500 pt-5 pb-5">{selectedFile.name}</span>
                              <button className="ml-2 text-white" onClick={handleFileRemove}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            </div>
                            <hr className="w-full bg-gray-300 text-shadow drop-shadow" />
                            {selectedFile.type === "application/pdf" ? (
                              <embed
                                src={URL.createObjectURL(selectedFile)}
                                type={selectedFile.type}
                                style={{ width: "100%", height: "650px" }}
                              />
                            ) : selectedFile.type === "image/png" ? (
                              <img
                                src={URL.createObjectURL(selectedFile)}
                                alt={selectedFile.name}
                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                              />
                            ) : (
                              <span>Invalid File</span>
                            )}
    
                          </div>
                        )}
                      </div>
                    </div>
                    : ""
                  }


              </div>

              <div className="flex flex-col w-5/6">
                <div className="flex flex-row bg-meta-5 justify-between text-center items-center rounded-t-3xl border-[1.5px] border-white drop-shadow-lg bg-gray py-2 px-5 
                outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter 
                dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-2xl drop-shadow text-whiten font-bold">
                  <label className="">
                    Test Scripts
                    </label>
                    <Tooltip message={"Execute Script"}>
                      <button onClick={handleSubmit} className="drop-shadow-xl inline-flex items-center justify-center rounded-full bg-meta-3 py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 hover:scale-105">
                        Run 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </Tooltip>
                    <Tooltip message={"Reset Script Input"}>
                      <span className="inline-flex items-center justify-center 
                      rounded-full py-2 px-4 text-center font-medium bg-danger
                      text-whiter hover:bg-opacity-90 lg:px-4 xl:px-4 cursor-pointer drop-shadow-xl" onClick={restoreToDefault}>Reset Script</span>
                    </Tooltip>
                  </div>
                  

                  <Editor
                    className="w-full py-3 pt-5 font-medium outline-none transition bg-whiten border border-primary"
                    value={codeMiddle}
                    onValueChange={handleCodeChange}
                    placeholder={codeMiddle}
                    highlight={(codeMiddle) => highlight(codeMiddle, languages.js)}
                    padding={10}
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 16,
                    }}
                  />
                <div className="w-full rounded-b-3xl border-[1.5px] border-white drop-shadow bg-gray py-4 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />

              </div>

            </div>

          </div>
        </div>
      </form>
    </>
  );
};

export default TestRunInfo;
