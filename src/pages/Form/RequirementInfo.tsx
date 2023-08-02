import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SuccessDialog from "../UiElements/Success";
import ErrorDialog from "../UiElements/Error";
import ConfirmationDialog from "../UiElements/Confirmation";
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from "../../context/Auth";
import Loader from '../../common/Loader';
import FilePreview from '../FilePreview/FilePreview';

/* Add, Edit Requirement */
const RequirementInfo = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [requirementInfo, setRequirementInfo] = useState();
  const [applications, setApplications] = useState([]);
  const [application, setApplication] = useState(null);
  const [pageType, setPageType] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [members, setMembers] = useState();
  const [selectedFile, setSelectedFile] = useState([]);

  const [testCases, setTestCases] = useState();
  const [testPlans, setTestPlans] = useState();

  const navigate = useNavigate();

  // Get the query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  const fetchRequirements = async () => {
    if (type === "edit" || type === "view") {
      try {
        const response = await fetch(`http://localhost:8888/api/requirements/requirement/${id}`);
        if (response.ok) {
          console.log(id + " <- id");
          const data = await response.json();
          setRequirementInfo(data);
          if (data !== undefined && data.attachments !== undefined) {
            setSelectedFile(data.attachments);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (showSuccessDialog) {
      const timer = setTimeout(() => {
        setShowSuccessDialog(false);
        navigate('/requirements');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [navigate, showSuccessDialog])

  useEffect(() => {
    if (showErrorDialog) {
      const timer = setTimeout(() => {
        setShowErrorDialog(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showErrorDialog])

  useEffect(() => {
    // Determine the page type based on the query parameters
    if (type === 'view' || type === 'edit') {
      setPageType(type);
    } else {
      setPageType("new");
    }

    fetchRequirements();
  }, [])

  useEffect(() => {
    const fetchTestPlans = async () => {
      try {
        const response = await fetch(`http://localhost:8888/api/testPlans/requirement/${id}`);
        if (response.ok) {
          console.log(id + " <- id");
          const data = await response.json();
          setRequirementInfo(data[0]);
          setSelectedFile(data[0].attachment);
        }
      } catch (error) {
        console.error(error);
      }
    }

    // Determine the page type based on the query parameters
    if (type === 'view' || type === 'edit') {
      setPageType(type);
    } else {
      setPageType("new");
    }

    fetchRequirements();
  }, [])

  useEffect(() => {
    const fetchTestPlans = async () => {
      try {
        const response = await fetch("http://localhost:8888/api/test-plans/all");
        if (response.ok) {
          const data = await response.json();
          setTestPlans(data);
        } else {
          throw new Error("Failed to fetch test plan");
        }
      } catch (error) {
        console.error(error);
        // Handle error state or display error message
      }
    };

    fetchTestPlans();
  }, [])

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await fetch("http://localhost:8888/api/test-cases/all");
        if (response.ok) {
          const data = await response.json();
          setTestCases(data);
        } else {
          throw new Error("Failed to fetch test cases");
        }
      } catch (error) {
        console.error(error);
        // Handle error state or display error message
      }
    };

    fetchTestCases();
  }, [])

  const handleEditClick = (event) => {
    window.location.search = `?id=${requirementInfo.ID}&type=edit`;
    event.preventDefault();
  };


  const allowedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png"];

  const handleFileChange = (event) => {
    const files = event.target.files;
    console.log("files", files);
  
    const validFiles = Array.from(files).filter((file) =>
      allowedFileTypes.includes(file.type)
    );
  
    if (validFiles.length > 0) {
      setSelectedFile([...selectedFile, ...files]);
      event.target.attachment = [...selectedFile, ...files];
      event.target.files = [...selectedFile, ...files];
    } else {
      setSelectedFile([]);
      event.target.attachment = [];
      event.target.files = [];
    }
  };

  const handleFileRemove = (index) => {
    const updatedFiles = [...selectedFile];
    updatedFiles.splice(index, 1);
    setSelectedFile(updatedFiles);
  };

  const handleFileRemoveAll = (event) => {
    setSelectedFile([]);
    event.target.attachment = [];
  };

  const getFileContentAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let formData = new FormData();
    formData.append('title', event.target.name.value);
    formData.append('description', event.target.description.value);
    formData.append('status', event.target.status.value);
    formData.append('priority', event.target.priority.value);
    formData.append('type', event.target.type.value);
    formData.append('dateCreated', event.target.datecreated.value);
    formData.append('dateUpdated', event.target.dateupdated.value);
    console.log("date created " + event.target.datecreated.value);
    // Append each attachment to the formData with the same key name 'attachment'
    for (const file of event.target.attachment.files) {
      formData.append('attachment', file);
    }
    if (type === 'edit') {
      formData.append('createdBy', requirementInfo.createdBy);
    } else {
      formData.append('createdBy', user.ID);
    }

    formData.append('testCase', selectedTestCases);
    formData.append('testPlan', selectedTestPlans);
  
    try {
      console.log("got?");
      const response = type === 'edit' && id
        ? await axios.post(`http://localhost:8888/api/requirements/update/${requirementInfo.ID}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Set the proper content type for file uploads
            },
          })
        : await axios.post('http://localhost:8888/api/requirements/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Set the proper content type for file uploads
            },
          });
  
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(`Successfully ${type === 'edit' ? 'updated' : 'added'} new requirement. Redirecting you to the application list.`);
        setShowSuccessDialog(true);
      } else {
        throw new Error(`Failed to ${type === 'edit' ? 'update' : 'create'} requirements`);
      }
    } catch (error) {
      console.log(`Error -> ${error}`);
      setErrorMessage('Something went wrong! Please try again.');
      setShowErrorDialog(true);
    }
  };
  
  const [selectedTestCases, setSelectedTestCases] = useState([]);
  const handleTestCaseSelect = (event: { target: { value: any; }; }) => {
    const selectedOption = event.target.value;
    if (!selectedTestCases.includes(selectedOption)) {
      setSelectedTestCases((prevTestCases) => [...prevTestCases, selectedOption]);
    } if (selectedTestCases.length === 0) {
      setSelectedTestCases
    }
  };
  const handleTestCaseRemove = (testCase: never) => {
    setSelectedTestCases((prevTestCases) =>
    prevTestCases.filter((selected) => selected !== testCase)
    );
  };

  const [selectedTestPlans, setSelectedTestPlans] = useState([]);
  const handleTestPlanSelect = (event) => {
    const selectedOption = event.target.value;
    if (!selectedTestPlans.includes(selectedOption)) {
      setSelectedTestPlans((prevTestPlans) => [...prevTestPlans, selectedOption]);
    }  if (selectedTestPlans.length === 0) {
      setSelectedTestPlans
    }
  };
  
  const handleTestPlanRemove = (testPlan) => {
    setSelectedTestPlans((prevTestPlans) =>
      prevTestPlans.filter((selected) => selected !== testPlan)
    );
  };

  if (requirementInfo && requirementInfo.length === 0) {
    return <div>Loading...</div>;
  }

  // Determine whether the buttons should be disabled based on the page type
  const isDisabled = pageType === 'view';
  
  const breadcrumbItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'List of Requirement', link: '/requirements' },
    { label: `Requirement Info ${(requirementInfo && requirementInfo.ID) !== undefined ? "- ("
    +requirementInfo.ID+") "
    : ""}`, link: '/requirement/details' },
  ];
  
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      {
        loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex flex-col gap-9">
              {/* <!-- Input Fields --> */}
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Requirement's Info
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
                        value={(requirementInfo && requirementInfo.title) !== undefined ? requirementInfo.title : ""}
                        onChange={(e) => {
                          setRequirementInfo(prevReq => ({
                            ...prevReq,
                            title: e.target.value
                          }));
                        }}
                        placeholder="Enter Requirement Title"
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        required
                        disabled={isDisabled}
                      />
                    </div>

                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Date Created
                      </label>
                      <input
                        name="datecreated"
                        type="date"
                        placeholder="Active Input"
                        value={(requirementInfo && requirementInfo.dateCreated) !== undefined ? requirementInfo.dateCreated.substring(0,10) : new Date().toISOString().substring(0,10)}
                        onChange={(e) => {
                          setRequirementInfo(prevReq => ({
                            ...prevReq,
                            dateCreated: e.target.value
                          }));
                        }}
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
                        type="date"
                        placeholder="-"
                        value={(requirementInfo && requirementInfo.dateUpdated) !== undefined && (requirementInfo && requirementInfo.dateUpdated) !== null ? requirementInfo.dateUpdated.substring(0,10) : ""}
                        onChange={(e) => {
                          setRequirementInfo(prevReq => ({
                            ...prevReq,
                            dateUpdated: e.target.value
                          }));
                        }}
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
                        <select 
                          name="status" 
                          value={(requirementInfo && requirementInfo.status) !== undefined && (requirementInfo && requirementInfo.status) !== null ? requirementInfo.status : ''}
                          onChange={(e) => {
                            setRequirementInfo(prevReq => ({
                              ...prevReq,
                              status: e.target.value
                            }));
                          }}
                          className="relative z-20 w-full appearance-none rounded border 
                          border-stroke bg-transparent py-3 px-12 outline-none 
                          transition focus:border-primary active:border-primary 
                          dark:border-form-strokedark dark:bg-form-input"
                          required
                          disabled={isDisabled}
                        >
                          <option value="" disabled>Select Requirement Status</option>
                          <option value="Active">Active</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Completed">Completed</option>
                          <option value="Closed">Closed</option>
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
                          value={(requirementInfo && requirementInfo.type) !== null && (requirementInfo && requirementInfo.type) !== undefined ? requirementInfo.type : ""}
                          onChange={(e) => {
                            setRequirementInfo(prevReq => ({
                              ...prevReq,
                              type: e.target.value
                            }));
                          }}
                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                          required
                          disabled={isDisabled}
                        >
                          <option value="" disabled>
                            Select Type
                          </option>
                          <option value="Functional">Functional</option>
                          <option value="Non-Functional">Non-Functional</option>
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
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                          strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" 
                            d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 
                            9m0 0L21 12.75M17.25 9v12" />
                          </svg>
                        </span>
                        <select 
                          name="priority" 
                          value={((requirementInfo && requirementInfo.priority) !== undefined && (requirementInfo && requirementInfo.priority) !== null) ? requirementInfo.priority : ""}
                          onChange={(e) => {
                            setRequirementInfo(prevReq => ({
                              ...prevReq,
                              priority: e.target.value
                            }));
                          }}
                          required
                          className="relative z-20 w-full appearance-none 
                          rounded border border-stroke 
                          bg-transparent py-3 px-12 outline-none transition 
                          focus:border-primary active:border-primary 
                          dark:border-form-strokedark dark:bg-form-input"
                          disabled={isDisabled}
                        >
                          <option value="" disabled>Select Priority</option>
                          <option value="Critical">Critical </option>
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
                        Associated Test Plans
                      </label>
                      <div className="relative z-20 w-full rounded border border-stroke p-1.5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                        <div className="flex flex-wrap items-center">
                          {selectedTestPlans.map((testPlan) => (
                            <span
                              key={testPlan}
                              className="bg-warning text-whiten drop-shadow m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                            >
                              {testPlan}
                              {!isDisabled 
                                  ?  
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
                                  </span> : ""
                                }

                            </span>
                          ))}

                          <select
                            name="testPlan"
                            id=""
                            value={""}
                            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                            onChange={handleTestPlanSelect}
                            disabled={isDisabled}
                          >
                            <option value="" disabled>
                              {(testPlans) !== undefined ? (testPlans.length === 0 ? "No Test Plan Available" : "Select Test Plan") : "No Test Plan Available"}
                            </option>

                            {testPlans && testPlans.map((testPlan) => (
                              <option key={testPlan.title} value={testPlan.ID}>
                                {testPlan.title} <strong>({testPlan.ID})</strong>
                              </option>
                            ))}
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
                        Associated Test Cases
                      </label>
                      <div className="relative z-20 w-full rounded border border-stroke p-1.5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                        <div className="flex flex-wrap items-center">
                          {selectedTestCases.map((testCase) => (
                            <span
                              key={testCase}
                              className="bg-warning text-whiten drop-shadow m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                            >
                              {testCase}
                              {!isDisabled 
                                  ?  
                                  <span
                                    className="cursor-pointer pl-2 hover:text-danger"
                                    onClick={() => handleTestCaseRemove(testCase)}
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
                                  </span> : ""
                                }

                            </span>
                          ))}

                          <select
                            name="testCase"
                            id=""
                            value={""}
                            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                            onChange={handleTestCaseSelect}
                            disabled={isDisabled}
                          >
                            <option value="" disabled>
                              {(testCases) !== undefined ? (testCases.length === 0 ? "No Test Case Available" : "Select Test Case") : "No Test Case Available"}
                            </option>

                            {testCases && testCases.map((testCase) => (
                              <option key={testCase.title} value={testCase.ID}>
                                {testCase.title} <strong>({testCase.ID})</strong>
                              </option>
                            ))}
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
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows={6}
                        placeholder="Enter description"
                        value={requirementInfo && requirementInfo.description || ""}
                        onChange={(e) => {
                          setRequirementInfo(prevReq => ({
                            ...prevReq,
                            description: e.target.value
                          }));
                        }}
                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                        disabled={isDisabled}
                      ></textarea>
                    </div>

                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                          Requirement Attachment 
                        </h3>
                      </div>
                      <div className="flex flex-col gap-5.5 p-6.5">
                        {
                          !isDisabled ? 
                          <div>
                            <label className="mb-3 block text-black dark:text-white">
                              Attach file
                            </label>
                            <input
                              name="attachment"
                              type="file"
                              multiple
                              accept=".pdf, .xlsx, .xls, .jpeg, .jpg, .png"
                              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                              onChange={handleFileChange}
                            />
                          </div>
                          : ""
                        }

                        {selectedFile !== undefined && selectedFile !== null && selectedFile.length > 0 ? (
                          <div className="flex flex-col h-full">
                            {!isDisabled 
                              ? 
                              <span className="mb-3 block text-black dark:text-white">
                                {selectedFile.length} Selected Files
                                <button
                                  className="ml-2 p-3 rounded-full text-white bg-danger"
                                  onClick={() => handleFileRemoveAll()}
                                >
                                  Remove All Selected Files
                                </button>
                              </span>
                              :
                              <span className="mb-3 block text-black dark:text-white">
                                {selectedFile.length} Selected Files
                              </span>                            
                            }
                            {selectedFile.slice().reverse().map((file, index) => (
                              <>
                                <div key={index} className="flex">
                                  <span className="drop-shadow-lg font-bold text-indigo-500 pt-5 pb-5">
                                    {file.name}
                                  </span>
                                  {
                                    file.base64data !== undefined ?
                                    <a 
                                      href={`data:${file.type};base64,${file.base64data}`} 
                                      download={file.name}
                                      className="pl-4 drop-shadow-lg font-bold 
                                      text-primary underline pt-5 pb-5"
                                    >
                                      Download
                                    </a> : ""
                                  }
                                  {!isDisabled 
                                    ? 
                                      <span
                                        className="ml-2 drop-shadow-lg font-bold text-danger underline pt-5 pb-5 cursor-pointer"
                                        onClick={() => handleFileRemove(index)}
                                      >
                                        Remove
                                      </span>
                                    : 
                                      null
                                  }
                                </div>
                                {
                                  <FilePreview file={file} />
                                }
                              </>

                            ))}
                          </div>
                        ) : (
                          "No Attachment Found"
                        )}
                      </div>
                    </div>

                  {/* Buttons */}
                  {pageType === 'view' ? (
                    <button onClick={handleEditClick} 
                    className='
                      rounded-full w-full justify-center text-center 
                      px-4 border border-warning bg-warning 
                      drop-shadow text-whiten text-2xl hover:drop-shadow-lg hover:text-shadow'>
                      Edit
                    </button>
                  ) : (
                    <button type="submit" disabled={isDisabled} className="btn-primary bg-primary pt-2 pb-2 text-whiten font-bold text-xl">Save</button>
                  )}

                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {showSuccessDialog && (
        <SuccessDialog
          message={successMessage}
          onClose={() => setShowSuccessDialog(false)}
        />
      )}

      {showErrorDialog && (
        <ErrorDialog
          message={errorMessage}
          onClose={() => setShowErrorDialog(false)}
        />
      )}

      {showConfirmationDialog && (
        <ConfirmationDialog
          message={confirmationMessage}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export default RequirementInfo;
