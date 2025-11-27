import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import axios, { AxiosError } from 'axios';

const UserPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" x2="19" y1="8" y2="14"/>
    <line x1="22" x2="16" y1="11" y2="11"/>
  </svg>
);

const RegisterPage = () => {
  const [nombre, setNombre] = useState<string>('');
  const [apellido, setApellido] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [fechaNacimiento, setFechaNacimiento] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/v1/auth/register`, { 
        nombre, 
        apellido, 
        email, 
        telefono,
        fecha_nacimiento: fechaNacimiento,
        password 
      });
      
      alert('¡Registro exitoso! Por favor, inicia sesión.');
      router.push('/auth/login');
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Error al procesar la solicitud.';
        setError(errorMessage);
        if (axiosError.response) {
          console.error('Error de respuesta:', axiosError.response.status);
          console.error('Datos del error:', axiosError.response.data);
        } else if (axiosError.request) {
          console.error('Error de red/solicitud:', axiosError.request);
        } else {
          console.error('Error de configuración:', axiosError.message);
        }
      } else {
        const error = err as Error;
        console.error('Error inesperado:', error.message);
        setError('Error inesperado. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Head>
        <title>Regístrate | Plataforma de Inversión</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-8">
          
          <div className="text-center">
            <UserPlusIcon className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Crea tu Cuenta de Inversionista
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Comienza tu camino hacia el éxito financiero.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              
              {/* Campo de Nombre */}
              <div>
                <label htmlFor="nombre" className="sr-only">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
                />
              </div>

              {/* Campo de Apellido */}
              <div>
                <label htmlFor="apellido" className="sr-only">Apellido</label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApellido(e.target.value)}
                />
              </div>

              {/* Campo de Email */}
              <div>
                <label htmlFor="email-address" className="sr-only">Dirección de Correo Electrónico</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
              </div>

              {/* Campo de Teléfono */}
              <div>
                <label htmlFor="telefono" className="sr-only">Teléfono</label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150"
                  placeholder="Teléfono (Ej: +525512345678)"
                  value={telefono}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefono(e.target.value)}
                />
              </div>

              {/* Campo de Fecha de Nacimiento */}
              <div>
                <label htmlFor="fecha_nacimiento" className="sr-only">Fecha de Nacimiento</label>
                <input
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  autoComplete="bday"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150"
                  placeholder="Fecha de Nacimiento"
                  value={fechaNacimiento}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFechaNacimiento(e.target.value)}
                />
              </div>

              {/* Campo de Contraseña */}
              <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md" role="alert">
                <p className="font-bold">Error de Registro</p>
                <p>{error}</p>
              </div>
            )}

            {/* Botón de Enviar */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'Registrarse'
                )}
              </button>
            </div>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Inicia Sesión
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default RegisterPage;