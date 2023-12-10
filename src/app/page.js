'use client'
import Image from 'next/image'
import styles from './page.module.css'
import Header from './components/header'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import HomePage from './components/home.js'

export default function Home() {
  const [user,setUser] = useState(null)
  const [cliente,setCliente] = useState(null)
  const router = useRouter()

  async function removeToken(){
    const response = await fetch('http://127.0.0.1:8000/api/auth/logout/', {
          method: 'POST',
        })
        console.log(response.status);
        if (response.status === 200) {
          localStorage.removeItem('token')
          router.push('/login')
        }
        
}

  async function getCliente(){
    const data = await fetch(`http://127.0.0.1:8000/api/clientes/${user['id']}/`, {
    method: 'GET',
  }).then(async(data)=>{
    const clientData = await readStream(data.body)
  console.log(clientData)
  setCliente(JSON.parse(clientData))})
  }

  async function readStream(stream) {
    const reader = stream.getReader();
    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      result += new TextDecoder("utf-8").decode(value);
    }
    return result;
   }

   useEffect(()=>{
    const t = window.localStorage.getItem('token')
    console.log(t);
    if (t=== undefined || t === null) {
     router.push('/login')
    }else{
     async function getUser(){
       const userData = await fetch('http://127.0.0.1:8000/api/user/', {
         'method': 'GET',
         'headers': {
           'Authorization': `Token ${t}`
         }
       });
       const data = await readStream(userData.body);
       console.log(data);
       setUser(JSON.parse(data));
     }
     getUser()
    }
   },[])
useEffect(()=>{
  if(user !== null && user['id'] !== undefined){
    getCliente()
  }
},[user,setUser])
  return (
    <>
    <Header user={user} removeToken={removeToken}/>
    <HomePage cliente={cliente} />
    </>
    
  )
}
