"use client"
import React, { useEffect, useState } from 'react';
import "./home.css";
import { useRouter } from "next/navigation";
import { signOut, useSession } from 'next-auth/react';


function Home( {API_URL}) {
  const { data: session ,status } = useSession();

  /* if (status === 'loading') {
    return <div>Loading...</div>;
  } */
  console.log("sesion home",session);

  const router = useRouter();

  const [user, setUser] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user.username);
      setId(session.user.user_id);
    }
  }, [session]);
    
    const [token, setToken] = useState('');
 

  const handleLogout = () => {
    signOut();
  };



  const changePassword = () => {
    router.push('/home/changepassword');
    // Redireccionar a la página de cambio de contraseña
    /* window.location.href = '/changepassword'; */
  };
   
  const deleteAccount = async (id, user) => {
    if (window.confirm('¿Desea eliminar la cuenta?')) {
      const response = await fetch(`${API_URL}/loginup/${id}`, {
        method: "DELETE",
      });
  
      const deleteAll = await fetch(`${API_URL}/tasks/deleteall/${user}`, {
        method: "DELETE",
      });
  
      if (response.status === 200 && deleteAll.status === 200) {
        // La cuenta se ha eliminado correctamente
        window.alert('Cuenta eliminada correctamente');
        router.push('/');
      } else {
        // Ocurrió un error al eliminar la cuenta
        console.log('Error al eliminar la cuenta');
        window.alert('Error al eliminar la cuenta');
      }
    }
  };
  

  const task=() => {
    router.push('/home/task');
    /* window.location.href = '/home/task'; */
  }

  return (
    <div className="darkTheme">
      <h1>Welcome: {user} ! ,  ID:{id}</h1>
      {/* <code>{JSON.stringify(session, null, 2)}</code> */}
      <button onClick={handleLogout}>Logout</button>
      <br/>
      <br/>
      <button onClick={changePassword}>Change Password</button>
      <br/>
      <br/>
      <button onClick={() => deleteAccount(id, user)}>Delete Account</button>
      <br/>
      <br/>
      <button onClick={task}>Create Task</button>

    </div>
  );
}

export default Home;
