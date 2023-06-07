import React from 'react'
import Image from 'next/image'
import loader from '@/public/assets/loader.svg'
import CampaignDetails from './CampaignDetails'

const UserDetailCampaigns = ({title, isLoading, campaigns, params }) => {
  return (
    <div>
      <div className='flex justify-center pt-4'>
        <h1 className="font-epilogue font-semibold text-[18px] text-left">{title}</h1>
        </div>
        <div className="flex flex-wrap mt-[1.25rem] gap-[1.625rem] justify-around">
        {isLoading && (<Image
            src={loader}
            alt="loader"
            className="w-[6.25rem] h-[6.25rem]  object-contain"
          />)}
        {!isLoading && campaigns.length === 0 && (<p className="font-epilogue font-semibold text-[1ren] leading-[1.9rem]">You have not created any campaigns yet</p>)}
        {!isLoading && campaigns.length > 0 && campaigns.map((campaign, i) => (<CampaignDetails key={i}  {...campaign} params={...params} campaigns={campaigns}  />))}
        </div>
    </div>
  )
}

export default UserDetailCampaigns