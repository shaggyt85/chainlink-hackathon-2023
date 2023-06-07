
import React from 'react'
import { useThemeContext } from '../../Context/GetCampaigns'
import DisplayCampaigns from '../DisplayCampaigns'

const Getcampaigns = () => {
  const {campaigns, isLoading, data} = useThemeContext()
  return (
    <DisplayCampaigns  title="All Campaigns" isLoading={isLoading} campaigns={campaigns} data={data} />
  )
}

export default Getcampaigns