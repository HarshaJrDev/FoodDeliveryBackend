const axios = require("axios");

const ORS_API_KEY = process.env.ORS_API_KEY;
const BASE_URL = "https://api.openrouteservice.org/v2/directions/driving-car";

async function getRouteData(startCoords, endCoords) {
  try {
    const response = await axios.post(
      BASE_URL,
      {
        coordinates: [startCoords, endCoords]
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const { segments, geometry } = response.data.features[0].properties;
    const distance = segments[0].distance; // meters
    const duration = segments[0].duration; // seconds
    const polyline = response.data.features[0].geometry;

    return {
      distance,
      duration,
      polyline
    };
  } catch (err) {
    console.error("OpenRouteService error:", err.response?.data || err.message);
    return null;
  }
}

module.exports = getRouteData;
