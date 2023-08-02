import Breadcrumb from '../../components/Breadcrumb';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SuccessDialog from "../UiElements/Success";
import ErrorDialog from "../UiElements/Error";
import ConfirmationDialog from "../UiElements/Confirmation";
import LoadingSpinner from "../UiElements/LoadingSpinner";

const TestCaseListPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequirements, setFilteredRequirements] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deletedRowId, setDeletedRowId] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [filteredTestCases, setFilteredTestCases] = useState([]);

  useEffect(() => {
    fetchTestCases();
  }, []);

  const fetchTestCases = () => {
    // Replace this with your API call to fetch requirements
    const dummyData = [
      {
        _id: "TC001", 
        name: "Login Test",
        description: "Test case to verify the login functionality",
        type: "Functional",
        status: "Active",
        dateCreated: "2023-07-17",
        dateUpdated: null,
        testSteps: "1. Open the application\n2. Enter valid credentials\n3. Click on the login button\n4. Verify successful login",
        expectedResult: "The user should be logged in and directed to the dashboard",
        defects: [],
        testData: null,
        requirement: null,
        attachment: { 
          data: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          contentType: 'application/pdf',
          filename: 'TC001.pdf', 
        },
        testEnvironment: "Production",
        testPlan: null,
        createdBy: "John Doe",
        testResult: null
      },
      {
        _id: "TC002",
        name: "Unit Trust Withdrawal Test",
        description: "Test case for unit trust withdrawal functionality",
        type: "Functional",
        status: "Active",
        dateCreated: new Date("2023-07-16"),
        dateUpdated: new Date("2023-07-17"),
        testSteps: "1. Open the unit trust application\n2. Select a fund\n3. Choose the withdrawal option\n4. Enter the withdrawal amount\n5. Verify the transaction details\n6. Confirm the withdrawal",
        expectedResult: "The withdrawal should be successful and the transaction details should be displayed",
        defects: [],
        testData: null,
        requirement: null,
        attachment: { 
          data: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          contentType: 'application/pdf',
          filename: 'TC002.pdf', 
        },
        testEnvironment: "Staging",
        testPlan: null,
        createdBy: "Jane Smith",
        testResult: null
      },
      {
        _id: "TC003",
        name: "Unit Trust Performance Test",
        description: "Test case for unit trust performance evaluation",
        type: "Performance",
        status: "Active",
        dateCreated: new Date("2023-07-15"),
        dateUpdated: new Date("2023-07-17"),
        testSteps: "1. Launch the unit trust application\n2. Simulate multiple user interactions\n3. Monitor response times and resource utilization\n4. Generate performance metrics",
        expectedResult: "The application should perform efficiently under high load conditions",
        defects: [],
        testData: null,
        requirement: null,
        attachment: { 
          data: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          contentType: 'application/pdf',
          filename: 'TC002.pdf', 
        },
        testEnvironment: "Performance Testing Environment",
        testPlan: null,
        createdBy: "Alex Johnson",
        testResult: null
      },
      {
        name: "Enrollment Test",
        description: "Test case to verify the enrollment process",
        type: "Functional",
        status: "Active",
        dateCreated: "2023-07-17",
        dateUpdated: null,
        testSteps: "1. Open the enrollment form\n2. Enter required personal details\n3. Provide necessary documentation\n4. Submit the form",
        expectedResult: "The user should be successfully enrolled in the system",
        defects: [],
        testData: null,
        requirement: null,
        attachment: { 
          data: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          contentType: 'application/pdf',
          filename: 'TC002.pdf', 
        },
        testEnvironment: "Staging",
        testPlan: null,
        createdBy: "Jane Smith",
        testResult: null
      },
      {
        name: "Contribution Test",
        description: "Test case to verify the contribution functionality",
        type: "Functional",
        status: "Active",
        dateCreated: "2023-07-17",
        dateUpdated: null,
        testSteps: "1. Open the contribution page\n2. Enter the contribution amount\n3. Choose the payment method\n4. Submit the contribution",
        expectedResult: "The contribution should be successfully processed and reflected in the user's account",
        defects: [],
        testData: null,
        requirement: null,
        attachment: null,
        testEnvironment: "Production",
        testPlan: null,
        createdBy: "Alex Johnson",
        testResult: null
      }
    ];

    setTestCases(dummyData);
    setFilteredTestCases(dummyData);
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

    const filteredTestCases = testCases.filter((testCase) =>
    testCase._id.includes(searchTerm)
    );
    setFilteredTestCases(filteredTestCases);

    console.log("test case yo yo");
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

  const handleDeleteTestCase = (testCaseId) => {
    // Replace this with your API call to delete the test case
    // You can show a confirmation dialog and handle the success/error messages here
    setConfirmationMessage(`Are you sure you want to delete the Test Case ID: ${testCaseId}?`);
    setDeletedRowId(testCaseId);
    setShowConfirmationDialog(true);
  };

  const confirmDelete = () => {
    const updatedTestCases = testCases.filter((testCase) => testCase._id !== deletedRowId);
    setTestCases(updatedTestCases);
    setSuccessMessage(`Successfully deleted the Test Case ID: ${deletedRowId}`);
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
    { label: 'List of Test Cases', link: '/test/test-cases' },
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
              placeholder="Search Test Case ID"
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
              to="/test/test-case/details?type=new"
              className="
              rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Add New Test Case
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
                        Type
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Date Created
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Date Updated
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Total of Defects
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Requirement ID
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Attachment
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Test Environment
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Total of Associated Test Plans
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Created By
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Total of Associated Test Results
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTestCases ? (
                      filteredTestCases.length > 0 
                        ? (filteredTestCases.map((testCase, index) => (
                      <tr key={index} className="border-b dark:border-neutral-500 drop-shadow-x">
                        <td className="whitespace-nowrap px-6 py-0 font-medium">{index + 1}</td>
                        <td className="whitespace-nowrap px-6 py-0 font-bold">{testCase._id}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testCase.name}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testCase.description}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testCase.type}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testCase.status}</td>
                        <td className="whitespace-nowrap px-6 py-0">{formatDate(testCase.dateCreated)}</td>
                        <td className="whitespace-nowrap px-6 py-0">{formatDate(testCase.dateUpdated)}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testCase.defects.length}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testCase.requirement}</td>
                        <td className="whitespace-nowrap px-6 py-0 text-danger underline"><Link to={`${(testCase.attachment && testCase.attachment.data)  ? testCase.attachment.data : "" }`}>{(testCase.attachment && testCase.attachment.filename) !== null ? testCase.attachment.filename : ""}</Link></td>
                        <td className="whitespace-nowrap px-6 py-0">{testCase.testEnvironment}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testCase.testPlan}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testCase.createdBy}</td>
                        <td className="whitespace-nowrap px-6 py-0">{testCase.testResult}</td>
                        <td className="py-6 px-4">
                          <div className="flex items-center space-x-3.5">
                            <Link to={`/test/test-case/details?id=${testCase._id}&type=view`} className="hover:text-primary font-bold py-4 underline">
                              View
                            </Link>
                            <Link to={`/test/test-case/details?id=${testCase._id}&type=edit`} className="hover:text-primary font-bold py-4 underline text-warning">
                              Edit
                            </Link>
                            <button onClick={() => handleDeleteTestCase(testCase._id)} className="hover:text-danger font-bold py-4 underline text-meta-1">
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

export default TestCaseListPage;
