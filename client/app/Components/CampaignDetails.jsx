"use client";
import React, { useState } from "react";
import { daysLeft, startDays, endDays } from "@/app/utils/dayleft";
import { useThemeContext } from "@/app/Context/GetCampaigns";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import Logo from "@/public/assets/Logo.jpg";
import Image from "next/image";
import { CountBox } from ".";
import { CustomButton } from ".";
import { useStateContext } from "@/app/Context/Thirdweb";

const CampaignDetails = ({
  owner,
  target,
  endAt,
  startAt,
  votes,
  id,
  params,
}) => {
  const [isLoading, setIsloading] = useState(false);
  const remainingDays = daysLeft(endAt);
  const formattedDate = startDays(startAt);
  const formattedEndDate = endDays(endAt);
  const { data } = useThemeContext();
  const [liked, setLiked] = useState(false);
  const {voteCampaign} = useStateContext();
  const idUrl = +params.id;
  const handleClick = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      await voteCampaign({idUrl});
      setLiked(!liked);
      setIsloading(false);
    } catch (error) {
      console.log(error, "error");
    }
  };
  const parsedData = data.map((item) => ({ ...item }));
  const dataFirebase = (id, idUrl) => {
    return parsedData.find((item) => item.id === id && item.id === idUrl);
  };

  const item = dataFirebase(id, idUrl);
  if (item) {
    return (
      <article className="w-full rounded-[1rem] bg-[#e5e5ee] p-[1.25rem]">
        <div className="flex 1 h-full w-full justify-center items-center p-4">
          <div>
            {isLoading && "Loading..."}
            <div className="w-full flex md:flex-row flex-col gap-[30px]">
              <div className="flex-1 flex-col">
                <img
                  src={item.image}
                  alt="campaign"
                  className="w-full h-[510px] object-cover rounded-xl"
                />
                <div className="relative w-full h-[5px] bg-[#e5e5ee] mt-2">
                  <div
                    className="absolute h-full bg-[#4acd8d]"
                    style={{
                      // width: `${calculateBarPercentage(
                      //   item.target
                      //   // state.amountCollected
                      // )}`
                      maxWidth: "100%",
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[16px]">
                <CountBox title="Day Start" value={formattedDate} />
                <CountBox title="Day End" value={formattedEndDate} />
                <CountBox title="Finaliza" value={remainingDays} />
                <CountBox title={`Raised of ${target}`} value={target} />
                {/* <CountBox
                  title="Total Backers"
                  // value={isDonators.length}
                /> */}
              </div>
            </div>
            <div className="mt-[60px] flex md:flex-row flex-col gap-5">
              <div className="flex-[2] flex flex-col gap-[10px]">
                <div className="bg-[#0e0a03b9] rounded-[10px] p-[20px]">
                  <h4 className="font-epilogue font-semibold text-[18px] uppercase text-white ">
                    Creator
                  </h4>
                  <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                    <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full cursor-pointer">
                      <Image
                        src={Logo}
                        alt="user"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-epilogue font-semibold text-[14px]  break-all text-white">
                        {owner}
                      </h4>
                      <p className="mt-[4px] font-epilogue font-normal text-[12px] text-white">
                        Votes: {votes}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0e0a03b9] rounded-[10px] p-[20px]">
                  <h4 className="font-epilogue font-semibold text-[18px] text-white  uppercase ">
                    Story
                  </h4>
                  <div className="mt-[20px]">
                    <p className="font-epilogue font-normal text-[16px]  leading-[26px] text-white text-justify">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="bg-[#0e0a03b9] rounded-[10px] p-[20px]">
                  <h4 className="font-epilogue font-semibold text-[18px] text-white   uppercase ">
                    Donators
                  </h4>
                  <div className="mt-[20px] flex flex-col gap-4">
                    {/* {isDonators.length > 0 ? (
                isDonators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">{index + 1}. {item.donator}</p>
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                      {item.donation}</p>
                  </div>
                ))
              ) : ( */}
                    <p className="font-epilogue font-normal text-[16px] leading-[26px] text-justify text-white">
                      No Donators yet. be the first one!
                    </p>
                    {/* )} */}
                  </div>
                </div>
              </div>
              <div className=" flex-1 bg-[#0e0a03b9] rounded-[10px] p-[20px] flex flex-col gap-[10px] sm:w-[288px] w-full items-center ">
                <h4 className="font-epilogue font-semibold text-[18px] text-white  uppercase ">
                  Vote:
                </h4>
                <div onClick={handleClick}>
                  {liked ? (
                    <FcLike className="text-[50px]" />
                  ) : (
                    <FcLikePlaceholder className="text-[50px]" />
                  )}
                </div>
                <div className="flex flex-col rounded-[10px]">
                  <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-white">
                    Fund the campaign
                  </p>
                  <div className="mt-[30px]">
                    <input
                      type="number"
                      placeholder="ETH 0.1"
                      step="0.01"
                      className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue  text-[18px] leading-[30px] placeholder:text-[#ffffff] rounded-[10px]"
                      // value={isAmount}
                      // onChange={(e) => setIsAmount(e.target.value)}
                    />
                    <div className="my-[20px] p-4 rounded-[10px]">
                      <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                        Back it because you believe in it.
                      </h4>
                      <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-white ">
                        Support the project for no reward, just because it
                        speaks to you
                      </p>
                    </div>
                    <CustomButton
                      btnType="button"
                      title="Fund Campaign"
                      styles="w-full bg-[#8c6dfd]"
                      // handleClick={handleDonate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
};

export default CampaignDetails;
