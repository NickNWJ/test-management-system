import React from 'react';

const ErrorDialog = ({ message }) => {
  return (
    <>
      <div className="fixed z-9999 inset-0 overflow-y-auto drop-shadow-md">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-2 opacity-75"></div>
          </div>
          <div className="z-10 w-full max-w-md p-6 bg-white rounded-lg drop-shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-danger rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium text-gray-900">Error</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>{ message }</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorDialog;