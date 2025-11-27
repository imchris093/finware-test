#!/bin/sh

ollama serve &

echo "Esperando a que la Llama se despierte..."
echo "Servidor de Ollama iniciado."

ollama pull gemma3:270m

echo "<< Ruidos de llama exitosos >>. (⌐■_■)"

wait $(pgrep ollama)