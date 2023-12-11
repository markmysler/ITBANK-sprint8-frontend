'use client'
import Header from '../components/header'
import './signup.css'
import { useRouter } from "next/navigation"

export default function signup(){
    const router = useRouter()
    async function onSubmit(event){
        const data = {}
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        for (const key of formData.keys()) {
            data[key] = formData.get(key)
        }
        const response = await fetch('http://localhost:8000/api/auth/register/',
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': data.username, 
            'password1': data.password1, 
            'password2': data.password2
        })
        }
)
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        const userId = await response.json();

        const response2 = await fetch('http://localhost:8000/api/auth/create-client/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: userId.user_id,
                customer_name: data.name,
                customer_surname: data.last_name,
                customer_dni: data.dni,
                dob: data.dob,
                customer_type: data.customer_type
            })
        })
        if (!response2.ok) {
            const message = `An error has occured: ${response2.status}`;
            throw new Error(message);
        }
        const client = await response2.json();
        if (client && client.user && client.customer_name) {
            router.push('/login')
        }
    }
    return(
    <>
    <Header/>
    <main>
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="username">Nombre de Usuario</label>
                <input type="text" placeholder="Nombre de usuario" name="username"/>
            </div>
            <div>
                <label htmlFor="password1">Contraseña</label>
                <input type="password" placeholder="Contraseña" name="password1"/>
            </div>
            <div>
                <label htmlFor="password2">Confirmar contraseña</label>
                <input type="password" placeholder="Repetir contraseña" name="password2"/>
            </div>
            <div>
                <label htmlFor="name">Nombre</label>
                <input type="text" placeholder="Nombre" name="name"/>
            </div>
            <div>
                <label htmlFor="last_name">Apellido</label>
                <input type="text" placeholder="Apellido" name="last_name"/>
            </div>
            <div>
                <label htmlFor="dni">DNI</label>
                <input type="number" placeholder="DNI" name="dni"/>
            </div>
            <div>
                <label htmlFor="dob">Fecha de nacimiento</label>
                <input type="date" placeholder="Fecha de nacimiento" name="dob"/>
            </div>
            <div>
                <label htmlFor="account_type">Tipo de cuenta</label>
                <select name="account_type">
                    <option value={'Classic'}>Classic</option>
                    <option value={'Gold'}>Gold</option>
                    <option value={'Black'}>Black</option>
                </select>
            </div>
            <button type="submit">Enviar</button>
        </form>
        <a href="/login">Iniciar Sesion</a>
    </main>
    </>
    )
}