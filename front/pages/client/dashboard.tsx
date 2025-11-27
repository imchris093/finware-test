import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import withAuth from '../../common/auth/whithAuth';
import { useAuth } from '../../context/authContext';
import axios, { AxiosError } from 'axios';
import OpportunityCard from '../../components/oportunityCard';
import InvestmentModal from '../../components/investmentModal';

// Icono de Gráfico
const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-area-chart">
    <path d="M3 3v18h18"/>
    <path d="M7 15v3"/>
    <path d="M11 12v6"/>
    <path d="M16 17V3"/>
    <path d="M19 12v6"/>
    <path d="M14 6v12"/>
    <path d="M10 17V7"/>
  </svg>
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const Dashboard = () => {
  const { user, logout, updateSaldo  } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[] | null>(null); 
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  interface Opportunity {
    id: string;
    nombre: string;
    descripcion: string;
    monto_total: string | number;
    createdAt: string;
  }

  const openInvestmentModal = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsModalOpen(true);
    setSuccessMessage(null);
  };

  const closeInvestmentModal = () => {
    setSelectedOpportunity(null);
    setIsModalOpen(false);
  };


  useEffect(() => {
    if (!user) return; 

    const fetchOpportunities = async () => {
      setLoadingData(true);
      setErrorData(null);
      
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${API_URL}/api/v1/opportunities`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setOpportunities(response.data || []);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          const errorMessage = axiosError.response?.data?.message || 'Error al procesar la inversión. Inténtalo de nuevo.';
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
        }
        
        setErrorData('No se pudieron cargar los datos. Intenta recargar o iniciar sesión de nuevo.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchOpportunities();
  }, [user]);


  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-medium text-gray-700">Cargando datos del Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Inversiones Chidas</title>
      </Head>
      
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        {/* Encabezado del Dashboard */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200">
          <div className="flex items-center">
            <ChartIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-extrabold text-gray-900">
              Tablero de Inversión
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Saldo disponible para invertir: <span className="text-indigo-600 font-bold">{user?.saldo ? `$${parseFloat(user.saldo.toString()).toFixed(2)} MXN` : "0.00 :("}</span>
            </span>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Bienvenido, <span className="text-indigo-600 font-bold">{`${user?.nombre} ${user?.apellido}`|| user?.email}</span>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="py-8">
          {errorData && (
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6 rounded-lg" role="alert">
              <p className="font-bold">Advertencia de Conexión</p>
              <p>{errorData}</p>
            </div>
          )}

          {opportunities && opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {opportunities.map((opportunity: Opportunity) => {
                return (
                  <OpportunityCard 
                    key={opportunity.id}
                    opportunity={opportunity}
                    onInvestClick={openInvestmentModal}
                  />
                );
              })}
            </div>
          ) : (
             <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                <p className="text-xl font-semibold text-gray-600">
                  No hay oportunidades de inversión activas.
                </p>
                <p className="mt-2 text-gray-500">
                  Vuelve pronto, estamos buscando nuevos proyectos para ti.
                </p>
            </div>
          )}
        </main>
      </div>


      {isModalOpen && selectedOpportunity && (
        <InvestmentModal
          opportunity={selectedOpportunity}
          onClose={closeInvestmentModal}
          onSuccess={setSuccessMessage}
        />
      )}
      
    </>
  );
};

export default withAuth(Dashboard);