import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import GeoCoderMarker from './GeoCoderMarker';
import 'leaflet/dist/leaflet.css';

const Map = ({ streetAddress, city, country }) => {
    const address = `${streetAddress}, ${city}, ${country}`;

    return (
        <MapContainer
            center={[53.35, 18.8]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '40vh', width: '100%' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoCoderMarker address={address} />
        </MapContainer>
    );
};

export default Map;
