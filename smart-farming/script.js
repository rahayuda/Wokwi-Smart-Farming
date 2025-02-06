// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAp-xABc3sjcsLa2GFBEOlK0BmdP7BjC2U",
    authDomain: "wokwi-eea2f.firebaseapp.com",
    databaseURL: "https://wokwi-eea2f-default-rtdb.firebaseio.com",
    projectId: "wokwi-eea2f",
    storageBucket: "wokwi-eea2f.appspot.com",
    messagingSenderId: "126495132632",
    appId: "1:126495132632:web:bf9ed735696fdb72d200ad",
    measurementId: "G-E9RN7W9R08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Realtime Database and set up a reference
const db = getDatabase(app);
const sensorDataRef = ref(db, 'sensorData');

// Fungsi untuk mengkalibrasi nilai LDR ke dalam skala 0 - 100%
function calibrateLightIntensity(rawValue) {
    const minValue = 32;
    const maxValue = 4063;
    return ((rawValue - minValue) / (maxValue - minValue)) * 100;
}

// Read data from Firebase Realtime Database
onValue(sensorDataRef, (snapshot) => {
    const data = snapshot.val();
    const distance = data.distance;
    const humidity = data.humidity;
    const temperature = data.temperature;
    const rawLightIntensity = data.lightIntensity;

    // Kalibrasi nilai intensitas cahaya
    const lightIntensity = calibrateLightIntensity(rawLightIntensity).toFixed(2); // Dibulatkan 2 desimal

    // Update the sensor data output
    document.getElementById('distanceValue').innerHTML = `: ${distance} cm`;
    document.getElementById('humidityValue').innerHTML = `: ${humidity} %`;
    document.getElementById('temperatureValue').innerHTML = `: ${temperature} °C`;
    document.getElementById('lightIntensityValue').innerHTML = `: ${lightIntensity} %`;

    // Check conditions and display status
    const temperatureStatus = (temperature < 18) ? "Heater On" : (temperature > 30) ? "Cooler On" : "Good";
    const humidityStatus = (humidity < 30) ? "Watering On" : (humidity > 70) ? "Watering Off" : "Good";
    const distanceStatus = (distance < 5) ? "Alarm On" : "Alarm Off";
    const lightIntensityStatus = (lightIntensity > 50) ? "Day" : "Night"; // Sesuaikan threshold siang/malam

    // Update status values in the HTML
    document.getElementById('temperatureStatus').innerHTML = `: ${temperatureStatus}`;
    document.getElementById('humidityStatus').innerHTML = `: ${humidityStatus}`;
    document.getElementById('distanceStatus').innerHTML = `: ${distanceStatus}`;
    document.getElementById('lightIntensityStatus').innerHTML = `: ${lightIntensityStatus}`;
});