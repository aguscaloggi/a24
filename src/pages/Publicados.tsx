import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import CarCard from "../components/CarCard";
import "../css/Publicados.css";

interface Car {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  imagen?: string;
}

function Publicados() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await API.get('carApi', '/cars', {});
                setCars(data.items);
            } catch (error) {
                console.error("Error fetching cars:", error);
                setError("Error al cargar los vehículos");
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    if (loading) return <div>Cargando vehículos...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="publicados">
            <h2 className="welcome">Vehículos publicados</h2>
            <p className="description">Encontrá tu próximo auto entre nuestras publicaciones.</p>
            <div className="cars-grid">
                {cars.map(car => (
                    <CarCard key={car.id} car={car} />
                ))}
            </div>
        </div>
    );
}

export default Publicados;
