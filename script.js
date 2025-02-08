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

    // Tentukan apakah itu Day atau Night berdasarkan nilai light intensity
    const lightIntensityStatus = (lightIntensity > 50) ? "Day" : "Night";
    
    // Tentukan standar suhu dan kelembaban berdasarkan Day/Night
    let temperatureStatus, humidityStatus;

    if (lightIntensityStatus === "Day") {
        // Set ambang batas suhu dan kelembaban untuk siang
        temperatureStatus = (temperature < 20) ? "Heater On" : (temperature > 30) ? "Cooler On" : "Good";
        humidityStatus = (humidity < 40) ? "Watering On" : (humidity > 60) ? "Best" : "Good";
    } else {
        // Set ambang batas suhu dan kelembaban untuk malam
        temperatureStatus = (temperature < 15) ? "Heater On" : (temperature > 25) ? "Cooler On" : "Good";
        humidityStatus = (humidity < 50) ? "Watering On" : (humidity > 80) ? "Best" : "Good";
    }

    const distanceStatus = (distance < 30) ? "Alarm On" : "Alarm Off";

    // Update the sensor data output
    document.getElementById('temperatureValue').innerHTML = `${temperature} °C`;
    document.getElementById('distanceValue').innerHTML = `${distance} cm`;
    document.getElementById('humidityValue').innerHTML = `${humidity} %`;    
    document.getElementById('lightIntensityValue').innerHTML = `${lightIntensity} %`;

    // Update status values in the HTML
    document.getElementById('lightIntensityStatus').innerHTML = `${lightIntensityStatus}`;
    document.getElementById('temperatureStatus').innerHTML = `${temperatureStatus}`;
    document.getElementById('humidityStatus').innerHTML = `${humidityStatus}`;
    document.getElementById('distanceStatus').innerHTML = `${distanceStatus}`;

    // Ubah warna card berdasarkan status
    changeCardColor('temperature', temperatureStatus);
    changeCardColor('humidity', humidityStatus);
    changeCardColor('distance', distanceStatus);
    changeCardColor('lightIntensity', lightIntensityStatus);
});

// Fungsi untuk mengubah warna card
function changeCardColor(sensor, status) {
    const card = document.querySelector(`#${sensor}Status`).parentElement; // Ambil elemen card dari status

    // Mengubah warna berdasarkan status
    if (sensor === "temperature") {
        if (status === "Heater On") {
            card.style.backgroundColor = '#A72925'; 
            card.style.color = '#FFFFFF';
            const hr = card.querySelector('hr');
            if (hr) {
            hr.style.borderColor = '#FFFFFF';
            }  
        } else if (status === "Cooler On") { 
            card.style.backgroundColor = '#00BFFF';
            card.style.color = '#FFFFFF';
            const hr = card.querySelector('hr');
            if (hr) {
            hr.style.borderColor = '#FFFFFF';
            }          
        } else if (status === "Good") {
            card.style.backgroundColor = '#DCF2F1';
            card.style.color = '#0F1035';  
        }
    }
    else if (sensor === "humidity") {
        if (status === "Watering On") {
            card.style.backgroundColor = '#00BFFF'; 
            card.style.color = '#FFFFFF';
            const hr = card.querySelector('hr');
            if (hr) {
            hr.style.borderColor = '#FFFFFF';
            }            
        } else if (status === "Best") {
            card.style.backgroundColor = '#2C632C'; 
            card.style.color = '#FFFFFF';
            const hr = card.querySelector('hr');
            if (hr) {
            hr.style.borderColor = '#FFFFFF';
            }            
        } else if (status === "Good") {
            card.style.backgroundColor = '#DCF2F1';
            card.style.color = '#0F1035'; 
        }
    }
    else if (sensor === "distance") {
        if (status === "Alarm On") {
            card.style.backgroundColor = '#A72925'; 
            card.style.color = '#FFFFFF';
            const hr = card.querySelector('hr');
            if (hr) {
            hr.style.borderColor = '#FFFFFF';
            }
        } else {
            card.style.backgroundColor = '#DCF2F1';
            card.style.color = '#0F1035'; 
        }
    }
    else if (sensor === "lightIntensity") {
        if (status === "Day") {
            card.style.backgroundColor = '#DCF2F1';
            card.style.color = '#0F1035'; 
        } else if (status === "Night") {
            card.style.backgroundColor = '#000000';
            card.style.color = '#FFFFFF'; 
            const hr = card.querySelector('hr');
            if (hr) {
            hr.style.borderColor = '#FFFFFF';
            }
        }
    }
}

