"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

function Header() {
  const path = usePathname();
  const router = useRouter()
  useEffect(() => {
    console.log(path)
  }, [])
  function getRoutLink(path) {
    router.push(path)
  }


  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      {/* <Image src={'/logo.svg'} width={160} height={100} alt='logo' /> */}
      <div className='flex items-center gap-2'>
        <div className='bg-primary text-white p-2 rounded-lg font-bold text-xl'>UV</div>
        <h2 className='font-bold text-xl hidden md:block text-primary'>Urvashi's AI Mock</h2>
      </div>
      <ul className='hidden md:flex gap-6'>

        <li onClick={() => getRoutLink('/dashboard')} className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path == '/dashboard' && 'text-primary font-bold'}`}>Dashboard</li>

        <li onClick={() => getRoutLink('/dashboard/questions')} className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path == '/dashboard/questions' && 'text-primary font-bold'}`}>Questions</li>
        <li onClick={() => getRoutLink('/dashboard/upgrade')} className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path == '/dashboard/upgrade' && 'text-primary font-bold'}`}>Upgrade</li>
        <li onClick={() => getRoutLink('/dashboard/how')} className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path == '/dashboard/how' && 'text-primary font-bold'}`}>How it works?</li>
      </ul>
      {/* <UserButton/> */}
      <div
        onClick={() => getRoutLink('/dashboard/profile')}
        className='w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold cursor-pointer hover:bg-gray-400 transition-all'
      >
        U
      </div>
    </div>
  )
}

export default Header