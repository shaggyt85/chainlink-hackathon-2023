import React from "react";
import {MdAddAPhoto} from 'react-icons/md'
import {BiUserCircle} from 'react-icons/bi'

const PhotoForm = () => {
  return (
    <>
      <div className="col-span-full">
        <label
          htmlFor="photo"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Photo
        </label>
        <div className="mt-2 flex items-center gap-6 justify-center">
          <BiUserCircle
            className="h-12 w-12 text-gray-300 "
            aria-hidden="true"
          />
          {/* <button
            type="button"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Change
          </button> */}
        
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-16 py-10">
          <div className="text-center">
            <MdAddAPhoto
              className="mx-auto h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
        </div>
      </div>
      <div className="col-span-full">
        
      </div>
    </>
  );
};

export default PhotoForm;
