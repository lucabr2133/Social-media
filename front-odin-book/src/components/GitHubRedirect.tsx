import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa desde 'react-router-dom'
import React from 'react';
function GitHubRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    // 1. Verifica si hay un token
    if (token) {
      // 2. Guarda el token en el almacenamiento local
      localStorage.setItem('authToken', token);

      // Puedes usar una key más específica, como un UUID o el ID de la sesión

      // 3. Navega al inicio una vez que el token se ha guardado
      navigate('/');
    } else {
      // 4. Si no hay token, navega a una página de error o al login
      console.error('No se encontró un token de autenticación en la URL.');
      navigate('/login'); // Redirigir al login si falla
    }
  }, [navigate]); // El array de dependencias evita el bucle infinito

  // Opcional: mostrar un mensaje mientras se procesa
  return <div>Procesando autenticación...</div>;
}

export default GitHubRedirect;