import Breadcrumb from '../../components/Breadcrumb';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SuccessDialog from "../UiElements/Success";
import ErrorDialog from "../UiElements/Error";
import ConfirmationDialog from "../UiElements/Confirmation";
import LoadingSpinner from "../UiElements/LoadingSpinner";

const TestDataListPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequirements, setFilteredRequirements] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deletedRowId, setDeletedRowId] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    const filteredRequirements = requirements.filter((requirement) =>
      requirement._id.includes(searchTerm)
    );
    setFilteredRequirements(filteredRequirements);
  };

  const handleDeleteRequirement = (requirementId) => {
    // Replace this with your API call to delete the requirement
    // You can show a confirmation dialog and handle the success/error messages here

    // Simulating success message
    setSuccessMessage(`Requirement with ID ${requirementId} has been deleted successfully.`);

    // Remove the deleted requirement from the list
    setRequirements((prevRequirements) =>
      prevRequirements.filter((requirement) => requirement._id !== requirementId)
    );

    // Clear the filtered requirements as well
    setFilteredRequirements((prevFilteredRequirements) =>
      prevFilteredRequirements.filter((requirement) => requirement._id !== requirementId)
    );
  };

  return (
    <>
      <Breadcrumb pageName="List Of Test Datas" />

      <div className="flex flex-row rounded-lg justify-center w-full items-center">
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
              Add New Requirement Info
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
                        Title
                      </th>
                      <th scope="col" className="px-6 py-0">
                        Description
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
                        Total Associated Test Plans
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
                    {filteredRequirements ? (
                      filteredRequirements.length > 0 
                        ? (filteredRequirements.map((requirement, index) => (
                      <tr key={index} className="border-b dark:border-neutral-500 drop-shadow-x">
                        <td className="whitespace-nowrap px-6 py-0 font-medium">{index + 1}</td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement._id}</td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement.title}</td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement.description}</td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement.status}</td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement.type}</td>
                        <td className="whitespace-nowrap px-6 py-0">{formatDate(requirement.dateCreated)}</td>
                        <td className="whitespace-nowrap px-6 py-0">{formatDate(requirement.dateUpdated)}</td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement.testPlan.length}</td>
                        <td className="whitespace-nowrap px-6 py-0">{requirement.testCase.length}</td>
                        <td className="py-6 px-4">
                          <div className="flex items-center space-x-3.5">
                            <Link to={`/requirement/details?id=${requirement._id}&type=view`} className="hover:text-primary font-bold py-4 underline">
                              View
                            </Link>
                            <Link to={`/requirement/details?id=${requirement._id}&type=edit`} className="hover:text-primary font-bold py-4 underline text-warning">
                              Edit
                            </Link>
                            <button onClick={() => handleDeleteRequirement(requirement._id)} className="hover:text-danger font-bold py-4 underline text-meta-1">
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

export default TestDataListPage;
