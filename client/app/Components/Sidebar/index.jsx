'use client'
import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { BiLeftArrowAlt } from "react-icons/bi";
import { MdOutlineCampaign, MdOutlineFiberNew, MdAccountCircle, MdPaid } from "react-icons/md";
import { SidebarContext } from "@/app/Context/SidebarContext";

const linksSidebar = [
  {
    label: "My Account",
    route: "/pages/perfil/profile",
    icon: <MdAccountCircle />,
  },
  {
    label: "Donator",
    route: "#",
    icon: <MdPaid />,
  },
  {
    label: "User Campaigns",
    route: "/pages/usercampaigns",
    icon: <MdOutlineCampaign />,
  },
  {
    label: "New Campaigns",
    route: "/pages/perfil/newcampaigns",
    icon: <MdOutlineFiberNew />,
  },
];

const Sidebar = () => {

  const {isCollapsedSidebar, toggleSidebarCollapseHandler} = useContext(SidebarContext)

  return (
    <div className="relative">
      <button className="absolute right-0 top-[4.7rem] bg-blue-100 w-6 h-6 border-solid border-[1px] border-blue-300 rounded-[50%] flex justify-center items-center cursor-pointer translate-x-2/4 text-[1.1rem] z-10"
      onClick={toggleSidebarCollapseHandler}>
        <BiLeftArrowAlt />
      </button>
      <aside className={`w-[242px] h-[90vh] bg-gray-100 p-4 transition-all duration-300 ease-in-out ${isCollapsedSidebar ? "w-[5.3rem]" : "translate-x-0"}`}>
        <div className="w-full flex pb-4 mb-4 border-b border-gray-300 border-solid items-center gap-4 justify-center">
          <Link  rel="preload" href="/pages/perfil" as="/pages/perfil">
          <Image src="/assets/Logo.jpg" alt="logo" width={80} height={80} className="w-[55px] h-[55px] object-cover border-y-transparent   rounded-full " />
          </Link>
          <p className={`text-[1.1rem] font-semibold ${isCollapsedSidebar ? "hidden" : "block"}`}>Crowdfunding Web3</p>
        </div>
        <ul className="list-none">
          {linksSidebar.map((link) => (
            <li className="sidebar__item" key={link.label}>
              <Link rel="preload" href={link.route} as={link.route} className=" text-[1.1rem] py-[16px] px-[12px] mb-[16px] flex cursor-pointer bg-white hover:bg-blue-100 transition-all duration-300 ease-in-out rounded-[1rem] " >
                <span className="text-[1.7rem] flex">{link.icon}</span>
                <span className={`ml-[0.5rem] ${isCollapsedSidebar ? "hidden" : "block"}`}>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
