import React from 'react'

const CountBox = ({title, value}) => {
  return (
    <div className='flex flex-col items-center w-[150px]'>
      <h4 className='font-epilogue font-normal text-[1rem]  bg-[#0e0a03b9] text-white p-2 rounded-t-[10px] w-full text-center truncate '>{value}</h4>
      <p className='font-epilogue font-semibold text-[1rem] bg-[#0e0a03b9] text-white pb-2 w-full rounded-b-[10px] text-center'>{title}</p>
    </div>
  )
}

export default CountBox