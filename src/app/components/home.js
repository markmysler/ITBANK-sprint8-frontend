import { useEffect, useState } from 'react'
import './home.css'

export default function HomePage({cliente}){
    const [page, setPage] = useState('main')
    const [cuentas, setCuentas] = useState([])
    const [tarjetas, setTarjetas] = useState([])
    useEffect(()=>{
        console.log(page);
        if (page === 'cuentas') {
            getCuentas()
        }else if (page === 'tarjetas') {
            getTarjetas()
        }
    },[page, setPage])
    async function getCuentas(){
        const response = await fetch(`http://127.0.0.1:8000/api/cuenta/${cliente.customer_id}/`)
        const cuentas = await response.json()
        setCuentas(cuentas);
    }
    async function getTarjetas(){
        const response = await fetch(`http://127.0.0.1:8000/api/tarjeta/${cliente.customer_id}/`)
        const tarjetas = await response.json()
        setTarjetas(tarjetas);
    }
    return <main>
        {page === 'main' && <div className="opciones">
            <button className="cuadrado" onClick={()=>setPage('cuentas')}>
                Cuentas
            </button>
            <button className="cuadrado" onClick={()=>setPage('tarjetas')}>
            Tarjetas
            </button>
            <button className="cuadrado"  onClick={()=>setPage('prestamos')}>
            Prestamos
            </button>
            <button className="cuadrado" onClick={()=>setPage('movimientos')}>
            Movimientos
            </button>
        </div>}
        {page === 'cuentas' && <div className='opciones'>
            {cuentas.length > 0 ? cuentas.forEach((cuenta)=>{
                <div>{cuenta.account_id}</div>
            }) : <p>Aun no tenes cuentas</p>}
            <button onClick={()=>setPage('main')}>Volver</button>
            </div>}
            {page === 'tarjetas' && <div className='opciones'>
            {tarjetas.length > 0 ? tarjetas.forEach((tarjeta)=>{
                <div>{tarjeta.account_id}</div>
            }) : <p>Aun no tenes tarjetas</p>}
            <button onClick={()=>setPage('main')}>Volver</button>
            </div>}
    </main>
}