import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumb';
import SuccessDialog from '../UiElements/Success';
import ErrorDialog from '../UiElements/Error';
import ConfirmationDialog from '../UiElements/Confirmation';
import LoadingSpinner from '../UiElements/LoadingSpinner';
import { useAuth } from '../../context/Auth';

const ApplicationInfo = () => {
  const [applications, setApplications] = useState([]);
  const [application, setApplication] = useState(null);
  const [pageType, setPageType] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get the query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:8888/api/applications/application/${id}`);
        if (response.ok) {
          const data = await response.json();
          setApplications(data);

          // Find the matching application if it exists
          if (id) {
            const matchingApplication = data.find((app) => app.ID === id);
            if (matchingApplication) {
              setApplication(matchingApplication);
              setSelectedMembers(matchingApplication.user);
              setSelectedRequirements(matchingApplication.requirement);
            } else {
              // Handle case when application is not found
            }
          } else {
            // Set the application state to an empty object for the new page
            setApplication({});
          }
        } else {
          throw new Error('Failed to fetch applications');
        }
      } catch (error) {
        console.error(error);
        // Handle error state or display error message
      }
    };

    fetchApplications();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/users/all');
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        } else {
          throw new Error('Failed to fetch users');
        }
      } catch (error) {
        console.error(error);
        // Handle error state or display error message
      }
    };

    // Determine the page type based on the query parameters
    if (type === 'view' || type === 'edit') {
      setPageType(type);
    } else {
      setPageType('new');
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/requirements/all');
        if (response.ok) {
          const data = await response.json();
          setRequirements(data);
        } else {
          throw new Error('Failed to fetch requirements');
        }
      } catch (error) {
        console.error(error);
        // Handle error state or display error message
      }
    };

    fetchRequirements();
  }, []);

  useEffect(() => {
    if (showSuccessDialog) {
      const timer = setTimeout(() => {
        setShowSuccessDialog(false);
        navigate('/applications');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [navigate, showSuccessDialog]);

  useEffect(() => {
    if (showErrorDialog) {
      const timer = setTimeout(() => {
        setShowErrorDialog(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showErrorDialog]);

  const handleEditClick = (event) => {
    navigate(`/applications/details?id=${application.ID}&type=edit`);
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const applicationUrl = event.target.url.value;
    const status = event.target.status.value;
    const startDate = event.target.datecreated.value;
    const description = event.target.description.value;
    const platform = event.target.platform.value;
    const user = selectedMembers;
    const requirement = selectedRequirements;
    const createdBy = user.ID;

    try {
      const response = type === 'edit' && id
        ? await axios.post(`http://localhost:8888/api/applications/update/${application.ID}`, {
            name,
            applicationUrl,
            description,
            status,
            startDate,
            platform,
            user,
            requirement,
            createdBy,
          })
        : await axios.post('http://localhost:8888/api/applications/create', {
            name,
            applicationUrl,
            description,
            status,
            startDate,
            platform,
            user,
            requirement,
            createdBy,
          });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(`Successfully ${type === 'edit' ? 'updated' : 'created'} application ${application.ID}. Redirecting you to the application list.`);
        setShowSuccessDialog(true);
      } else {
        throw new Error(`Failed to ${type === 'edit' ? 'update' : 'create'} applications`);
      }
    } catch (error) {
      console.log(`Error -> ${error}`);
      setErrorMessage('Something went wrong! Please try again.');
      setShowErrorDialog(true);
    }
  };

  const handleRequirementSelect = (event) => {
    const selectedOption = event.target.value;
    if (!selectedRequirements.includes(selectedOption)) {
      setSelectedRequirements((prevRequirements) => [...prevRequirements, selectedOption]);
    }
  };

  const handleRequirementRemove = (requirement) => {
    setSelectedRequirements((prevRequirements) => prevRequirements.filter((selected) => selected !== requirement));
  };

  const handleMemberSelect = (event) => {
    const selectedOption = event.target.value;
    if (!selectedMembers.includes(selectedOption)) {
      setSelectedMembers((prevMembers) => [...prevMembers, selectedOption]);
    }
  };

  const handleMemberRemove = (member) => {
    setSelectedMembers((prevMembers) => prevMembers.filter((selected) => selected !== member));
  };

  // Determine whether the buttons should be disabled based on the page type
  const isDisabled = pageType === 'view';

  const breadcrumbItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'List of Application', link: '/applications' },
    {
      label: `Application Under Test (AUT) Info ${application?.ID ? `(${application.ID})` : ''}`,
      link: '/applications/details',
    },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col">
        <div className="flex flex-col gap-9">
          {/* <!-- Input Fields --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="text-xl text-black dark:text-white">
                AUT Info <span>{(application && application.ID) !== null && (application && application.ID) !== undefined ? " ("
                +application.ID+") "
                : ""}</span>
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                <label className="mb-3 block text-black dark:text-white">Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter Application Name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={(application && application.name) !== null && (application && application.name) !== undefined ? application.name : ''}
                  onChange={(e) => {
                    setApplication(prevApp => ({
                      ...prevApp,
                      name: e.target.value
                    }));
                  }}
                  disabled={isDisabled}
                  required
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">Application Url</label>
                <input
                  type="text"
                  name="url"
                  placeholder="Enter Application URL e.g:  (http:www.xyz.com)"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={(application && application.applicationUrl) !== null && (application && application.applicationUrl) !== undefined  ? application.applicationUrl :''}
                  onChange={(e) => {
                    setApplication(prevApp => ({
                      ...prevApp,
                      applicationUrl: e.target.value
                    }));
                  }}
                  disabled={isDisabled}
                  required
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">Platform</label>
                <select
                  name="platform"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={(application && application.platform) !== null && (application && application.platform) !== undefined ? application.platform : ''}
                  onChange={(e) => {
                    setApplication(prevApp => ({
                      ...prevApp,
                      platform: e.target.value
                    }));
                  }}
                  disabled={isDisabled}
                  required
                >
                  <option value="">Select platform</option>
                  <option value="Web">Web</option>
                  <option value="Mobile">Mobile</option>
                  {/* Add more platform options if needed */}
                </select>
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
                          className="bg-warning text-whiten drop-shadow m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                        >
                          {requirement}
                          <span
                            className="cursor-pointer pl-2 hover:text-danger"
                            onClick={() => handleRequirementRemove(requirement)}
                          >
                            {!isDisabled 
                              ?  
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
                              </svg> : ""
                            }
                          </span>
                        </span>
                      ))}
                    <span className="absolute bottom-2 left-5 z-30 -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                        viewBox="0 0 24 24" strokeWidth={1.5} 
                        stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" 
                          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 
                          002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 
                          48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 
                          0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 
                          0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 
                          0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 
                          4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 
                          0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 
                          1.125 1.125h9.75c.621 0 1.125-.504 
                          1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 
                          12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                    </span>

                      <select
                        name="requirement"
                        id=""
                        value={""}
                        required
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        onChange={handleRequirementSelect}
                        disabled={isDisabled}
                      >
                        <option value="" disabled>
                          Select Requirement
                        </option>

                        {requirements && requirements.map((req) => (
                          <option key={req.title} value={req.ID}>
                            {req.title}({req.ID})
                          </option>
                        ))}
                      </select>
                      <span className="absolute bottom-2 right-4 z-10 -translate-y-1/2">
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
                    Date Created
                  </label>
                  <input
                    name="datecreated"
                    type="date"
                    placeholder="Active Input"
                    value={(application && application.startDate) !== null && (application && application.startDate) !== undefined ? application.startDate.substring(0,10) : new Date().toISOString().substring(0,10)}
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
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
                      value={((application && application.status) !== null && (application && application.status) !== undefined) ? application.status : ''}
                      onChange={(e) => {
                        setApplication((prevApp) => ({
                          ...prevApp,
                          status: e.target.value,
                        }));
                      }}
                      disabled={isDisabled}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                      <option value="" disabled>
                        Select Application Status  
                      </option>
                      <option value="Active">
                        Active
                      </option>
                      <option value="In Progress">
                        In Progress
                      </option>
                      <option value="Inactive">
                        Inactive
                      </option>
                      <option value="Completed">
                        Completed
                      </option>
                      <option value="Closed">
                        Closed
                      </option>
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
                    Assign Members
                  </label>
                  <div className="relative z-20 w-full rounded border border-stroke p-1.5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                    <div className="flex flex-wrap items-center">
                      {selectedMembers.map((member) => (
                        <span
                          key={member.ID}
                          className="bg-primary text-whiten drop-shadow m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                        >
                          {member}
                          <span
                            key={member.ID}
                            className="cursor-pointer pl-2 hover:text-danger"
                            onClick={() => handleMemberRemove(member)}
                          >
                            {!isDisabled 
                              ?  
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
                              </svg> : ""
                            }
                            
                          </span>
                        </span>
                      ))}
                      <span className="absolute bottom-2 left-4 z-30 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                          fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                          stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" 
                            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 
                            0 00-4.682-2.72m.94 3.198l.001.031c0 
                            .225-.012.447-.037.666A11.944 11.944 
                            0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 
                            6.062 0 016 18.719m12 0a5.971 
                            5.971 0 00-.941-3.197m0 0A5.995 
                            5.995 0 0012 12.75a5.995 
                            5.995 0 00-5.058 2.772m0 
                            0a3 3 0 00-4.681 2.72 
                            8.986 8.986 0 003.74.477m.94-3.197a5.971 
                            5.971 0 00-.94 3.197M15 6.75a3 
                            3 0 11-6 0 3 3 
                            0 016 0zm6 3a2.25 2.25 
                            0 11-4.5 0 2.25 2.25 
                            0 014.5 0zm-13.5 0a2.25 
                            2.25 0 11-4.5 0 2.25 
                            2.25 0 014.5 0z" />
                        </svg>
                      </span>

                      <select
                        name="member"
                        id=""
                        value={"Select Member"}
                        required
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        onChange={handleMemberSelect}
                        disabled={isDisabled}
                      >
                        <option value="Select Member" disabled>
                          Select Member
                        </option>
                        {members && members.map((member) => (
                          <option key={member.Name} value={member.ID}>
                            {member.Name}({member.ID})
                          </option>
                        ))}
                      </select>
                      <span className="absolute bottom-2 right-4 z-10 -translate-y-1/2">
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
                    Application Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={6}
                    placeholder="Enter description"
                    value={((application && application.description) !== null && (application && application.description) !== undefined) ? application.description : ''}
                    onChange={(e) => {
                      setApplication((prevApp) => ({
                        ...prevApp,
                        description: e.target.value,
                      }));
                    }}
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                    disabled={isDisabled}
                  ></textarea>
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
                <button type="submit" disabled={isDisabled} className="btn-primary bg-primary pt-2 pb-2 text-whiten drop-shadow-lg font-bold">Save</button>
              )}

              </div>
            </form>

          </div>


        </div>


      </div>
      
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

export default ApplicationInfo;
