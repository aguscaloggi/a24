import React from 'react';
import "../css/SearchForm.css";

const SearchForm: React.FC = () => {
    return (
        <form className="search-form">
            <input 
                type="text" 
                name="search" 
                placeholder="Buscar..." 
                className="search-input" 
                autoComplete="off"
            />
            <button type="submit" className="search-button">
                <span className="material-symbols-outlined">search</span>
            </button>
        </form>
    );
};

export default SearchForm;
