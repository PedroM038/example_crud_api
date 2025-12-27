/**
 * index.js - Ponto de entrada da aplicação React
 * 
 * Responsável por renderizar o componente App no DOM
 * e importar os estilos globais.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

// componente principal da aplicação
import App from './App';

// cria o root e renderiza a aplicação
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
