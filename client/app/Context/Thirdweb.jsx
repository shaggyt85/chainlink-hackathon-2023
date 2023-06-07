"use client";
import React, { useContext, createContext, useEffect, use } from "react";
import {
  useContract,
  useContractWrite,
  useAddress,
  useMetamask,
} from "@thirdweb-dev/react";
import { CrowdFundingAddress } from "@/app/Context/Contants";
import { AbiContract } from "./AbiContract";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [campaigns, setCampaigns] = React.useState([]);
  const [allStateCampaigns, setAllStateCampaigns] = React.useState([]);
  const { contract } = useContract(
    CrowdFundingAddress,
    AbiContract
  );
  const { mutateAsync: create } = useContractWrite(
    contract,
    "create"
  );
  const { mutateAsync: voteCampaign } = useContractWrite(contract, "voteCampaign")

  const address = useAddress();
  const connect = useMetamask();
  
  const publishCampaigns = async (isWebForm) => {
    try {
      const data = await create({args: [
        isWebForm.goals,
        new Date(isWebForm.startAt).getTime() / 1000,
        new Date(isWebForm.endAt).getTime() / 1000,
    ]})
      console.log("contract call success", data)
    }catch (error) {
      console.log("contract call failure", error)
    }
  }
  
  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns')
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      id: campaign.id.toNumber(),
      owner: campaign.creator,
      votes: campaign.startAt.toNumber(),
      startAt: campaign.endAt.toNumber(), 
      target: ethers.utils.formatEther(campaign.goals.toString()),
      endAt: campaign.votes.toNumber(),
      pId: i,
    }))
    return parsedCampaigns
  }
  
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns()
    const filteredCampaigns = allCampaigns.filter(campaign => campaign.owner === address)
    return filteredCampaigns
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaigns = await getCampaigns()
        const allStateCampaigns = await getUserCampaigns()
        setCampaigns(campaigns)
        setAllStateCampaigns(allStateCampaigns)
      } catch (err) {
        console.error(err)
      }
    }
  
    fetchData()
  
    const intervalId = setInterval(fetchData, 60000)
  
    return () => clearInterval(intervalId)
  }, [contract])  

  const getVote = async (idUrl) => {
    try {
      const data = await voteCampaign({args: [
        idUrl.idUrl,
      ]})
      console.log("Vote call success", data)
    }catch(error){
    console.log("contract call failure", error)
    }
  }

  
  return (
    <StateContext.Provider value={{ contract, connect, address, getCampaigns, create: publishCampaigns, getUserCampaigns, voteCampaign: getVote, }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
