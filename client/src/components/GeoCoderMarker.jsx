import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ELG from 'esri-leaflet-geocoder';

const DefaultIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const GeoCoderMarker = ({ address }) => {
    const map = useMap();
    const [position, setPosition] = useState(null);

    useEffect(() => {
        if (!address) return;

        const geocoder = ELG.geocode({
            apikey: process.env.REACT_APP_GEOCODER_API_KEY
        });

        geocoder.text(address).run((err, results) => {
            if (err || !results?.results?.length) {
                console.error("Geocoding error:", err);
                return;
            }

            const { latlng } = results.results[0];
            setPosition(latlng);

            map.whenReady(() => {
                map.flyTo(latlng, 13);
            });
        });
    }, [address, map]);

    return position ? (
        <Marker position={position} icon={DefaultIcon}>
            <Popup>{address}</Popup>
        </Marker>
    ) : null;
};

export default GeoCoderMarker;
