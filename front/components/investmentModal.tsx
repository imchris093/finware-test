import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/authContext';

interface Opportunity {
  id: string;
  nombre: string;
  descripcion: string;
  monto_total: string | number;
}

interface InvestmentModalProps {
  opportunity: Opportunity;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const InvestmentModal = ({ opportunity, onClose, onSuccess }: InvestmentModalProps) => {
  const { updateSaldo } = useAuth();
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const formatCurrency = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    return isNaN(num) ? 'N/A' : num.toLocaleString('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  };

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0 || amount > parseFloat(opportunity.monto_total.toString())) {
      setError('Monto inválido. Debe ser un número positivo y no exceder el monto total de la oportunidad.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      const payload = {
        oportunidad_id: opportunity.id,
        monto_invertido: amount.toFixed(2), // Formato decimal con 2 dígitos
      };

      const response = await axios.post(`${API_URL}/api/v1/operations/invest`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Actualizar el saldo si la respuesta incluye el nuevo saldo
      if (response.data?.nuevo_saldo !== undefined && updateSaldo) {
        updateSaldo(response.data.nuevo_saldo);
      }

      onSuccess(`¡Inversión exitosa en ${opportunity.nombre} por ${formatCurrency(amount)}!`);
      onClose();

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Error al procesar la inversión. Inténtalo de nuevo.';
        setError(errorMessage);
        if (axiosError.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error('Error de respuesta:', axiosError.response.status);
          console.error('Datos del error:', axiosError.response.data);
        } else if (axiosError.request) {
          // La solicitud fue hecha pero no se recibió respuesta (ej. error de red, CORS)
          console.error('Error de red/solicitud:', axiosError.request);
        } else {
          // Algo más causó el error (ej. error en la configuración de Axios)
          console.error('Error de configuración:', axiosError.message);
        }
      } else {
        // Manejar otros tipos de errores que no son de Axios
        const error = err as Error;
        console.error('Error inesperado:', error.message);
        setError('Error inesperado. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Overlay de fondo
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm p-4">
      {/* Contenedor del Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 ease-out duration-300">
        
        {/* Cabecera */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-indigo-600">Invertir en: {opportunity.nombre}</h2>
          <p className="text-sm text-gray-500 mt-1">{opportunity.descripcion}</p>
        </div>

        <form onSubmit={handleInvest}>
          <div className="p-6 space-y-4">
            {/* Detalles de la Oportunidad */}
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-sm font-medium text-indigo-800">Monto objetivo total:</p>
              <p className="text-xl font-extrabold text-indigo-900">
                {formatCurrency(opportunity.monto_total)}
              </p>
              <p className="text-xs text-indigo-600 mt-1">ID: {opportunity.id}</p>
            </div>

            {/* Input de Monto */}
            <div>
              <label htmlFor="montoInvertir" className="block text-sm font-medium text-gray-700 mb-2">
                Monto a invertir (MXN)
              </label>
              <input
                id="montoInvertir"
                type="number"
                step="0.01"
                min="0.01"
                max={parseFloat(opportunity.monto_total.toString())}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                placeholder="Ejemplo: 500.50"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
              />
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Footer con Botones */}
          <div className="flex justify-end p-6 bg-gray-50 space-x-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition duration-150"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Invertir
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default InvestmentModal;

