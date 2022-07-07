import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@mui/material";
import { useState, useEffect } from "react";
import InfoBox from "./components/InfoBox";
import Maps from "./components/Maps";
import "./App.css";
import Table from "./components/Table";
import { sortData } from "./utils/util";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from "./utils/util";
function App() {
  const [country, setCountry] = useState([]);
  const [global, setGlobal] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountry = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            value: country.countryInfo.iso2,
            name: country.country,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountry(countries);
          setMapCountries(data);
        });
    };
    getCountry();
  }, []);
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    setGlobal(countryCode);
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
        console.log({ lat: data.countryInfo.lat, lng: data.countryInfo.long });
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(5);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 tracker app</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={global}
              onChange={onCountryChange}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {country.map((country) => {
                return (
                  <MenuItem value={country.value} key={country.name}>
                    {country.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
            onClick={(e) => setCasesType("cases")}
          />
          <InfoBox
            isRed
            active={casesType === "recovered"}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
            onClick={(e) => setCasesType("recovered")}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
            onClick={(e) => setCasesType("deaths")}
          />
        </div>

        <Maps
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
        </CardContent>
        <h3>Worldwide new {casesType}</h3>
        <LineGraph className="app__graph" caseType={casesType} />
      </Card>
    </div>
  );
}

export default App;
