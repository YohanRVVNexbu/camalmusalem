import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export type BranchMapData = {
    id?: number;
    name?: string | null;
    latitude?: number | null;
    longitude?: number | null;
};

const TOYOTA_PIN_SVG = `
<svg width="48" height="48" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 4px rgba(0,0,0,0.35));">
<path fill-rule="evenodd" clip-rule="evenodd" d="M48.1661 94.9865C48.1661 94.9865 17 68.7387 17 42.9115C17 33.8057 20.6173 25.0729 27.056 18.6341C33.4947 12.1954 42.2276 8.57813 51.3333 8.57812C60.4391 8.57813 69.1719 12.1954 75.6107 18.6341C82.0494 25.0729 85.6667 33.8057 85.6667 42.9115C85.6667 68.7387 54.5006 94.9865 54.5006 94.9865C52.7667 96.583 49.9128 96.5659 48.1661 94.9865ZM51.3333 57.9323C53.3059 57.9323 55.2591 57.5438 57.0816 56.7889C58.904 56.034 60.5598 54.9276 61.9547 53.5328C63.3495 52.138 64.4559 50.4821 65.2108 48.6597C65.9656 46.8373 66.3542 44.884 66.3542 42.9115C66.3542 40.9389 65.9656 38.9856 65.2108 37.1632C64.4559 35.3408 63.3495 33.6849 61.9547 32.2901C60.5598 30.8953 58.904 29.7889 57.0816 29.034C55.2591 28.2792 53.3059 27.8906 51.3333 27.8906C47.3496 27.8906 43.529 29.4732 40.712 32.2901C37.895 35.1071 36.3125 38.9277 36.3125 42.9115C36.3125 46.8952 37.895 50.7158 40.712 53.5328C43.529 56.3497 47.3496 57.9323 51.3333 57.9323Z" fill="#EB0A1E"/>
<rect width="34.9464" height="40.4643" transform="translate(34.9465 22.0703)" fill="#EB0A1E"/>
<g clip-path="url(#clip-branch-map-pin)">
<path d="M63.1395 23.6304C59.4358 22.5075 55.5819 21.9585 51.712 22.0024C47.842 21.9585 43.9882 22.5075 40.2844 23.6304C31.8255 26.3516 26 32.0015 26 38.5133C26 47.6825 37.4914 55.1599 51.712 55.1599C65.9006 55.1599 77.4239 47.7144 77.4239 38.5133C77.4239 32.0015 71.6144 26.3516 63.1395 23.6304ZM51.712 48.0177C49.5893 48.0177 47.8576 43.868 47.7618 38.6091C49.0227 38.7447 50.3474 38.7767 51.712 38.7767C53.0686 38.7767 54.4013 38.7128 55.6701 38.6171C55.5664 43.86 53.8347 48.0177 51.712 48.0177ZM48.0252 34.5312C48.5838 30.8364 50.0202 28.2509 51.712 28.2509C53.3718 28.2509 54.8003 30.8364 55.3988 34.5233C52.9459 34.7425 50.4785 34.7452 48.0252 34.5312ZM57.6572 34.228C56.7953 28.4823 54.4651 24.3326 51.712 24.3326C48.9588 24.3326 46.6286 28.4504 45.7668 34.228C40.5478 33.3981 36.8929 31.5706 36.8929 29.408C36.8929 26.4873 43.5403 24.1252 51.712 24.1252C59.8836 24.1252 66.539 26.4873 66.539 29.408C66.539 31.5626 62.8841 33.43 57.6651 34.228H57.6572ZM29.7507 37.9148C29.7507 35.0898 30.8519 32.4644 32.7432 30.1741C32.7113 30.3337 32.7113 30.5093 32.7113 30.6369C32.7113 34.1961 38.0261 37.1806 45.4316 38.3138V39.1118C45.4316 45.6875 47.267 51.2735 49.7888 53.1968C38.5607 52.5344 29.7586 45.9508 29.7586 37.9148H29.7507ZM53.6432 53.2367C56.1649 51.3055 57.9923 45.7194 57.9923 39.1438V38.3457C65.3979 37.2525 70.7127 34.228 70.7127 30.6768C70.7127 30.5093 70.7127 30.3417 70.6807 30.206C72.5658 32.3491 73.6266 35.093 73.6733 37.9467C73.6733 45.9508 64.8712 52.5344 53.6432 53.2287V53.2367Z" fill="white"/>
</g>
<defs><clipPath id="clip-branch-map-pin"><rect width="51.4239" height="33.1599" fill="white" transform="translate(26 22)"/></clipPath></defs>
</svg>`;

const toyotaPinIcon = L.divIcon({
    className: '',
    html: TOYOTA_PIN_SVG,
    iconSize: [48, 48],
    iconAnchor: [24, 45],
});

function MapPan({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 16, { animate: true });
    }, [center, map]);
    return null;
}

export function BranchMap({
    branch,
    className = 'aspect-square w-full lg:aspect-auto lg:h-100',
    placeholder = 'Selecciona una sucursal para ver el mapa',
}: {
    branch: BranchMapData | null;
    className?: string;
    placeholder?: string;
}) {
    const lat = branch?.latitude ?? null;
    const lng = branch?.longitude ?? null;
    const hasCoords = lat !== null && lng !== null;

    return (
        <div className={`relative overflow-hidden rounded-[30px] bg-[#EAEAF1] shadow-sm ${className}`}>
            {hasCoords ? (
                <MapContainer
                    center={[lat, lng]}
                    zoom={16}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                        subdomains="abcd"
                        maxZoom={20}
                    />
                    <MapPan center={[lat, lng]} />
                    <Marker position={[lat, lng]} icon={toyotaPinIcon} />
                </MapContainer>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                        {placeholder}
                    </span>
                </div>
            )}
        </div>
    );
}
