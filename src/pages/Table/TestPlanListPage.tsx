import Breadcrumb from '../../components/Breadcrumb';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SuccessDialog from "../UiElements/Success";
import ErrorDialog from "../UiElements/Error";
import ConfirmationDialog from "../UiElements/Confirmation";
import LoadingSpinner from "../UiElements/LoadingSpinner";

const TestPlanListPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequirements, setFilteredRequirements] = useState([]);
  const [filteredTestPlans, setFilteredTestPlans] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deletedRowId, setDeletedRowId] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [testPlans, setTestPlans] = useState([]);

  useEffect(() => {
    fetchTestPlans();
  }, []);

  const fetchTestPlans = () => {
    // Replace this with your API call to fetch test plans
    const dummyData = [
      {
        _id: 'TP1',
        name: 'Test Plan 1',
        description: 'Description of Test Plan 1',
        scope: 'Scope of Test Plan 1',
        goal: 'Goal of Test Plan 1',
        schedule: 'Schedule of Test Plan 1',
        startDate: '2023-07-15',
        attachment: { 
          data: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          contentType: 'application/pdf',
          filename: 'attachment1.pdf', 
        },
        status: true,
        createdby: 'John Doe',
        testCases: ['TC1', 'TC2']
      },
      {
        _id: 'TP2',
        name: 'Test Plan 2',
        description: 'Description of Test Plan 2',
        scope: 'Scope of Test Plan 2',
        goal: 'Goal of Test Plan 2',
        schedule: 'Schedule of Test Plan 2',
        startDate: '2023-07-20',
        attachment: { 
          data: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          contentType: 'application/pdf',
          filename: 'attachment2.pdf', 
        },
        status: false,
        createdby: 'Jane Smith',
        testCases: ['TC3', 'TC4', 'TC5']
      },
      // Add more dummy test plans here...
    ];
    setFilteredTestPlans(dummyData);
    setTestPlans(dummyData);
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = () => {
    // Replace this with your API call to fetch requirements
    const dummyData = [
      {
        _id: 'REQ1',
        title: 'Requirement 1',
        description: 'Description of Requirement 1',
        status: 'Active',
        type: 'Functional',
        dateCreated: '2023-07-15T00:00:00.000Z',
        dateUpdated: '2023-07-16T00:00:00.000Z',
        testCase: ['TC1', 'TC2'],
        testPlan: ['TP1', 'TP2'],
      },
      {
        _id: 'REQ2',
        title: 'Requirement 2',
        description: 'Description of Requirement 2',
        status: 'Inactive',
        type: 'Non-Functional',
        dateCreated: '2023-07-17T00:00:00.000Z',
        dateUpdated: '2023-07-18T00:00:00.000Z',
        testCase: ['TC3', 'TC4'],
        testPlan: ['TP3', 'TP4'],
      },
    ];

    setRequirements(dummyData);
    setFilteredRequirements(dummyData);
  };

    
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };


  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchQuery(searchTerm);

    setFilteredTestPlans(testPlans.filter((testPlan) =>
    testPlan._id.includes(searchTerm)
    ));

    console.log("test plan yo yo");
  };

  useEffect(() => {
    let timer;
    if (showSuccessDialog || showErrorDialog) {
      timer = setTimeout(() => {
        setShowSuccessDialog(false);
        setShowErrorDialog(false);
      }, 1500); // Adjust the timeout duration as needed
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showSuccessDialog, showErrorDialog]);

  const handleDeleteTestPlan = (testPlanId) => {
    // Replace this with your API call to delete the requirement
    // You can show a confirmation dialog and handle the success/error messages here
    setConfirmationMessage(`Are you sure you want to delete the Test Plan ID: ${testPlanId}?`);
    setDeletedRowId(testPlanId);
    setShowConfirmationDialog(true);

  };

  const confirmDelete = () => {
    const updatedTestPlan = testPlans.filter((testPlan) => testPlan._id !== deletedRowId);
    setTestPlans(updatedTestPlan);
    setSuccessMessage(`Successfully deleted the Test Plan ID: ${deletedRowId}`);
    setShowSuccessDialog(true);
    setShowConfirmationDialog(false);
    setDeletedRowId("");
  };

  const cancelDelete = () => {
    setShowConfirmationDialog(false);
    setDeletedRowId("");
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'List of Test Plans', link: '/test/test-plans' },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-row rounded-lg justify-center w-full items-center">
          <div className="inline-flex items-right justify-center gap-2.5 pt-2 relative text-gray-600 w-full">
            <input
              className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full"
              type="search"
              name="search"
              placeholder="Search Test Plan ID Or Name"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
              <svg
                className="text-gray-600 h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                viewBox="0 0 56.966 56.966"
                xmlSpace="preserve"
                width="512px"
                height="512px"
              >
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            </button>
          </div>
          <div className="flex flex-row xl:w-1/2 lg:w-1/2 w-full justify-end">
            <Link
              to="/test/test-plan/details?type=new"
              className="
              rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Add New Test Plan
            </Link>
          </div>
        </div>

        <div className="flex flex-col overflow-x-auto rounded-lg ">
          <div className="sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto border border-stroke bg-white ">
                <table className="min-w-full text-left text-base text-black">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr className="bg-black-2 text-whiten text-left dark:bg-meta-4 drop-shadow-xl">
                      <th scope="col" className="px-6 py-0">
                        #
                      </th>
                      <th scope="col" className="px-6 py-0">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Scope
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Goal
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Schedule
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Date Started
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Attachment
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Created By
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Total Associated Test Cases
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTestPlans ? (
                      filteredTestPlans.length > 0 
                        ? (filteredTestPlans.map((testPlan, index) => (
                      <tr key={index} className="border-b dark:border-neutral-500 drop-shadow-x">
                        <td className="whitespace-nowrap px-6 py-0 font-medium">{index + 1}</td>
                        <td className="whitespace-nowrap px-6 py-0 font-bold">{testPlan._id}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testPlan.name}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testPlan.description}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testPlan.scope}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testPlan.goal}</td>
                        <td className="whitespace-nowrapp px-6 py-0">{formatDate(testPlan.schedule)}</td>
                        <td className="whitespace-nowrap px-6 py-0">{formatDate(testPlan.startDate)}</td>
                        <td className="whitespace-nowrap px-6 py-0 underline text-danger"><Link to={`${testPlan.attachment}`}>{testPlan.attachment.filename}</Link></td>
                        <td className="whitespace-nowrap px-6 py-0">{testPlan.status}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testPlan.createdby}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testPlan.testCases.length}</td>
                        <td className="py-6 px-4">
                          <div className="flex items-center space-x-3.5">
                            <Link to={`/test/test-plan/details?id=${testPlan._id}&type=view`} className="hover:text-primary font-bold py-4 underline">
                              View
                            </Link>
                            <Link to={`/test/test-plan/details?id=${testPlan._id}&type=edit`} className="hover:text-primary font-bold py-4 underline text-warning">
                              Edit
                            </Link>
                            <button onClick={() => handleDeleteTestPlan(testPlan._id)} className="hover:text-danger font-bold py-4 underline text-meta-1">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) ): (
                      <tr className="border-b dark:border-neutral-500 drop-shadow-x">
                        <td className="text-center py-4 ">
                          No data
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr className="border-b dark:border-neutral-500 drop-shadow-x">
                      <td className="text-center py-4">
                        <LoadingSpinner />
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
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
            message="Something went wrong!"
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

export default TestPlanListPage;
