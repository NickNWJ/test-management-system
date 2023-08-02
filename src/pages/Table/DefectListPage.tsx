import Breadcrumb from '../../components/Breadcrumb';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SuccessDialog from "../UiElements/Success";
import ErrorDialog from "../UiElements/Error";
import ConfirmationDialog from "../UiElements/Confirmation";
import LoadingSpinner from "../UiElements/LoadingSpinner";

const DefectListPage = ({scrollTop}) => {
  const [requirements, setRequirements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDefects, setFilteredDefects] = useState([]);
  const [filteredRequirements, setFilteredRequirements] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deletedRowId, setDeletedRowId] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [defects, setDefects] = useState([]);
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

  useEffect(() => {
    fetchDefects();
  }, []);

  const fetchDefects = () => {
    // Replace this with your API call to fetch defects
    const dummyData = [
      {
        _id: 'DEF1',
        description: 'Defect 1 description',
        status: 'Open',
        severity: 'High',
        priority: 'Urgent',
        reproduceSteps: 'Steps to reproduce the defect 1',
        dateCreated: '2023-07-15',
        dateUpdated: '2023-07-16',
        detectedBy: 'John Doe',
        resolvedBy: 'Jane Smith',
        testResult: 'TR1'
      },
      {
        _id: 'DEF2',
        description: 'Defect 2 description',
        status: 'Closed',
        severity: 'Medium',
        priority: 'High',
        reproduceSteps: 'Steps to reproduce the defect 2',
        dateCreated: '2023-07-16',
        dateUpdated: null,
        detectedBy: 'Alice Johnson',
        resolvedBy: null,
        testResult: 'TR2'
      },
      {
        _id: 'DEF3',
        description: 'Defect 2 description',
        status: 'Closed',
        severity: 'Medium',
        priority: 'High',
        reproduceSteps: 'Steps to reproduce the defect 2',
        dateCreated: '2023-07-16',
        dateUpdated: null,
        detectedBy: 'Alice Johnson',
        resolvedBy: null,
        testResult: 'TR2'
      },
      {
        _id: 'DEF4',
        description: 'Defect 2 description',
        status: 'Closed',
        severity: 'Medium',
        priority: 'High',
        reproduceSteps: 'Steps to reproduce the defect 2',
        dateCreated: '2023-07-16',
        dateUpdated: null,
        detectedBy: 'Alice Johnson',
        resolvedBy: null,
        testResult: 'TR2'
      },
      {
        _id: 'DEF5',
        description: 'Defect 2 description',
        status: 'Closed',
        severity: 'Medium',
        priority: 'High',
        reproduceSteps: 'Steps to reproduce the defect 2',
        dateCreated: '2023-07-16',
        dateUpdated: null,
        detectedBy: 'Alice Johnson',
        resolvedBy: null,
        testResult: 'TR2'
      },
      {
        _id: 'DEF6',
        description: 'Defect 2 description',
        status: 'Closed',
        severity: 'Medium',
        priority: 'High',
        reproduceSteps: 'Steps to reproduce the defect 2',
        dateCreated: '2023-07-16',
        dateUpdated: null,
        detectedBy: 'Alice Johnson',
        resolvedBy: null,
        testResult: 'TR2'
      },
      {
        _id: 'DEF7',
        description: 'Defect 2 description',
        status: 'Closed',
        severity: 'Medium',
        priority: 'High',
        reproduceSteps: 'Steps to reproduce the defect 2',
        dateCreated: '2023-07-16',
        dateUpdated: null,
        detectedBy: 'Alice Johnson',
        resolvedBy: null,
        testResult: 'TR2'
      },
      {
        _id: 'DEF8',
        description: 'Defect 2 description',
        status: 'Closed',
        severity: 'Medium',
        priority: 'High',
        reproduceSteps: 'Steps to reproduce the defect 2',
        dateCreated: '2023-07-16',
        dateUpdated: null,
        detectedBy: 'Alice Johnson',
        resolvedBy: null,
        testResult: 'TR2'
      },
      // Add more dummy defects here...
    ];
    setFilteredDefects(dummyData);
    setDefects(dummyData);
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

    setFilteredDefects(defects.filter((defect) =>
      defect._id.includes(searchTerm)
    ));
    console.log("yoyoyo");
  };

  useEffect(() => {
    const filteredDefects = defects.filter(
      (defect) =>
      defect._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      defect.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("filtered" + filteredDefects);
    setFilteredDefects(filteredDefects);
  }, [defects, searchQuery]);

    
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

  const handleDeleteDefect = (defectId) => {
    // Replace this with your API call to delete the requirement
    // You can show a confirmation dialog and handle the success/error messages here
    setConfirmationMessage(`Are you sure you want to delete the Defect ID: ${defectId}?`);
    setDeletedRowId(defectId);
    setShowConfirmationDialog(true);

  };

  const confirmDelete = () => {
    const updatedDefects = defects.filter((defect) => defect._id !== deletedRowId);
    setDefects(updatedDefects);
    setSuccessMessage(`Successfully deleted the Defect ID: ${deletedRowId}`);
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
    { label: 'List of Defect', link: '/defects' },
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
              placeholder="Search Defect ID"
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
              to="/defect/details?type=new"
              className="
              rounded-md bg-danger py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Add New Defect
            </Link>
          </div>
        </div>

        {/* Table displaying the list of defects */}
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
                        Description
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Severity
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Prioirity
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Date Created
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Date Updated
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Detected By
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Resolved By
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Associated Test Result
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDefects ? (
                      filteredDefects.length > 0 
                        ? (filteredDefects.map((defect, index) => (
                      <tr key={index} className="border-b dark:border-neutral-500 drop-shadow-x">
                        <td className="whitespace-nowrap px-6 py-0 font-medium">{index + 1}</td>
                        <td className="whitespace-nowrap px-6 py-0">{defect._id}</td>
                        <td className="whitespace-normal px-6 py-0">{defect.description}</td>
                        <td className="whitespace-nowrap px-6 py-0">{defect.status}</td>
                        <td className="whitespace-nowrap px-6 py-0">{defect.severity}</td>
                        <td className="whitespace-nowrap px-6 py-0">{defect.priority}</td>
                        <td className="whitespace-nowrap px-6 py-0">{formatDate(defect.dateCreated)}</td>
                        <td className="whitespace-nowrap px-6 py-0">{formatDate(defect.dateUpdated)}</td>
                        <td className="whitespace-nowrap px-6 py-0">{defect.detectedBy}</td>
                        <td className="whitespace-nowrap px-6 py-0">{defect.resolvedBy || '-'}</td>
                        <td className="whitespace-nowrap px-6 py-0">{defect.testResult}</td>
                        <td className="py-6 px-4">
                          <div className="flex items-center space-x-3.5">
                            <Link to={`/defect/details?id=${defect._id}&type=view`} className="hover:text-primary font-bold py-4 underline">
                              View
                            </Link>
                            <Link to={`/defect/details?id=${defect._id}&type=edit`} className="hover:text-primary font-bold py-4 underline text-warning">
                              Edit
                            </Link>
                            <button onClick={() => handleDeleteDefect(defect._id)} className="hover:text-danger font-bold py-4 underline text-meta-1">
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

export default DefectListPage;
