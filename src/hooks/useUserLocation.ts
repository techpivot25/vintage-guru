import { useState, useEffect } from 'react';

export function useUserLocation() {
  const [city, setCity] = useState<string>('mumbai'); // Default fallback
  
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // 1. Try to get from user profile / local storage
        const profileCity = localStorage.getItem('userCity');
        if (profileCity) {
          setCity(profileCity.toLowerCase());
          return;
        }
        
        // 2. Try to use Geolocation API
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              // In a real app, you would use a Reverse Geocoding API here
              // For example: 
              // const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
              // const data = await response.json();
              // setCity(data.city.toLowerCase() || 'delhi');
              
              const detectedCity = 'delhi'; // Mocked decoded city
              setCity(detectedCity);
              localStorage.setItem('userCity', detectedCity);
            },
            (error) => {
              console.warn("Geolocation denied or failed", error);
            }
          );
        }
      } catch (err) {
        console.error("Location detection failed", err);
      }
    };
    
    fetchLocation();
  }, []);

  return city;
}
