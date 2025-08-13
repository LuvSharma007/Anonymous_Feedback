'use client'
import React from 'react'
import { signIn, useSession } from 'next-auth/react'

const page = () => {
  const {data:session} = useSession()
  if(session){
    return (
      <>
      Signed In as {session.user.email}
      </>
    )
  }
  return(
    <>
    <h1>Not Signed In</h1>
    <button className='bg-blue-700'
    onClick={()=>signIn()}
    >Sign in</button>
    </>
  )
}

export default page