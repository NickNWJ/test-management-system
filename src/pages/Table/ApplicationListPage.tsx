// Import statements (organized alphabetically)
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Breadcrumb from '../../components/Breadcrumb';
import ConfirmationDialog from '../UiElements/Confirmation';
import ErrorDialog from '../UiElements/Error';
import LoadingSpinner from '../UiElements/LoadingSpinner';
import SuccessDialog from '../UiElements/Success';

// color class
import colorClass from '../../constant/colorClass';
import Loader from '../../common/Loader';

const ApplicationListPage = ({scrollTop}) => {
  // State variables
  const [sortColumn, setSortColumn] = useState(''); 
  const [sortOrder, setSortOrder] = useState('');
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deletedRowId, setDeletedRowId] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const tableContainerRef = useRef(null);
  const [leftRightScrollClass, setLeftRightScrollClass] 
  = useState("fixed z-888 drop-shadow-lg rounded-full hover:scale-110 hover:text-whiten bg-meta-6 py-2 px-3 mt-2 absolute xl:top-[50%] lg:top-[70%] md:top-[90%]");

  useLayoutEffect(() => {
    if (scrollTop >= 350) {
      setLeftRightScrollClass(
        `fixed z-888 drop-shadow-lg 
        rounded-full hover:scale-110 hover:text-whiten 
        bg-meta-6 py-2 px-3 mt-2 absolute xl:top-[calc(50%+${scrollTop}px)] 
        lg:top-[calc(50%+${scrollTop}px)] md:top-[calc(60%+${scrollTop}px)]`);
    }
    if (scrollTop < 350) {
      setLeftRightScrollClass(
        `fixed z-888 drop-shadow-lg rounded-full hover:scale-110 hover:text-whiten bg-meta-6 py-2 px-3 mt-2 absolute xl:top-[50%] lg:top-[70%] md:top-[90%]`
      );
    }
  },[scrollTop]);

  // Handle scrolling to the left-most position when the "Scroll Left" button is clicked
  const handleScrollLeft = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  // Handle scrolling to the right-most position when the "Scroll Right" button is clicked
  const handleScrollRight = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({
        left: tableContainerRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  };

  // Fetch applications from the backend
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`http://localhost:8888/api/applications/all`); // Replace with your actual backend route
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
        setFilteredApplications(data);
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (error) {
      console.error(error);
      // Handle error state or display error message
    }
  };

  // Handle deletion of an application
  const handleDelete = (id) => {
    setConfirmationMessage(`Are you sure you want to delete the application ID: ${id}?`);
    setDeletedRowId(id);
    setShowConfirmationDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.post(`http://localhost:8888/api/applications/delete/${deletedRowId}`);
      if (response.status === 200) {
        setSuccessMessage(`Successfully deleted the application ID: ${deletedRowId}`);
        setShowSuccessDialog(true);
        setShowConfirmationDialog(false);
        setDeletedRowId('');
      } else {
        setShowConfirmationDialog(false);
        throw new Error('Fail to delete application, please remove all the dependencies exist in the application.');
      }
    } catch (error) {
      setShowConfirmationDialog(false);
      setErrorMessage('Fail to delete application, please remove all the dependencies exist in the application.');
      setShowErrorDialog(true);
    }
  };

  const cancelDelete = () => {
    setShowConfirmationDialog(false);
    setDeletedRowId('');
  };

  // Helper function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // Handle search query change
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter applications based on the search query
  useEffect(() => {
    const filterApplications = applications.filter(
      (app) =>
        app.ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('filtered', filterApplications);
    setFilteredApplications(filterApplications);
  }, [applications, searchQuery]);

  // Close success and error dialogs after a timeout
  useEffect(() => {
    let timer;
    if (showSuccessDialog || showErrorDialog) {
      timer = setTimeout(() => {
        if (showSuccessDialog) {
          setShowSuccessDialog(false);  
          window.location.href = 'http://localhost:5173/applications';
        }
        setShowErrorDialog(false);
      }, 1500); // Adjust the timeout duration as needed
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showSuccessDialog, showErrorDialog]);

  // Custom sorting function based on the column and order
  function sortByColumn(data, column, order) {
    const sortedData = [...data];

    switch (column) {
      case 'ID':
        sortedData.sort((a, b) => (order === 'asc' ? a.ID.localeCompare(b.ID) : b.ID.localeCompare(a.ID)));
        break;
      case 'Status':
        sortedData.sort((a, b) => (order === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)));
        break;
      case 'Description':
        sortedData.sort((a, b) => (order === 'asc' ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description)));
        break;
      // Add other cases for sorting other columns as needed
      default:
        // If the column doesn't match any specific case, do not perform sorting
        break;
    }

    return sortedData;
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedApplications = sortByColumn(filteredApplications, sortColumn, sortOrder);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'List of Application', link: '/applications' },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      {/* Search bar and "Add New AUT Info" button */}
      <div className="flex flex-row rounded-lg justify-center w-full items-center">
        {/* Search bar */}
        <div className="inline-flex items-right justify-center gap-2.5 pt-2 relative text-gray-600 w-full">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full"
            type="search"
            name="search"
            placeholder="Search ID"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
            {/* Search icon SVG */}
          </button>
        </div>

        {/* "Add New AUT Info" button */}
        <div className="flex flex-row xl:w-1/2 lg:w-1/2 w-full justify-end">
          <Link
            to="/application/details?add=yes"
            className="rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            + Add New AUT Info
          </Link>
        </div>
      </div>
      {/* Table displaying the list of applications */}
      <div ref={tableContainerRef} className="flex flex-col overflow-x-auto rounded-lg relative">
        <div className="sm:-mx-6 lg:-mx-8 ">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-x-auto border border-stroke bg-white ">
              <table className="min-w-full text-left text-base text-black">
                {/* table header */}
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr className="bg-black-2 text-whiten text-left dark:bg-meta-4 drop-shadow-xl">
                    <th scope="col" className="px-6 py-0">
                      #
                    </th>
                    <th scope="col" className="relative px-6 py-0 cursor-pointer" onClick={() => handleSort('ID')}>
                      ID
                      <svg
                        className={`absolute top-8 left-15 ${sortColumn === 'ID' && sortOrder === 'asc' ? 'rotate-180' : ''}`}
                        width={12}
                        height={8}
                        viewBox="0 0 12 8"
                        fill="#1F2937"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.06216 1.9393L5.43028 7.0368C5.50069 7.11892 5.58803 7.18484 5.68631 7.23003C5.78459 7.27522 5.89148 7.29862 5.99966 7.29862C6.10783 7.29862 6.21472 7.27522 6.313 7.23003C6.41128 7.18484 6.49862 7.11892 6.56903 7.0368L10.9372 1.9393C11.354 1.45273 11.0084 0.701172 10.3678 0.701172H1.63028C0.989656 0.701172 0.644031 1.45273 1.06216 1.9393Z"
                          fill="currentColor"
                        />
                      </svg>
                    </th>
                    <th scope="col" className="px-6 py-0">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-0">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-0">
                      Application URL
                    </th>
                    <th scope="col" className="px-6 py-0">
                      Platform
                    </th>
                    <th scope="col" className="relative px-6 py-0 cursor-pointer" onClick={() => handleSort('Status')}>
                      Status
                      <svg
                        className={`absolute top-8 left-20 ${sortColumn === 'Status' && sortOrder === 'asc' ? 'rotate-180' : ''}`}
                        width={12}
                        height={8}
                        viewBox="0 0 12 8"
                        fill="#1F2937"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.06216 1.9393L5.43028 7.0368C5.50069 7.11892 5.58803 7.18484 5.68631 7.23003C5.78459 7.27522 5.89148 7.29862 5.99966 7.29862C6.10783 7.29862 6.21472 7.27522 6.313 7.23003C6.41128 7.18484 6.49862 7.11892 6.56903 7.0368L10.9372 1.9393C11.354 1.45273 11.0084 0.701172 10.3678 0.701172H1.63028C0.989656 0.701172 0.644031 1.45273 1.06216 1.9393Z"
                          fill="currentColor"
                        />
                      </svg>
                    </th>
                    <th scope="col" className="px-6 py-0">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-0">
                      End Date
                    </th>
                    <th scope="col" className="px-6 py-0">
                      Total Requirements
                    </th>
                    <th scope="col" className="px-6 py-0">
                      Total Test Cases
                    </th>
                    <th scope="col" className="px-6 py-0">
                      Total Test Runs
                    </th>
                    <th scope="col" className="px-6 py-0">
                      Total Defects
                    </th>
                    <th scope="col" className="px-6 py-0">
                      Total Members Involved
                    </th>
                    <th scope="col" className="px-6 py-0">
                      Action
                    </th>
                  </tr>
                </thead>
                {/* table body */}
                <tbody>
                  {sortedApplications ? (
                    sortedApplications.length > 0
                        ? (sortedApplications.map((application, index) => (
                      <tr key={index} className="border-b dark:border-neutral-500 drop-shadow-x">
                        <td className="whitespace-nowrap px-6 py-0 font-medium">{index + 1}</td>
                        <td className="whitespace-nowrap px-6 py-0 font-bold">{application.ID}</td>
                        <td className="whitespace-nowrap px-6 py-0">{application.name}</td>
                        <td className="whitespace-normal px-6 py-0">{application.description}</td>
                        <td className="whitespace-normal px-6 py-0">{application.applicationUrl}</td>
                        <td className="whitespace-nowrap px-6 py-0">{application.platform}</td>
                        <td className="whitespace-nowrap px-6 py-0">
                          <span className={`inline-block p-1.5 uppercase 
                          rounded-full uppercase ${colorClass.getStatusColorClass(application.status)} last:mr-1`}>
                          </span>
                          {application.status}
                        </td>
                        <td className="whitespace-normal px-6 py-0">{formatDate(application.startDate)}</td>
                        <td className="whitespace-normal px-6 py-0">{formatDate(application.endDate)}</td>
                        <td className="whitespace-nowrap px-6 py-0">{application.requirement.length}</td>
                        <td className="whitespace-nowrap px-6 py-0">{application.testCase.length}</td>
                        <td className="whitespace-nowrap px-6 py-0">{application.testRun.length}</td>
                        <td className="whitespace-nowrap px-6 py-0">{application.defect.length}</td>
                        <td className="whitespace-nowrap px-6 py-0">{application.user.length}</td>
                        <td className="py-6 px-4">
                          <div className="flex items-center space-x-3.5">
                            <Link to={`/application/details?id=${application.ID}&type=view`} className="hover:text-primary font-bold py-4 underline">
                              View
                            </Link>
                            <Link to={`/application/details?id=${application.ID}&type=edit`} className="hover:text-primary font-bold py-4 underline text-warning">
                              Edit
                            </Link>
                            <button onClick={() => handleDelete(application.ID)} className="hover:text-danger font-bold py-4 underline text-meta-1">
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
                        <Loader />
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>

      {/* Scroll left button */}
      <button
        onClick={handleScrollLeft}
        className={`${leftRightScrollClass} left-0`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Scroll right button */}
      <button
        onClick={handleScrollRight}
        className={`${leftRightScrollClass} right-0`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>     
      
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

  export default ApplicationListPage;
