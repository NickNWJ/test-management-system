import {useState} from 'react';
import Breadcrumb from '../../components/Breadcrumb';

const DefectInfo = () => {

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>)=> {
    let name = event.target.name.value;
    let description = event.target.description.value;
    let status = event.target.status.value;
    let severity = event.target.severity.value;
    let priority = event.target.priority.value;
    let reproduceSteps = event.target.reproducesteps.value;
    let dateCreated = event.target.datecreated.value;
    let dateUpdated = event.target.dateupdated.value;
    let detectedBy = event.target.detectedby.value;
    let resolvedBy = event.target.resolvedby.value;
    let testResult = event.target.testresult.value;
    let attachment = selectedFile;

    event.preventDefault();
  }

  const [selectedTestCases, setSelectedTestCases] = useState([]);

  const handleTestCaseSelect = (event) => {
    const selectedOption = event.target.value;
    if (!selectedTestPlans.includes(selectedOption)) {
      setSelectedTestCases([...selectedTestCases, selectedOption]);
    }
  };

  const handleTestCaseRemove = (testCase) => {
    setSelectedTestCases(
      selectedTestCases.filter((selected) => selected !== testCase)
    );
  };

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
    { label: 'List of Defects', link: '/defects' },
    { label: 'Defect', link: '/defect/details' },
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
                Defect's Info
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter Defect Name"
                    defaultValue={""}
                    required
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Enter Description"
                    defaultValue={""}
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                  ></textarea>
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Reproduce Steps
                  </label>
                  <textarea
                    name="reproducesteps"
                    rows={4}
                    placeholder="Enter Reproduce Steps"
                    defaultValue={""}
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                  ></textarea>
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Created Date
                  </label>
                  <input
                    name="datecreated"
                    type="date"
                    placeholder="-"
                    defaultValue={new Date().toISOString().substring(0,10)}
                    required
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    disabled
                  />
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
                      <option value="1">Open</option>
                      <option value="2">Ongoing</option>
                      <option value="3">Resolved</option>
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
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                  ></textarea>
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Detected By
                  </label>
                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.478 1.6a.75.75 0 01.273 1.025 3.72 3.72 0 00-.425 1.122c.058.057.118.114.18.168A4.491 4.491 0 0112 2.25c1.413 0 2.673.651 3.497 1.668.06-.054.12-.11.178-.167a3.717 3.717 0 00-.426-1.126.75.75 0 111.298-.75 5.22 5.22 0 01.671 2.045.75.75 0 01-.187.582c-.241.27-.505.52-.787.749a4.495 4.495 0 01.216 2.1c-.106.792-.753 1.295-1.417 1.403-.182.03-.364.057-.547.081.152.227.273.476.359.741a23.122 23.122 0 003.832-.802 23.241 23.241 0 00-.345-2.634.75.75 0 011.474-.28c.21 1.115.348 2.256.404 3.418a.75.75 0 01-.516.749c-1.527.5-3.119.855-4.76 1.05-.074.38-.22.735-.423 1.05a24.61 24.61 0 015.943 1.358.75.75 0 01.492.75 24.665 24.665 0 01-1.189 6.25.75.75 0 01-1.425-.47 23.141 23.141 0 001.077-5.307c-.5-.168-1.009-.32-1.524-.454.068.234.104.484.104.746 0 3.956-2.521 7.5-6 7.5-3.478 0-6-3.544-6-7.5 0-.262.037-.511.104-.746-.514.134-1.022.286-1.522.454a23.14 23.14 0 001.077 5.308.75.75 0 01-1.425.468 24.663 24.663 0 01-1.19-6.25.75.75 0 01.493-.749 24.593 24.593 0 014.964-1.24h.01c.321-.046.644-.085.969-.118a2.982 2.982 0 01-.424-1.05 24.614 24.614 0 01-4.76-1.05.75.75 0 01-.516-.75c.057-1.161.194-2.302.405-3.417a.75.75 0 011.474.28c-.164.862-.28 1.74-.345 2.634 1.237.37 2.517.641 3.832.802.085-.265.207-.514.359-.74a18.732 18.732 0 01-.547-.082c-.664-.108-1.311-.611-1.417-1.403a4.535 4.535 0 01.217-2.103 6.788 6.788 0 01-.788-.751.75.75 0 01-.187-.583 5.22 5.22 0 01.67-2.04.75.75 0 011.026-.273z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <select name="detectedby" required defaultValue={"Select Member"} className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                      <option value="Select Member" disabled>Select Member</option>
                      <option value="userid1">Ng Wei Jian</option>
                      <option value="userid2">Tang Ning Kang</option>
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
                    Resolved By
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
                    <select name="resolvedby" required defaultValue={"Select Member"} className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                      <option value="Select Member" disabled>Select Member</option>
                      <option value="userid1">Ng Wei Jian</option>
                      <option value="userid2">Tang Ning Kang</option>
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
                
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                      Defect Attachment
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

export default DefectInfo;
