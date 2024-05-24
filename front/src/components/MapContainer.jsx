import React, { useEffect, useState } from "react";
/* import GoogleMapReact from 'google-map-react'; */
import { GoogleMap, StreetViewPanorama, LoadScript } from '@react-google-maps/api';
import { BsDisplay } from "react-icons/bs";

//const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function MapContainer(props) {

    const apiKey = 'AIzaSyBpuxjyShwHApt-FthqurSP4G0xx7nznl0';

    //States
    const [centerGet, setCenter] = useState({ lat: -34.397, lng: 150.644 });

    useEffect(() => {
        console.log(props.cep)

        // Função para buscar coordenadas a partir do CEP usando a API de Geocoding do Google
        const fetchCoordinates = async () => {
            try {
               
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${props.cep}&key=${apiKey}`);
                const data = await response.json();
                if (data.status === "OK" && data.results.length > 0) {
                    const location = data.results[0].geometry.location;
                    setCenter({ lat: location.lat, lng: location.lng });
                    console.log({ lat: location.lat, lng: location.lng })
                } else {
                    console.error("Não foi possível encontrar as coordenadas para o CEP fornecido.");
                    setCenter({ lat: -34.397, lng: 150.644 });
                    console.log(centerGet)
                }
            } catch (error) {
                console.error("Ocorreu um erro ao buscar as coordenadas:", error);
            }
        };

        fetchCoordinates();
    }, [props.cep]);

    const containerStyle = {
        width: '100%',
        height: '400px',
        display: props.showMap
    };

    const center = {
        lat: -34.397,
        lng: 150.644,
    };
    
// Função para inicializar o mapa
    const streetViewPanoramaOptions = {
        position: centerGet,
        pov: { heading: 100, pitch: 10 },
        zoom: 1,
    };

    return (
        
        <LoadScript googleMapsApiKey={apiKey} >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={centerGet}
                zoom={10}
            >
                <StreetViewPanorama options={streetViewPanoramaOptions} />
            </GoogleMap>
        </LoadScript>
    );

    /*  const defaultProps = {
         center: {
             lat: -10.307270115874669,//10.99835602, 
             lng: -36.585319982985084
         },
         zoom: 11
     };
 
 
 
     return (
         // Important! Always set the container height explicitly
         <div style={{ height: '50vh', width: '100%' }}>
             <GoogleMapReact
                 bootstrapURLKeys={{ key: "AIzaSyBpuxjyShwHApt-FthqurSP4G0xx7nznl0" }}
                 defaultCenter={defaultProps.center}
                 defaultZoom={defaultProps.zoom}
                 visible
             >
                 <AnyReactComponent
                     lat={59.955413}
                     lng={30.337844}
                     text="My Marker"
                 />
 
                 <StreetViewPanorama
                     defaultPosition={defaultProps.center}
                     visible
                 />
 
 
             </GoogleMapReact> 
         </div>
     );*/
}
