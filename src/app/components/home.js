import { useEffect, useState } from 'react'
import './home.css'

export default function HomePage({cliente}){
    const [page, setPage] = useState('main')
    const [cuentas, setCuentas] = useState([])
    const [tarjetas, setTarjetas] = useState([])
    const [sucursales, setSucursales] = useState([])
    const [cuentaDialog, setCuentaDialog] = useState(false)
    const [tarjetaDialog, setTarjetaDialog] = useState(false)
    const [cardType, setCardType] = useState('DEBITO');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let data = {};
        for (let pair of formData.entries()) {
         data[pair[0]] = pair[1];
        }
        if (data.card_type === 'DEBITO' && !data.related_account) {
         alert('Se requiere una cuenta relacionada para crear una tarjeta de debito');
         return;
        }
        fetch(`http://127.0.0.1:8000/api/tarjeta/${cliente.customer_id}/`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
        })
        .then(response => {
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
         return response.json();
        })
        .then(data => {
         setTarjetaDialog(!tarjetaDialog)
        })
        .catch(error => {
         console.error('Error:', error);
        });
       };
    const createAccount = async (accountType) => {
        const response = await fetch(`http://127.0.0.1:8000/api/cuenta/${cliente.customer_id}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account_type: accountType,
          }),
        });
       
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
       
        const data = await response.json();
        console.log(data);
        setCuentaDialog(!cuentaDialog)
        return data;
       };
    useEffect(()=>{
        console.log(page);
        if (page === 'cuentas') {
            getCuentas()
        }else if (page === 'tarjetas') {
            getCuentas()
            getTarjetas()
        }else if(page === 'sucursales'){
            getSucursales()
        }
    },[page, setPage])
    async function getCuentas(){
        if (cuentas.length === 0) {
            const response = await fetch(`http://127.0.0.1:8000/api/cuenta/${cliente.customer_id}/`)
            const cuentasData = await response.json()
            console.log(cuentasData);
            setCuentas(cuentasData);
        }
    }
    async function getTarjetas(){
        if (tarjetas.length === 0 ){
            const response = await fetch(`http://127.0.0.1:8000/api/tarjeta/${cliente.customer_id}/`)
            const tarjetasData = await response.json()
            setTarjetas(tarjetasData);
            console.log(tarjetasData);
        }
    }
    async function getSucursales(){
        if (sucursales.length === 0) {
            const response = await fetch(`http://127.0.0.1:8000/api/sucursal/`)
            const sucursalesData = await response.json()
            setSucursales(sucursalesData);
            console.log(sucursalesData);
        }
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
            <button className="cuadrado" onClick={()=>setPage('sucursales')}>
            Sucursales
            </button>
        </div>}
        {page === 'cuentas' && <div className='opciones'>
            <button className='crear' onClick={()=>setCuentaDialog(!cuentaDialog)}>Crear cuenta</button>
            <dialog open={cuentaDialog}>
            <form onSubmit={(e)=>{
                e.preventDefault();
                createAccount(e.target.elements.account_type.value);
            }}>
                    <label htmlFor='account_type'>Tipo de cuenta</label>
                    <select name='account_type'>
                        <option value={'CAJA_AHORRO_PESOS'}>Caja de Ahorro en Pesos</option>
                        <option value={'CAJA_AHORRO_DOLARES'}>Caja de Ahorro en Dolares</option>
                        <option value={'CUENTA_CORRIENTE_PESOS'}>Cuenta Corriente en Pesos</option>
                        <option value={'CUENTA_CORRIENTE_DOLARES'}>Cuenta Corriente en Dolares</option>
                        <option value={'CUENTA_INVERSION'}>Cuenta de Inversion</option>
                    </select>
                    <div className='dialogButtons'>
                        <button type='submit'>Crear</button>
                        <button type='button' onClick={()=>setCuentaDialog(!cuentaDialog)}>Cancelar</button>
                    </div>
                    
                </form>
            </dialog>
            {cuentas.length > 0 ? cuentas.map((cuenta)=>{
                return <div key={cuenta.account_id} className='cuenta'>
                    <h2>Cuenta nro: {cuenta.account_id}</h2>
                    <p>{cuenta.account_type}</p>
                    <span>${cuenta.balance}</span>
                    </div>
            }) : <p className='noCards'>Aun no tenes cuentas</p>}
            <button className='volver' onClick={()=>setPage('main')}>Volver</button>
            </div>}
            {page === 'tarjetas' && <div className='opciones'>
                <dialog open={tarjetaDialog}>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='card_type'>Tipo de tarjeta</label>
                        <select defaultValue={"DEBITO"} name='card_type' onChange={(e) => setCardType(e.target.value)}>
                            <option value={'DEBITO'}>Debito</option>
                            <option value={'CREDITO'}>Credito</option>
                        </select>
                        <label>Emisor</label>
                        <select name='card_issuer'>
                            <option value={'VISA'}>VISA</option>
                            <option value={'MASTER_CARD'}>MASTER CARD</option>
                            <option value={'AMERICAN_EXPRESS'}>AMERICAN EXPRESS</option>
                        </select>
                        {cardType === 'DEBITO' && (
                            <>
                            <label htmlFor='related_account'>Cuenta relacionada</label>
                            <select name='related_account'>
                                {cuentas.map((c)=>{
                                    return <option key={c.account_id} value={c.account_id}>Cuenta nro: {c.account_id}</option>
                                })}
                            </select>
                            </>
                        )}
                        <div className='dialogButtons'>
                            <button className='crear' type='submit'>Crear</button>
                            <button className='crear' type='button' onClick={()=>setTarjetaDialog(!tarjetaDialog)}>Cancelar</button>
                        </div>
                        
                    </form>
                </dialog>
            <button className='crear' onClick={()=>setTarjetaDialog(!tarjetaDialog)}>Nueva tarjeta</button>
            {tarjetas.length > 0 ? tarjetas.map((tarjeta, index)=>{
                return <div key={index} className='tarjeta'>
                    <h2>{tarjeta.card_issuer} Nro: {tarjeta.card_number}</h2>
                    <p>{tarjeta.card_type}</p>
                    {tarjeta.card_type === 'DEBITO' && <p>Nro cuenta relacionada: {tarjeta.related_account}</p>}
                    <p>Fecha de emision: {tarjeta.emision_date}</p>
                    <p>Fecha de vencimiento: {tarjeta.expiry_date}</p>
                    </div>
            }) : <p className='noCards'>Aun no tenes tarjetas</p>}
            <button className='volver' onClick={()=>setPage('main')}>Volver</button>
            </div>}
            {page === 'sucursales' && <div className='opciones'>
                {sucursales.length > 0 && sucursales.map((sucursal)=>{
                    return <div className='sucursal' key={sucursal.branch_id}>
                        <h2>{sucursal.branch_id}</h2>
                        <p>{sucursal.country}</p>
                        <p>{sucursal.region}</p>
                        <p>{sucursal.address}</p>
                    </div>
                })}
                <button className='volver' onClick={()=>setPage('main')}>Volver</button>
                </div>}
    </main>
}