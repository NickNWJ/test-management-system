import Breadcrumb from "../../components/Breadcrumb";
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuccessDialog from "../UiElements/Success";
import ErrorDialog from "../UiElements/Error";
import ConfirmationDialog from "../UiElements/Confirmation";
import LoadingSpinner from "../UiElements/LoadingSpinner";
import axios from "axios";

// color class
import colorClass from '../../constant/colorClass';

const RequirementListPage = ({scrollTop}) => {
  // State variables
  const [requirements, setRequirements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequirements, setFilteredRequirements] = useState([]);
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
  const navigate = useNavigate();

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

  // Fetch requirements from the backend
  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const response = await fetch(`http://localhost:8888/api/requirements/all`); 
      if (response.ok) {
        const data = await response.json();
        setRequirements(data);
        setFilteredRequirements(data);
      } else {
        throw new Error('Failed to fetch requirements');
      }
    } catch (error) {
      console.error(error); // Handle error state or display error message
    }
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
    const searchTerm = event.target.value;
    setSearchQuery(searchTerm);

    const filteredRequirements = requirements.filter((requirement) =>
      requirement.ID.includes(searchTerm)
    );
    setFilteredRequirements(filteredRequirements);
  };

  // Filter requirements based on the search query
  useEffect(() => {
    const filteredRequirements = requirements.filter(
      (requirement) =>
        requirement.ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requirement.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRequirements(filteredRequirements);
  }, [requirements, searchQuery]);

  // Close success and error dialogs after a timeout
  useEffect(() => {
    let timer;
    if (showSuccessDialog || showErrorDialog) {
      timer = setTimeout(() => {
        if (showSuccessDialog) {
          setShowSuccessDialog(false);  
          navigate(`http://localhost:5173/requirements`);
        }
        setShowErrorDialog(false);
      }, 1500); // Adjust the timeout duration as needed
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showSuccessDialog, showErrorDialog]);

  // Handle deletion of a requirement
  const handleDeleteRequirement = (requirementId) => {
    setConfirmationMessage(`Are you sure you want to delete the Requirement ID: ${requirementId}?`);
    setDeletedRowId(requirementId);
    setShowConfirmationDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.post(`http://localhost:8888/api/requirements/delete/${deletedRowId}`);
      if (response.status === 200) {
        setSuccessMessage(`Successfully deleted the requirement ID: ${deletedRowId}`);
        setShowSuccessDialog(true);
        setShowConfirmationDialog(false);
        setDeletedRowId('');
      } else {
        setShowConfirmationDialog(false);
        throw new Error('Fail to delete requirement, please remove all the dependencies exist in the requirement.');
      }
    } catch (error) {
      setShowConfirmationDialog(false);
      setErrorMessage('Fail to delete requirement, please remove all the dependencies exist in the requirement.');
      setShowErrorDialog(true);
    }
  };

  const cancelDelete = () => {
    setShowConfirmationDialog(false);
    setDeletedRowId('');
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'List of Requirements', link: '/requirements' },
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
              placeholder="Search Req ID"
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
              to="/requirement/details?type=new"
              className="
              rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
             +  Add New Requirement
            </Link>
          </div>
        </div>

        <div ref={tableContainerRef} className="flex flex-col overflow-x-auto rounded-lg ">
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
                        Title
                      </th>
                      <th scope="col" className="px-20 py-0">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Date Created
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Date Updated
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Total Supporting Documents
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Total Associated Test Plans
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Total Associated Test Cases
                      </th>
                      <th scope="col" className="px-16 py-0">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequirements ? (
                      filteredRequirements.length > 0 
                        ? (filteredRequirements.map((requirement, index) => (
                      <tr key={index} className="border-b dark:border-neutral-500 drop-shadow-x">
                        <td className="whitespace-nowrap px-6 py-0 font-medium">{index+1}</td>
                        <td className="whitespace-nowrap px-6 py-0 font-bold">{requirement.ID}</td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement.title}</td>
                        <td className="whitespace-normal px-6 py-0">{requirement.description}</td>
                        <td className="whitespace-nowrap px-6 py-0">
                          <span className={`hover:scale-105 hover:drop-shadow-lg inline-block p-2.5 uppercase 
                            rounded-md font-bold ${colorClass.getPriorityColorClass(requirement.priority)} last:mr-1`}>
                          {requirement.priority !== undefined ? requirement.priority : "-"}
                          </span>
                          
                        </td>
                        <td className="whitespace-nowrap px-6 py-0">
                          <span className={`inline-block p-1.5 uppercase 
                            rounded-full ${colorClass.getStatusColorClass(requirement.status)} last:mr-1`}>
                          </span>
                          {requirement.status}
                        </td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement.type}</td>
                        <td className="whitespace-normal px-6 py-0">{formatDate(requirement.dateCreated)}</td>
                        <td className="whitespace-normal px-6 py-0">{requirement.dateUpdated ? formatDate(requirement.dateUpdated) : "-"}</td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement.attachment.length}</td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement.testPlan.length}</td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement.testCase.length}</td>
                        <td className="py-6 px-4">
                          <div className="flex items-center space-x-3.5">
                            <Link to={`/requirement/details?id=${requirement.ID}&type=view`} className="hover:text-primary font-bold py-4 underline">
                              View
                            </Link>
                            <Link to={`/requirement/details?id=${requirement.ID}&type=edit`} className="hover:text-primary font-bold py-4 underline text-warning">
                              Edit
                            </Link>
                            <button onClick={() => handleDeleteRequirement(requirement.ID)} className="hover:text-danger font-bold py-4 underline text-meta-1">
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

export default RequirementListPage;
