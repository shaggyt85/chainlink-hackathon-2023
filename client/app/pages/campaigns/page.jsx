'use client'
import React from 'react'
import { useThemeContext } from '@/app/Context/GetCampaigns'
import DisplayCampaigns from '@/app/Components/DisplayCampaigns'

const page = () => {
    const {campaigns} = useThemeContext()
  return (
    <>
    <DisplayCampaigns title="all Campaigns" campaigns={campaigns} />
    </>
  )
}

export default page