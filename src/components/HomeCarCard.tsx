import '../css/HomeCarCard.css';
import { useState } from 'react';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  city?: string;
  state?: string;
  condition?: string;
  photos?: string[];
}

interface HomeCarCardProps {
  car: Car;
}

function HomeCarCard({ car }: HomeCarCardProps) {
    const mainPhoto = car.photos?.[0] || 'https://via.placeholder.com/300';
    const carTitle = `${car.brand} ${car.model}`;
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <div className="home-car-card">
            <div className="home-card-divider">
                <div className="home-image-container">
                    <img 
                        src={mainPhoto} 
                        alt={carTitle}
                        className="home-car-image" 
                    />
                    
                    <button 
                        className="home-fav-btn" 
                        onClick={handleFavorite}
                        aria-label="Añadir a favoritos"
                    >
                        <span className="material-icons">
                            {isFavorite ? 'favorite' : 'favorite_border'}
                        </span>
                    </button>
                    
                    {car.condition && (
                        <span className="home-condition-badge">
                            {car.condition}
                        </span>
                    )}
                </div>
                
                <div className="home-car-info">
                    <div className="home-title-price">
                        <h2 className="home-car-title">{carTitle}</h2>
                        <span className="home-original-price">
                            ${car.price?.toLocaleString()}
                        </span>
                    </div>

                    <div className="home-year-mileage">
                        <span>{car.year}</span>
                        <span className="separator">|</span>
                        <span className="home-mileage">
                            {car.mileage?.toLocaleString()} km
                        </span>
                    </div>

                    <div className="details-row">
                        <span className="location">
                            {car.city && car.state ? `${car.city}, ${car.state}` : 'Ubicación no disponible'}
                        </span>
                        <span className="material-symbols-outlined">location_on</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeCarCard;
