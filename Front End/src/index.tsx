import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header/header';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <div>
        <div className='row'>
          <div className='col'>
            <Header/>
          </div>
          <div className='col-10'>
            <App />
          </div>
        </div>
      </div>
  </React.StrictMode>
);