// src/componentes/MapaEndereco.tsx
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import dotenv from "dotenv";


interface Props {
  enderecoCompleto: string;
}

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function MapaEndereco({ enderecoCompleto }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [coordenadas, setCoordenadas] =
    useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    if (!isLoaded || !enderecoCompleto) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: enderecoCompleto }, (results: any, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        setCoordenadas({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        console.error("Erro ao geocodificar:", status);
      }
    });
  }, [isLoaded, enderecoCompleto]);

  if (!isLoaded) return <p>Carregando mapa...</p>;
  if (!coordenadas) return <p>Endereço não localizado no mapa.</p>;

  return (
    <div className="mt-6">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coordenadas}
        zoom={15}
      >
        <Marker position={coordenadas} />
      </GoogleMap>
    </div>
  );
}
