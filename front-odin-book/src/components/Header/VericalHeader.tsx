import { Link } from 'react-router'
import React from 'react'
import { User } from '../../types'
interface props{
  userActive:User,
  setOpenDialog2s:React.Dispatch<React.SetStateAction<boolean>>
}
function VerticalHeader () {
  return (
    
    <header style={
        {
            display:'flex',
            width:'99vw',
            borderBottom:'1px solid white',
            height:'80px',
            position:'sticky',
            top:0,
            background:'black'
        }
    }   >
      <ul style={
        {
            width:'100%',
            display:'flex',
            justifyContent:'end'
        }
      }>

      </ul>
    </header>
  )
}

export default VerticalHeader
