const { oportunidadModel } = require('../../database/index.js');
const axios = require('axios');
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ||'gemma3:270m';

/**
 * Genera el "Análisis de Mercado" usando Ollama y actualiza el registro en segundo plano.
 * ESTA FUNCIÓN NO DEBE SER ESPERADA por el hilo principal de Node.js.
 */
const generarAnalisisDeMercado = async (oportunidadId, nombre, monto) => {
    console.log(`[IA WORKER] Iniciando generación de Análisis de Mercado para ID: ${oportunidadId}`);
    
    const prompt = `Dame un análisis de mercado muy corto sobre una oportunidad de inversion 
                    en un proyecto ${nombre} y la inversion es de ${monto} pesos mexicanos
                    (conesta en español).`;
    
    const ollamaPayload = {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false
    };
    console.log(`[IA WORKER] URL de Ollama: ${OLLAMA_API_URL}`);
    console.log(`[IA WORKER] Modelo: ${OLLAMA_MODEL}`);
    console.log(`[IA WORKER] Payload:`, JSON.stringify(ollamaPayload, null, 2));
    
    try {
        console.log(`[IA WORKER] Realizando petición POST a: ${OLLAMA_API_URL}/api/generate`);
        const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, ollamaPayload, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`[IA WORKER] Respuesta recibida. Status: ${response.status}`);
        console.log(`[IA WORKER] Datos de respuesta:`, JSON.stringify(response.data, null, 2));
        
        const analysisText = response.data?.response?.trim();
        
        if (!analysisText) {
            throw new Error('La respuesta de Ollama no contiene el campo "response" o está vacío');
        }

        try {
            const oportunidad = await oportunidadModel.findByPk(oportunidadId);
            
            if (oportunidad) {
                oportunidad.descripcion = analysisText;
                await oportunidad.save();
                console.log(`[IA WORKER] Análisis completado y registro actualizado para ${oportunidadId}.`);
            } else {
                console.error(`[IA WORKER] Error: Oportunidad ID ${oportunidadId} no encontrada para actualización.`);
            }
        } catch (dbError) {
            console.error(`[IA WORKER] Error al actualizar la base de datos:`, dbError.message);
        }

    } catch (error) {
        console.error(`------ Error de la fregada llama -------- `);
        console.error(`[IA WORKER] Tipo de error:`, error.constructor.name);
        console.error(`[IA WORKER] Mensaje:`, error.message);
        console.error(`[IA WORKER] Stack:`, error.stack);
        
        if (axios.isAxiosError(error)) {
            const axiosError = error;
            console.error(`[IA WORKER] --- Detalles del Error de Axios ---`);
            
            if (axiosError.response) {
                console.error(`[IA WORKER] Status Code:`, axiosError.response.status);
                console.error(`[IA WORKER] Status Text:`, axiosError.response.statusText);
                console.error(`[IA WORKER] Headers:`, JSON.stringify(axiosError.response.headers, null, 2));
                console.error(`[IA WORKER] Datos del error:`, JSON.stringify(axiosError.response.data, null, 2));
                console.error(`[IA WORKER] URL solicitada:`, axiosError.config?.url);
                console.error(`[IA WORKER] Método:`, axiosError.config?.method);
                console.error(`[IA WORKER] Payload enviado:`, JSON.stringify(axiosError.config?.data, null, 2));
            } else if (axiosError.request) {
                console.error(`[IA WORKER] Tipo: Error de red/solicitud (sin respuesta del servidor)`);
                console.error(`[IA WORKER] URL solicitada:`, axiosError.config?.url);
                console.error(`[IA WORKER] Método:`, axiosError.config?.method);
                console.error(`[IA WORKER] Timeout configurado:`, axiosError.config?.timeout);
                console.error(`[IA WORKER] Posibles causas:`);
                console.error(`  - El servidor de Ollama no está corriendo en ${OLLAMA_API_URL}`);
                console.error(`  - Problema de conectividad de red`);
                console.error(`  - Timeout de la petición`);
                console.error(`  - Error de CORS`);
                console.error(`  - Firewall bloqueando la conexión`);
            } else {
                console.error(`[IA WORKER] Tipo: Error de configuración`);
                console.error(`[IA WORKER] Mensaje:`, axiosError.message);
            }
        } else {
            console.error(`[IA WORKER] --- Error no relacionado con Axios ---`);
            console.error(`[IA WORKER] Tipo:`, error.constructor.name);
            console.error(`[IA WORKER] Mensaje completo:`, error.message);
        }
        
        console.error(`[IA WORKER] ========================================`);
        
        try {
            const oportunidad = await oportunidadModel.findByPk(oportunidadId);
            if (oportunidad) {
                oportunidad.descripcion = `pendiente de analisis`;
                await oportunidad.save();
            }
        } catch (dbError) {
            console.error(`[IA WORKER] Error al actualizar el error en la base de datos:`, dbError.message);
        }
    }
};

module.exports = generarAnalisisDeMercado;