import '../css/CarCard.css';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  city: string;
  state: string;
  condition?: string;
  photos?: string[];
  createdBy: string;
}

interface SellerInfo {
  name: string;
  rating?: number;
  reviewsCount?: number;
}

interface CarCardProps {
  car: Car;
}

function CarCard({ car }: CarCardProps) {
    const [sellerInfo, setSellerInfo] = useState<SellerInfo>({ name: 'Cargando...' });
    const mainPhoto = car.photos?.[0] || 'https://via.placeholder.com/300';

    useEffect(() => {
        const fetchSellerInfo = async () => {
            try {
                const data = await API.get('sellerApi', `/sellers/${car.createdBy}`, {});
                setSellerInfo({
                    name: data.name,
                    rating: data.rating,
                    reviewsCount: data.reviewsCount
                });
            } catch (error) {
                console.error('Error:', error);
                setSellerInfo({ name: 'Error de información' });
            }
        };

        if (car.createdBy) fetchSellerInfo();
    }, [car.createdBy]);

    const renderStars = (avgRating: number) => {
        // ... (misma implementación con tipado)
    };

    return (
        <div className="car-card">
            <div className="card-divider">
                <div className="car-mainphoto">
                    <img src={mainPhoto} alt={carTitle} />
                    <div className="car-overlay">
                        <button className="fav-btn" onClick={OnFavoriteClick}>
                            <span className="material-icons">favorite</span>
                        </button>
                        <p className="condition-badge">{car.condition}</p>
                    </div>
                </div>
                
                <div className="car-info">
                    <div className="info-header">
                        <div className="condition-container">
                            <h1 className="car-title">{carTitle}</h1>
                        </div>
                        <div className="pricing">
                            <span className="original-price">${car.price?.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="home-year-mileage">
                        <span>{car.year}</span>
                        <span className="separator">|</span>
                        <span className="home-mileage">
                            {car.mileage?.toLocaleString()} km
                        </span>
                    </div>
                    <div className='seller-details'>
                        <h2 className='seller-name'>{sellerName}</h2>
                        {sellerName !== 'Vendedor Particular' && (
                            <div className="agency-rating">
                                {rating && (
                                    <>
                                        <span className="rating-number">{rating.toFixed(1)}</span>
                                        {renderStars(rating)}
                                        {reviews.length > 0 && (
                                            <span className="reviews-count">
                                                ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="details-row location-container">
                        <span className="location">{car.city}, {car.state}</span>
                        <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <button className="availability-btn">
                        Contactar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CarCard;
