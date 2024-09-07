import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import Loader from "./Loader";

const containerStyle = {
    width: '400px',
    height: '400px'
};

const GoogleMapsComponent = ({ location }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={10}
        >
            <Marker position={location} />
        </GoogleMap>
    ) : <Loader />;
};

export default GoogleMapsComponent;
