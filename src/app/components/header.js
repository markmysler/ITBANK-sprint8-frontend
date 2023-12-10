'use client'
import { useEffect } from 'react'
import './header.css'
export default function Header({user, removeToken}){
    return(
        <header>
        <h1>ITBANK</h1>
        <div className='userInfo'>
            {user && <p>{user.username}</p>}
        {user && <button onClick={removeToken}>Cerrar sesion</button>}
        </div>
        
        </header>
    )
}