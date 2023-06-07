"use client";
import React, { useEffect, useState, createContext, useContext } from "react";
import { useStateContext } from "./Thirdweb";
import { getAllCampaigns } from "@/app/utils/firebaseFunction";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { contract, address, getCampaigns, getUserCampaigns } = useStateContext();
  const [campaigns, setCampaigns] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [data, setData] = useState([])

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const [data, userData] = await Promise.all([getCampaigns(), getUserCampaigns()]);
    setCampaigns(data);
    setUserCampaigns(userData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  const fetchData = async () => {
    try {
      const result = await getAllCampaigns()
      setData(result)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <ThemeContext.Provider value={{ campaigns, isLoading, userCampaigns, data }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
