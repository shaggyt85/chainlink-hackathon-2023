import React from 'react'
import { AboutForm, CancelCustomButton, PhotoForm, SaveCustomButton, UserName } from '..'

const Form = () => {
  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you share.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <UserName />
            <AboutForm />
            <PhotoForm />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <CancelCustomButton />
        <SaveCustomButton />
      </div>
    </form>
  )
}

export default Form