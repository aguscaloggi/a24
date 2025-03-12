import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "./SearchForm";
import "../css/NavBar.css";
import "../css/ProfileMenu.css";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // Estado simulado para visualización - eliminar cuando se integre AWS
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (isMenuOpen && !(event.target as Element).closest('.navbar-links')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Handler temporal para simulación visual - eliminar cuando se integre AWS
  const handleAuthAction = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true);
    } else {
      // Simular redirección a login
      window.location.href = '/login';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">Auto24</Link>
        
        <div className="search-container">
          <SearchForm />
        </div>

        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/publicados" className="nav-link">Publicados</Link>
          <Link to="/publicar" className="nav-link">Publicar</Link>
          <Link to="/about" className="nav-link">Quiénes somos?</Link>

          <div className="profile-menu" ref={profileMenuRef}>
            <button 
              className="nav-link-sign"
              onClick={() => isLoggedIn 
                ? setIsProfileMenuOpen(!isProfileMenuOpen) 
                : handleAuthAction()}
            >
              {isLoggedIn ? "Mi Cuenta" : "Ingresar"}
            </button>
            
            {isLoggedIn && (
              <div className={`profile-dropdown ${isProfileMenuOpen ? "show" : ""}`}>
                <Link 
                  to="/perfil" 
                  className="dropdown-item"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Editar Perfil
                </Link>
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="material-symbols-outlined">
            {isMenuOpen ? "close" : "menu"}
          </span>
        </button>

        {showLogoutModal && (
          <>
            <div className="modal-overlay" onClick={() => setShowLogoutModal(false)} />
            <div className="confirmation-modal">
              <h3>¿Estás seguro de cerrar sesión?</h3>
              <div className="modal-buttons">
                <button 
                  className="modal-button cancel"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="modal-button confirm"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setShowLogoutModal(false);
                  }}
                >
                  Sí, cerrar sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;