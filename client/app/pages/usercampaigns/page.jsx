'use client'
import React from 'react';
import { useThemeContext } from '@/app/Context/GetCampaigns'
import UserDisplayCampaigns from '@/app/Components/UserDisplayCampaigns';

const page = () => {
    const {userCampaigns} = useThemeContext()
    return <>
    <UserDisplayCampaigns title="all User Campaigns" userCampaigns={userCampaigns} />
    </>
}

export default page;