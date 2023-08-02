import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";


const ProjectDropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef<any>(null);
    const dropdown = useRef<any>(null);
    const [applications, setApplications] = useState([]);

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
        } else {
            throw new Error('Failed to fetch applications');
        }
        } catch (error) {
        console.error(error);
        // Handle error state or display error message
        }
    };
  
    // close on click outside
    useEffect(() => {
        console.log("first");
        const clickHandler = ({ target }: MouseEvent) => {
            if (!dropdown.current) return;
            if (
            !dropdownOpen ||
            dropdown.current.contains(target) ||
            trigger.current.contains(target)
            )
            return;
        setDropdownOpen(false);
        console.log("drop");
      };
      document.addEventListener('click', clickHandler);
      return () => document.removeEventListener('click', clickHandler);
    },[dropdownOpen]);
  
    // close if the esc key is pressed
    useEffect(() => {
      const keyHandler = ({ keyCode }: KeyboardEvent) => {
        if (!dropdownOpen || keyCode !== 27) return;
        setDropdownOpen(false);
      };
      document.addEventListener('keydown', keyHandler);
      return () => document.removeEventListener('keydown', keyHandler);
    }, [dropdownOpen]);
    

    return (
        <>
            <div className="dropdown-one w-full rounded outline-none bg-white relative mt-2 shadow-md">
                <button
                    ref={trigger}
                    onClick={() => {setDropdownOpen(!dropdownOpen); console.log(dropdownOpen);}}
                    className="relative px-5 py-[12px] flex items-center justify-between w-full shadow-sm"
                >
                    <span
                        className="pr-4 text-gray-600 text-sm font-bold"
                        id="drop-down-content-setter_dropdown_3"
                    >
                        Select Application Under Test
                    </span>
                    <svg
                        className={`hidden fill-current sm:block ${
                            dropdownOpen ? 'rotate-180' : ''
                        }`}
                        width={12}
                        height={8}
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        d="M1.06216 1.9393L5.43028 7.0368C5.50069 7.11892 5.58803 7.18484 5.68631 7.23003C5.78459 7.27522 5.89148 7.29862 5.99966 7.29862C6.10783 7.29862 6.21472 7.27522 6.313 7.23003C6.41128 7.18484 6.49862 7.11892 6.56903 7.0368L10.9372 1.9393C11.354 1.45273 11.0084 0.701172 10.3678 0.701172H1.63028C0.989656 0.701172 0.644031 1.45273 1.06216 1.9393Z"
                        fill="#1F2937"
                        />
                    </svg>
                </button>
                {/* <!-- Dropdown Start --> */}
                <div
                    ref={dropdown}
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={() => setDropdownOpen(false)}
                    className={`${
                        dropdownOpen ? "block" : "hidden"
                    } rounded w-full px-3 py-2 absolute top-16 right-0 bg-white shadow-lg`}
                    id="drop-down-div_dropdown_3"
                >
                    {applications ? ( 
                        applications.length > 0
                            ? (applications.sort(function(a,b) {
                                    return a.ID.localeCompare(b.ID);
                                }).map((application) => (
                                <div
                                    key={application._id}
                                    className="flex items-center justify-between hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800 p-3 hover:font-bold"
                                >
                                    <Link
                                        to={`/?application=${application.ID}`} className="cursor-pointer">
                                    <p className="text-sm leading-none">{application.name} ({application.ID})</p>
                                    </Link>
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
                                        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                                    />
                                    </svg>
            
                                </div>            
                            ))) : ""
                    ) : ""}
                </div>
            </div>
        </>
    );
}

export default ProjectDropdown;