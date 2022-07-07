import React from "react";
import { MapContainer as LeafletMap, TileLayer, Circle, Popup } from "react-leaflet";
import numeral from "numeral";
import "./Map.css";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 100,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 150,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 250,
  },
};

const Maps = ({ countries, casesType, center, zoom }) => {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {countries.map((country) => (
        
        <Circle
          center={[country.countryInfo.lat, country.countryInfo.long]}
          color={casesTypeColors[casesType].hex}
          fillColor={casesTypeColors[casesType].hex}
          fillOpacity={0.4}
          radius={
            Math.sqrt(country[casesType]) *
            casesTypeColors[casesType].multiplier
          }
          key={country.country}
        >
          <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
        </Circle>
        ))};
      </LeafletMap>
    </div>
  );
};

export default Maps;
