import { ImageResponse } from 'next/og'
import { Icons } from '../components/icons'
import React from 'react'
 
export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
        }}
      >
        <Icons.logo color="black" />
      </div>
    ),
    {
      ...size,
    }
  )
}