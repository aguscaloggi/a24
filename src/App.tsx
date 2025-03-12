import './css/App.css';
import './css/colors.css';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Publicados from './pages/Publicados';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

// Configuración de AWS Amplify
Amplify.configure(outputs);

function App() {
  return (
    <div>
      <Navbar />
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/publicados" element={<Publicados />} />
          <Route path="/login" element={<Login />} />
          <Route path='/perfil' element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;