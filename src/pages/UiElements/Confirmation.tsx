import React from 'react';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <>
        <div className="fixed z-9999 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-2 opacity-75"></div>
            </div>
            <div className="z-10 w-full max-w-md p-6 bg-white rounded-lg drop-shadow-md">
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-black">
                  {message}
                </h3>
              </div>
              <div className="mt-5 sm:mt-6 flex justify-center">
                <button
                  onClick={onConfirm}
                  type="button"
                  className="inline-flex justify-center w-24 rounded-md border border-transparent shadow-sm px-4 py-2 bg-success text-base font-medium text-white hover:bg-success focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success sm:text-sm mr-4"
                >
                  Yes
                </button>
                <button
                  onClick={onCancel}
                  type="button"
                  className="inline-flex justify-center w-24 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-2 sm:text-sm"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default ConfirmationDialog;