import Home from './pages/Home';
import Clientes from './pages/Clientes/Clientes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </Router>
  );
}
export default App;