// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './LoginForm';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Sidebar from './Components/Sidebar';  // Sidebar importé ici
import TablePont from './TablePont';
import Actions from './Actions';
import NeptuneSide from './NeptuneSide'; // Ajouté pour correspondre à votre structure
import Deconnexion from './Components/Deconnexion';
import UserList from './UserList';
import Diagnostics from './Diagnostics';
import Interventions from './Interventions';
import Signaletiques from './Signaletiques';
import DashGraphe from './DashGraphe';
import About from './About';
import Utilisateurs from './Utilisateurs';
import SidebarAdmin from './SidebarAdmin';
import DashboardAdmin from './DashboardAdmin';
import LoginAdmin from './LoginAdmin';
import SignupAdmin from './SignupAdmin';
import DeconnectAdmin from './DeconnectAdmin';
import PontAdmin from './PontAdmin';
import SignaletiqueAdmin from './SignaletiqueAdmin';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Routes sans Sidebar */}
          <Route path='/' element={<LoginForm />} />
          <Route path='/admin' element={<LoginAdmin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgotPassword' element={<ForgotPassword />} />
          <Route path='/resetPassword' element={<ResetPassword />} />
          <Route path="/siuu" element={<NeptuneSide />} />
          <Route path="/user" element={<UserList />} />
          <Route path="/signAdmin" element={<SignupAdmin />} />

          <Route path="/dashboardadmin" element={<SidebarAdmin><DashboardAdmin /></SidebarAdmin>} />
          <Route path="/utilisateur" element={<SidebarAdmin><Utilisateurs /></SidebarAdmin>} />
          <Route path="/pontAdmin" element={<SidebarAdmin><PontAdmin /></SidebarAdmin>} />
          <Route path="/signalAdmin" element={<SidebarAdmin><SignaletiqueAdmin /></SidebarAdmin>} />
          <Route path="/deconnectAdmin" element={<SidebarAdmin><DeconnectAdmin /></SidebarAdmin>} />
         

         
          
          {/* Routes avec Sidebar */}
          <Route path="/graphe" element={<Sidebar><DashGraphe /></Sidebar>} />
          <Route path="/table" element={<Sidebar><TablePont /></Sidebar>} />
          <Route path="/sign" element={<Sidebar><Signaletiques /></Sidebar>} />
          <Route path="/diagno" element={<Sidebar><Diagnostics /></Sidebar>} />
          <Route path="/intervention" element={<Sidebar><Interventions /></Sidebar>} />
          <Route path="/about" element={<Sidebar><About /></Sidebar>} />
          <Route path="/action" element={<Sidebar><Actions /></Sidebar>} />
          <Route path="/deconnexion" element={<Sidebar><Deconnexion /></Sidebar>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
