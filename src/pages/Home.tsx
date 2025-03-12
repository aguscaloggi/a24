import { useEffect, useState } from 'react';
import HomeCarCard from "../components/HomeCarCard";
import "../css/Home.css";

// Interfaz para tipado de vehículos
interface Car {
    id: string;
    marca: string;
    modelo: string;
    año: number;
    precio: number;
    imagen?: string;
}

function Home() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulación de datos - Reemplazar con llamada a AWS Amplify/AppSync
        const mockCars: Car[] = [
            { id: "1", marca: "Toyota", modelo: "Corolla", año: 2022, precio: 25000 },
            { id: "2", marca: "Honda", modelo: "Civic", año: 2021, precio: 23000 },
            { id: "3", marca: "Ford", modelo: "Focus", año: 2020, precio: 20000 }
        ];

        const fetchCars = async () => {
            try {
                // TODO: Implementar conexión real con AWS
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
                setCars(mockCars);
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
        <div className="home">
            <h2 className="home-welcome">Bienvenido</h2>
            <p className="home-p1">Encontrá o publicá tu próximo auto. Nuevos, usados y oportunidades únicas al alcance de un clic.</p>
            <div className="cars-grid">
                {cars.map(car => (
                    <HomeCarCard key={car.id} car={car} />
                ))}
            </div>
        </div>
    );
}

export default Home;
