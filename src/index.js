import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { validateIP } from "./helpers";
import locationIcon from "/images/icon-location.svg";

const customIcon = L.icon({
  iconUrl: locationIcon,
  iconSize: [46, 56],
  iconAnchor: [23, 56],
  popupAnchor: [0, -56],
});

const input = document.querySelector(".search-bar__input");
const btn = document.querySelector(".search-bar__btn");
const ipInfo = document.querySelector("#ip");
const locationEl = document.querySelector("#location");
const timezone = document.querySelector("#timezone");
const isp = document.querySelector("#isp");

let currentMarker;
let map;

async function getData() {
  if (validateIP(input.value)) {
    const response = await fetch(
      `https://ip-intelligence.abstractapi.com/v1/?api_key=c5f36294674043eca9467293504df44b&ip_address=${input.value}`,
    );
    const data = await response.json();
    printData(data);
    return data;
  }
  return false;
}

function printData(data) {
  ipInfo.innerHTML = data.ip_address;
  locationEl.innerHTML = data.location.city || "NA";
  timezone.innerHTML = data.timezone.name || "NA";
  isp.innerHTML = data.asn.name || "NA";

  if (currentMarker) map.removeLayer(currentMarker);
  currentMarker = L.marker([data.location.latitude, data.location.longitude], {
    icon: customIcon,
  }).addTo(map);
  map.setView([data.location.latitude, data.location.longitude], 13);
}

map = L.map("map").setView([53.8997, 27.5667], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

currentMarker = L.marker([53.8997, 27.5667], { icon: customIcon }).addTo(map);

var popup = L.popup();
function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("Ты кликнул сюда " + e.latlng.toString())
    .openOn(map);
}
map.on("click", onMapClick);

btn.addEventListener("click", getData);
