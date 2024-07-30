import React from 'react'
import Image from 'next/image'
import { Briefcase, HomeIcon, MessageSquare, SearchIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'

function Header() {
  return (
    <div className='flex items-center p-2 max-w-6xl mx-auto'>
        <Image 
          className='rounded-lg'
          src='https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjk4Mi1kNS0xMF8xLnBuZw.png'
          width={40}
          height={40}
          alt="logo"
        />
        <div className='flex-1'>
           <form className='flex items-center space-x-1 bg-gray-100 p-2 rounded-md mx-2 max-w-96'>
              <SearchIcon className='h-4 text-gray-600'/>
              <input type="text" placeholder='search' className='flex-1 bg-transparent outline-none'/>
           </form>
        </div>
        <div className='flex space-x-4 px-6 items-center'>
            <Link href="/" className='icon'>
                <HomeIcon className='h-5'/>
                <p>Home</p>
            </Link>
            <Link href="/" className='icon hidden md:flex'>
                <UserIcon className='h-5'/>
                <p>Network</p>
            </Link>
            <Link href="" className='icon hidden md:flex'>
                <Briefcase className='h-5'/>
                <p>Jobs</p>
            </Link>
            <Link href="" className='icon'>
                <MessageSquare className='h-5'/>
                <p>Messaging</p>
            </Link>
            
            {/* User button if signed in */}
            <SignedIn>
                 <UserButton/>
            </SignedIn>

            {/* Sign in button if not signed in */}
            <SignedOut>
                <Button asChild variant='secondary'>
                  <SignInButton/>
                </Button>
            </SignedOut>
        </div>
    </div>
  )
}

export default Header