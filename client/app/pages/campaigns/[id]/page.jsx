'use client'
import React from 'react'
import { useThemeContext } from '@/app/Context/GetCampaigns';
import UserDetailCampaigns from '@/app/Components/UserDetailCampaigns';


const page = ({params}) => {  
  const {campaigns} = useThemeContext();
  return (
    <>
     <div flex-1 justify-center items-center p-4>
    <UserDetailCampaigns params={params} campaigns={campaigns} />
    </div>
    </>
  )
}

export default page