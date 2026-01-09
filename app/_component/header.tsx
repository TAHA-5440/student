"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {SignInButton, UserButton, useUser} from '@clerk/nextjs'
import Link from 'next/dist/client/link'
import { usePathname } from 'next/navigation'


const header = () => {
  const path= usePathname();
    const {user,isSignedIn} =useUser();
  return !path.includes("/previewform")&& (
    <div className='flex justify-between items-center border-b-2 shadow p-5'>
        <div>
            <Image src="/public/next.svg" alt="Logo" width={100} height={50} />
        </div>
        {isSignedIn ? 
        <div>

          <div className='flex gap-4 items-center'>
            <Link href="/Dashboard"><Button>Dashboard</Button></Link>
            
            <UserButton />
          </div> 
          </div>:
        <div>
          <SignInButton>
            <Button>Get Started</Button>
          </SignInButton>
        </div>    
}
</div>

  )
}

export default header
