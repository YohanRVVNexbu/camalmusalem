import cardExample1 from '@images/seminuevos/card-example-1.png?format=webp';
import cardExample2 from '@images/seminuevos/card-example-2.png?format=webp';
import certificateBadge from '@images/seminuevos/certificate-toyota.png?format=webp';

export type Vehicle = {
    id: number;
    image: string;
    badge: string;
    year: string;
    brand: string;
    name: string;
    km: string;
    transmission: string;
    fuel: string;
    price: string;
    originalPrice?: string;
    certificateBadge?: string;
    certified: boolean;
};

export const vehicles: Vehicle[] = [
    { id: 1, image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'BMW', name: 'Bmw x1 sdrive 18l 1.5 T\nConfort', km: '53.000 Km', transmission: 'AT', fuel: 'Híbrido', price: '$ 29.990.000', certified: false },
    { id: 2, image: cardExample2, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota Yaris Cross XI\n1.5 ECVT Híbrido', km: '53.000 Km', transmission: 'AT', fuel: 'Eléctrico', originalPrice: '$ 22.590.000', price: '$ 21.990.000', certificateBadge, certified: true },
    { id: 3, image: cardExample1, badge: 'Seminuevo', year: '2023', brand: 'BMW', name: 'Bmw x1 sdrive 18l 1.5 T\nConfort', km: '45.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 29.990.000', certified: false },
    { id: 4, image: cardExample2, badge: 'Seminuevo', year: '2022', brand: 'TOYOTA', name: 'Toyota Corolla Cross\n2.0 SEG CVT', km: '32.000 Km', transmission: 'CVT', fuel: 'Gasolina', price: '$ 22.490.000', certificateBadge, certified: true },
    { id: 5, image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota Hilux 2.8 SRX\n4x4 AT', km: '12.000 Km', transmission: 'AT', fuel: 'Diesel', originalPrice: '$ 36.990.000', price: '$ 35.990.000', certificateBadge, certified: true },
    { id: 6, image: cardExample2, badge: 'Seminuevo', year: '2023', brand: 'Honda', name: 'Honda CR-V 1.5T\nEX-L AWD', km: '28.000 Km', transmission: 'CVT', fuel: 'Gasolina', price: '$ 27.490.000', certified: false },
    { id: 7, image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota RAV4 2.5\nHybrid XLE', km: '18.000 Km', transmission: 'CVT', fuel: 'Híbrido', price: '$ 31.490.000', certificateBadge, certified: true },
    { id: 8, image: cardExample2, badge: 'Seminuevo', year: '2022', brand: 'Mitsubishi', name: 'Mitsubishi L200 2.4\nDI-D Katana', km: '41.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 23.990.000', certified: false },
    { id: 9, image: cardExample1, badge: 'Seminuevo', year: '2023', brand: 'TOYOTA', name: 'Toyota BZ4X\n100% Eléctrico', km: '9.500 Km', transmission: 'AT', fuel: 'Eléctrico', originalPrice: '$ 34.990.000', price: '$ 32.990.000', certificateBadge, certified: true },
    { id: 10, image: cardExample2, badge: 'Seminuevo', year: '2021', brand: 'Citroen', name: 'Citroen C5 Aircross\n1.6T Feel Pack', km: '52.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 18.990.000', certified: false },
    { id: 11, image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota Land Cruiser\nPrado VX', km: '8.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 48.990.000', certificateBadge, certified: true },
    { id: 12, image: cardExample2, badge: 'Seminuevo', year: '2023', brand: 'TOYOTA', name: 'Toyota Yaris 1.5\nSport GLi', km: '22.000 Km', transmission: 'MT', fuel: 'Gasolina', price: '$ 12.990.000', certificateBadge, certified: true },
    { id: 13, image: cardExample1, badge: 'Seminuevo', year: '2022', brand: 'BMW', name: 'BMW Serie 3 320i\nSport Line', km: '38.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 33.490.000', certified: false },
    { id: 14, image: cardExample2, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota Camry 2.5\nHybrid LE', km: '5.000 Km', transmission: 'CVT', fuel: 'Híbrido', price: '$ 28.990.000', certificateBadge, certified: true },
    { id: 15, image: cardExample1, badge: 'Seminuevo', year: '2023', brand: 'Hyundai', name: 'Hyundai Tucson 2.0\nGLS AT', km: '25.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 22.990.000', certified: false },
    { id: 16, image: cardExample2, badge: 'Seminuevo', year: '2022', brand: 'TOYOTA', name: 'Toyota Fortuner 2.8\n4x4 SRV', km: '35.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 39.990.000', certificateBadge, certified: true },
    { id: 17, image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'Kia', name: 'Kia Sportage 1.6T\nGT-Line AWD', km: '10.000 Km', transmission: 'AT', fuel: 'Gasolina', originalPrice: '$ 27.990.000', price: '$ 26.490.000', certified: false },
    { id: 18, image: cardExample2, badge: 'Seminuevo', year: '2023', brand: 'TOYOTA', name: 'Toyota Corolla 1.8\nHybrid SEG', km: '15.000 Km', transmission: 'CVT', fuel: 'Híbrido', price: '$ 24.990.000', certificateBadge, certified: true },
    { id: 19, image: cardExample1, badge: 'Seminuevo', year: '2021', brand: 'Nissan', name: 'Nissan X-Trail 2.5\nExclusive CVT', km: '48.000 Km', transmission: 'CVT', fuel: 'Gasolina', price: '$ 19.990.000', certified: false },
    { id: 20, image: cardExample2, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota SW4 2.8 SRX\n4x4 AT', km: '6.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 45.990.000', certificateBadge, certified: true },
    { id: 21, image: cardExample1, badge: 'Seminuevo', year: '2023', brand: 'Mazda', name: 'Mazda CX-5 2.0\nGT AWD', km: '20.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 26.990.000', certified: false },
    { id: 22, image: cardExample2, badge: 'Seminuevo', year: '2022', brand: 'TOYOTA', name: 'Toyota Hilux 2.4\nDX 4x2', km: '55.000 Km', transmission: 'MT', fuel: 'Diesel', price: '$ 21.490.000', certificateBadge, certified: true },
    { id: 23, image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'Suzuki', name: 'Suzuki Vitara 1.4T\nGLX AllGrip', km: '7.500 Km', transmission: 'AT', fuel: 'Gasolina', originalPrice: '$ 20.990.000', price: '$ 19.490.000', certified: false },
    { id: 24, image: cardExample2, badge: 'Seminuevo', year: '2023', brand: 'TOYOTA', name: 'Toyota RAV4 Prime\nPlug-in Hybrid', km: '11.000 Km', transmission: 'CVT', fuel: 'Híbrido', price: '$ 38.990.000', certificateBadge, certified: true },
    { id: 25, image: cardExample1, badge: 'Seminuevo', year: '2022', brand: 'Chevrolet', name: 'Chevrolet Tracker 1.2T\nPremier AT', km: '30.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 17.490.000', certified: false },
    { id: 26, image: cardExample2, badge: 'Seminuevo', year: '2021', brand: 'TOYOTA', name: 'Toyota C-HR 1.8\nHybrid EV', km: '42.000 Km', transmission: 'CVT', fuel: 'Híbrido', price: '$ 23.490.000', certificateBadge, certified: true },
    { id: 27, image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'Volkswagen', name: 'Volkswagen Taos 1.4T\nHighline DSG', km: '8.500 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 25.990.000', certified: false },
    { id: 28, image: cardExample2, badge: 'Seminuevo', year: '2023', brand: 'TOYOTA', name: 'Toyota Prius 2.0\nHybrid XLE', km: '14.000 Km', transmission: 'CVT', fuel: 'Híbrido', originalPrice: '$ 30.990.000', price: '$ 29.490.000', certificateBadge, certified: true },
    { id: 29, image: cardExample1, badge: 'Seminuevo', year: '2022', brand: 'Ford', name: 'Ford Ranger 3.2\nLimited 4x4', km: '37.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 28.990.000', certified: false },
    { id: 30, image: cardExample2, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota GR86 2.4\nAT Premium', km: '3.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 32.990.000', certificateBadge, certified: true },
];
