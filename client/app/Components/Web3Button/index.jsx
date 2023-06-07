'use client'
import React, { useEffect } from 'react'
import { ConnectWallet } from '@thirdweb-dev/react'
import { useStateContext } from '@/app/Context/Thirdweb';


const Web3Button = () => {
  const {address} = useStateContext()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
      
  useEffect(() => {
    if (!address) {
      setIsLoggedIn(false)
    }else{
      setIsLoggedIn(true);
    }
  }), [address]


  return (
    <>
    <div>
      {isLoggedIn ? (<ConnectWallet  />) : (<ConnectWallet  />)}
    </div>
    </>
  )
}

export default Web3Button