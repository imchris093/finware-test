import React from 'react';

interface Opportunity {
  id: string;
  nombre: string;
  descripcion: string;
  monto_total: string | number;
  createdAt: string;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onInvestClick: (opportunity: Opportunity) => void;
}

const OpportunityCard = ({ opportunity, onInvestClick }: OpportunityCardProps) => {
  const formatCurrency = (amount: string | number) => {

    const num = parseFloat(amount.toString());
    return isNaN(num) ? 'N/A' : num.toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition duration-300 hover:shadow-xl hover:border-indigo-400">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{opportunity.nombre}</h3>
      <p 
        className="text-sm text-gray-600 mb-4 overflow-hidden text-ellipsis line-clamp-3"
        title={opportunity.descripcion}
      >
        {opportunity.descripcion}
      </p>
      
      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Monto Máximo</p>
          <p className="text-2xl font-extrabold text-indigo-600">
            {formatCurrency(opportunity.monto_total)}
          </p>
        </div>
        <button
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition duration-150"
          onClick={() => onInvestClick(opportunity)}
        >
          Invertir
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Publicado el: {new Date(opportunity.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default OpportunityCard;

