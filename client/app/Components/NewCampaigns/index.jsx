'use client'
import { useState } from 'react'
import { FormFieldCamapigns, CustomButton } from '..';
import { storage } from '@/firebase.config';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { saveItem } from '@/app/utils/firebaseFunction';
import { useStateContext } from '@/app/Context/Thirdweb';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { useThemeContext } from '@/app/Context/GetCampaigns';


const NewCampaigns = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState(false)
  const [alertStatus, setAlertStatus] = useState('danger')
  const [msg, setMsg] = useState(null)
  const {campaigns, userCampaigns } = useThemeContext()
  const {address, create } = useStateContext()
  const [isForm, setIsForm] = useState({
    address: address,
    name: '',
    title: '',
    description: '',
    image: '',
  });
  const [isWebForm, setIsWebForm] = useState({
    goals: '',
    startAt: '',
    endAt: '',
  })
  

  const lastIdCampaigns = campaigns.map(campaign => {
    return campaign.id
  }).at(-1)
  
  const handleFormFieldChange = (fieldName, e) => {
    setIsForm({
      ...isForm,
      [fieldName]: e.target.value,
    })
    setIsWebForm({
      ...isWebForm,
      [fieldName]: e.target.value,
    })
  }

  const saveDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { address, name, title, description, image } = isForm
    if (!title) {
      setFields(true);
      setMsg('Required fields cant be empty');
      setAlertStatus('danger');
      setTimeout(() => {
        setFields(false);
        setIsLoading(false);
      }, 4000);
      return;
    }
    try {
      await create({...isWebForm, goals: ethers.utils.parseUnits(isWebForm.goals, 18)})
      const data = {
        id: lastIdCampaigns + 1,
        address,
        name,
        title,
        description,
        image,
      };
      saveItem(data, 'Campaigns');
      setFields(true);
      setMsg('data uploaded success');
      clearData();
      setAlertStatus('success');
      setTimeout(() => {
        setFields(false);
        setIsLoading(false);
      }, 4000);
    } catch (error) {
      console.log(error);
    }
    // fetchData();
  };
  
  const clearData = () => {
    setIsForm({
      name: '',
      title: '',
      description: '',
      image: '',
    })
    setIsWebForm({
      goals: '',
      startAt: '',
      endAt: '',
  })
}

  return (
    <div className=" flex justify-center items-center flex-col rounded-[10px]">
      <div className='w-[90%] md:w-[75%]  p-4 flex flex-col items-center justify-center gap-4 '>
          {
            fields && (
              <div className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${alertStatus === 'danger' ? 'bg-red-400 text-red-800' : 'bg-emerald-800'}`}>
                {msg}
              </div>
            )
          }
          </div>
      {router.isFallback || isLoading && "Loader..."}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px]  rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] ">
          Start a Campaign
        </h1>
      </div>
      <form
        onSubmit={saveDetails}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
        <FormFieldCamapigns
            LabelName="Address *"
            placeholder={address}
            value={isForm.address}
            handleChange={(e) => handleFormFieldChange('address', e)}
          />
          <FormFieldCamapigns
            LabelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={isForm.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormFieldCamapigns
            LabelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={isForm.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>
        <FormFieldCamapigns
            LabelName="Story *"
            placeholder="Write your Story"
            isTextArea
            value={isForm.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
          />
        <div className="flex flex-wrap gap-[40px]">
          <FormFieldCamapigns 
            LabelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={isWebForm.goals}
            handleChange={(e) => handleFormFieldChange('goals', e)}
          />
          <FormFieldCamapigns 
            LabelName="In Date *"
            placeholder="In Date"
            inputType="date"
            value={isWebForm.startAt}
            handleChange={(e) => handleFormFieldChange('startAt', e)}
          />
          <FormFieldCamapigns 
            LabelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={isWebForm.endAt}
            handleChange={(e) => handleFormFieldChange('endAt', e)}
          />
        </div>
        <FormFieldCamapigns 
            LabelName="Campaign image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={isForm.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          />
          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton 
              btnType="submit"
              title="Submit new campaign"
              styles="bg-[#1dc071]"
              />
          </div>
      </form>
    </div>
  )
}

export default NewCampaigns