'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/header'


export default function Login(){
    const router = useRouter()
    const [error, setError] = useState(null)
    const [token, setToken] = useState(null)

    const saveToken = (token)=>{
        localStorage.setItem('token', token.key)
    }
    async function onSubmit(event) {
        event.preventDefault()
     
        const formData = new FormData(event.currentTarget)
        const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
          method: 'POST',
          body: formData,
        })
    
        const data = await response.json().then((data)=>{
            if (data.non_field_errors) {
            setError(data.non_field_errors[0])
        }else{
            saveToken(data)
            router.push('/')
        }
        })
      }
      useEffect(()=>{
        const savedToken = localStorage.getItem('token')
        if (savedToken !== undefined && savedToken !== null) {
         setToken(savedToken)
         router.push('/')
        }
       },[])
      
    return (
    <>
    <Header/>
    <main>
        {error !== null && error!== undefined ? <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div> : ''}
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="username">Usuario</label>
                <input type="text" name="username"/>
            </div>
            <div>
                <label htmlFor="password">Contraseña</label>
                <input type="password" name="password"/>
            </div>
            <button type="submit">Enviar</button>
        </form>
        <a href='/signup'>Crear cuenta</a>
    </main>
    </>
    )
}