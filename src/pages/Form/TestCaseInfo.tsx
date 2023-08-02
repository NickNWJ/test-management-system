import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';

const TestCaseInfo = () => {
  const [requirements, setRequirements] = useState();
  const [testCaseInfo, setTestCaseInfo] = useState();
  const [applications, setApplications] = useState();
  const [members, setMembers] = useState();

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>)=> {
    let name = event.target.name.value;
    let desc = event.target.description.value;
    let dateCreated = event.target.datecreated.value;
    let dateUpdated = event.target.dateupdated.value;
    let testSteps = event.target.teststeps.value;
    let status = event.target.status.value;
    let priority = event.target.priority.value;
    let type = event.target.type.value;
    let requirements = selectedRequirements;
    let testPlans = selectedTestPlans;
    let attachment = selectedFile;
    
    let expectedResult = event.target.expectedresult.value;
    let executedBy = event.target.executedby.value;
    let testEnvironment = event.target.testenvironment.value

    event.preventDefault();
  }

  const [selectedRequirements, setSelectedRequirements] = useState([]);
  
  const handleRequirementSelect = (event: { target: { value: any; }; }) => {
    const selectedOption = event.target.value;
    if (!selectedRequirements.includes(selectedOption)) {
      setSelectedRequirements([...selectedRequirements, selectedOption]);
    }
  };

  const handleRequirementRemove = (requirement: never) => {
    setSelectedRequirements(
      selectedRequirements.filter((selected) => selected !== requirement)
    );
  };


  const [selectedTestPlans, setSelectedTestPlans] = useState([]);

  const handleTestPlanSelect = (event) => {
    const selectedOption = event.target.value;
    if (!selectedTestPlans.includes(selectedOption)) {
      setSelectedTestPlans([...selectedTestPlans, selectedOption]);
    }
  };

  const handleTestPlanRemove = (testPlan) => {
    setSelectedTestPlans(
      selectedTestPlans.filter((selected) => selected !== testPlan)
    );
  };

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

  const getFileContentAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'List of Test Cases', link: '/test/test-cases' },
    { label: 'Test Cases', link: '/test/test-case/details' },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col">
        <div className="flex flex-col gap-9">
          {/* <!-- Input Fields --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Test Case's Info
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Title
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter test case title"
                    defaultValue={""}
                    required
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Date Created
                  </label>
                  <input
                    name="datecreated"
                    type="text"
                    defaultValue={new Date().toISOString().substring(0,10)}
                    placeholder="Active Input"
                    required
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                    disabled
                  />
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Date Modified
                  </label>
                  <input
                    name="dateupdated"
                    type=""
                    placeholder="-"
                    defaultValue={""}
                    required
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    disabled
                  />
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Assignee
                  </label>

                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </span>
                    <select name="executedBy" defaultValue={"Select User"} className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                      <option value="Select User" disabled>Select User</option>
                      <option value="1">Ng Wei Jian (U001)</option>
                      <option value="2">Tang Ning Kang (U002)</option>
                      <option value="2">Ng Bei Sheng (U003)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Status
                  </label>
                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                    </svg>

                    </span>
                    <select name="status" defaultValue={"Select Status"} required className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                      <option value="Select Status" disabled>Select Status</option>
                      <option value="1">Design</option>
                      <option value="2">Ready</option>
                      <option value="3">Completed</option>
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

                
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Type
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
                      name="type"
                      defaultValue={"Select Type"}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                      <option value="Select Type" disabled>
                        Select Type
                      </option>
                      <option value="1">Manual</option>
                      <option value="2">Automated</option>
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


                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Priority
                  </label>
                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.867 19.125h.008v.008h-.008v-.008z"
                      />
                    </svg>

                    </span>
                    <select name="priority" value={""} className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                      <option value="" disabled>Select Priority</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
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

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Associated Requirements
                  </label>
                  <div className="relative z-20 w-full rounded border border-stroke p-1.5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                    <div className="flex flex-wrap items-center">
                      {selectedRequirements.map((requirement) => (
                        <span
                          key={requirement}
                          className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                        >
                          {requirement}
                          <span
                            className="cursor-pointer pl-2 hover:text-danger"
                            onClick={() => handleRequirementRemove(requirement)}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                        </span>
                      ))}

                      <select
                        name="requirement"
                        id=""
                        defaultValue={"Select Requirement"}
                        required
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        onChange={handleRequirementSelect}
                      >
                        <option value="Select Requirement" disabled>
                          Select Requirement
                        </option>
                        <option value="REQ001">Login (REQ001)</option>
                        <option value="REQ002">Registration (REQ002)</option>
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
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Associated Test Plans
                  </label>
                  <div className="relative z-20 w-full rounded border border-stroke p-1.5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                    <div className="flex flex-wrap items-center">
                      {selectedTestPlans.map((testPlan) => (
                        <span
                          key={testPlan}
                          className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                        >
                          {testPlan}
                          <span
                            className="cursor-pointer pl-2 hover:text-danger"
                            onClick={() => handleTestPlanRemove(testPlan)}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                        </span>
                      ))}

                      <select
                        name="requirement"
                        id=""
                        defaultValue={"Select Requirement"}
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        required
                        onChange={handleTestPlanSelect}
                      >
                        <option value="Select Requirement" disabled>
                          Select Test Plan
                        </option>
                        <option value="TP001">TP001</option>
                        <option value="TP002">TP002</option>
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
                </div>


                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Test Environment
                  </label>
                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.867 19.125h.008v.008h-.008v-.008z"
                      />
                    </svg>

                    </span>
                    <select name="testenvironment" 
                    value={""} 
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                      <option value="" disabled>Select Test Environment</option>
                      <option value="Staging">Staging</option>
                      <option value="Production">Production</option>
                      <option value="Performance Testing Environment">Performance Testing Environment</option>
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


                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Description 
                  </label>
                  <textarea
                    name="description"
                    rows={6}
                    placeholder="Enter description"
                    defaultValue={""}
                    required
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                  ></textarea>
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Test Steps
                  </label>
                  <textarea
                    name="teststeps"
                    rows={6}
                    placeholder="Enter test steps"
                    defaultValue={""}
                    required
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                  ></textarea>
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Expected Results
                  </label>
                  <textarea
                    rows={6}
                    name="expectedresult"
                    placeholder="Enter Expected Results"
                    defaultValue={""}
                    required
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                  ></textarea>
                </div>

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                      Test Case Attachment 
                    </h3>
                  </div>
                  <div className="flex flex-col gap-5.5 p-6.5">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Attach file
                      </label>
                      <input
                        name="attachment"
                        type="file"
                        accept=".pdf, .xlsx, .xls, .jpeg, .jpg, .png"
                        defaultValue={""}
                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                        onChange={handleFileChange}
                      />
                    </div>
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

                <button
                  type="submit"
                  className="inline-flex items-center justify-center bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  Save
                </button>

              </div>
            </form>

          </div>


        </div>


      </div>
    </>
  );
};

export default TestCaseInfo;
