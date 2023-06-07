import React from 'react'
import FundCard from '../FundCard'
import Image from 'next/image'
import loader from '@/public/assets/loader.svg'


const UserDisplayCampaigns = ({title, isLoading, userCampaigns, params }) => {
  
  return (
    <div>
      <div className='flex justify-center pt-4'>
      <h1 className="flex font-epilogue font-semibold text-[1rem] bg-[#e5e5ee] px-3 py-2 rounded-[1rem] justify-center text-center max-w-[16.5rem] uppercase">{title}</h1>
      </div>
        <div className="flex flex-wrap mt-[1.25rem] gap-[1.625rem] justify-around">
        {isLoading && (<Image
            src={loader}
            alt="loader"
            className="w-[6.25rem] h-[.25rem] object-contain"
          />)}
        {!isLoading && userCampaigns.length === 0 && (<p className="font-epilogue font-semibold text-[1ren] leading-[1.9rem] ">You have not created any campaigns yet</p>)}
        {!isLoading && userCampaigns.length > 0 && userCampaigns.map((campaign, i) => (<FundCard key={i}  {...campaign} params={...params}  />))}
        </div>
    </div>
  )
}

export default UserDisplayCampaigns