<template>
    <div class="weather-window bg-zinc-50/30 overflow-hidden flex-1">
        <!-- Header with location and time -->
        <div class="header p-4">
            <div class="flex justify-between items-center">
                <h1 class="text-xl font-bold">{{ location }}</h1>
                <div class="text-right">
                    <p class="text-lg">{{ formattedTime }}</p>
                    <p class="text-xs opacity-80">{{ formattedDate }}</p>
                </div>
            </div>
            <div class="mt-2 flex items-center">
                <input v-model="searchLocation" type="text" placeholder="Search location..."
                    class="flex-grow bg-zinc-50/80 rounded-lg px-4 py-1 outline-none" @keyup.enter="fetchWeather" />
                <button @click="fetchWeather" class="ml-2 cursor-pointer hover:bg-zinc-50/50 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="p-8 flex flex-col items-center justify-center">
            <div
                class="weather-loader w-16 h-16 border-4 border-zinc-400/50 border-t-transparent rounded-full animate-spin mb-4">
            </div>
            <p class="text-zinc-600 font-medium">Fetching weather data...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="p-4 flex flex-col items-center justify-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-xl font-bold mb-2">Error fetching weather data</p>
            <p class="text-center mb-4">{{ error }}</p>
            <button @click="fetchWeather"
                class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                Try Again
            </button>
        </div>

        <!-- Main weather display -->
        <div v-else-if="weatherData" class="weather-content px-4 pb-4">
            <!-- Current weather -->
            <div ref="currentWeather" class="current-weather bg-zinc-50/80 rounded-xl shadow-md px-6 py-4 mb-4">
                <div class="">
                    <div class="flex items-center">
                        <div class="text-4xl font-bold text-zinc-700">{{ currentTemp }}°</div>
                        <div class="ml-4">
                            <p class="text-lg text-zinc-800 font-semibold">{{ currentCondition }}</p>
                            <p class="text-zinc-500">Feels like {{ feelsLikeTemp }}°</p>
                        </div>
                    </div>
                    <div class="weather-icon">
                        <div class="text-6xl" :class="weatherIconClass"></div>
                    </div>
                </div>
            </div>

            <!-- Hourly forecast -->
            <div ref="hourlyForecast" class="hourly-forecast bg-zinc-50/80 rounded-xl shadow-lg px-6 py-4 mb-4">
                <h2 class="text-xl font-bold text-zinc-800 mb-4">Hourly Forecast</h2>
                <div class="flex overflow-x-auto pb-2">
                    <div v-for="(hour, index) in hourlyData" :key="index"
                        class="flex flex-col items-center pr-2 py-2 min-w-max">
                        <div class="text-gray-500 font-medium">{{ hour.time }}</div>
                        <div class="text-3xl my-2" :class="getWeatherIconClass(hour.weatherCode)"></div>
                        <div class="font-bold text-zinc-700">{{ hour.temp }}°</div>
                    </div>
                </div>
            </div>

            <!-- Daily forecast -->
            <div ref="dailyForecast" class="daily-forecast bg-zinc-50/80 rounded-xl shadow-lg px-6 py-4">
                <h2 class="text-xl font-bold text-zinc-800 mb-4">5-Day Forecast</h2>
                <div class="space-y-2">
                    <div v-for="(day, index) in dailyData" :key="index"
                        class="flex items-center justify-between py-2 border-b border-gray-100">
                        <div class="font-medium text-gray-700 w-24">{{ day.date }}</div>
                        <div class="flex items-center w-16 justify-center">
                            <div class="text-3xl" :class="getWeatherIconClass(day.weatherCode)"></div>
                        </div>
                        <div class="flex space-x-2">
                            <span class="text-gray-500">{{ day.minTemp }}°</span>
                            <span class="font-bold text-zinc-700">{{ day.maxTemp }}°</span>
                        </div>
                        <div class="text-gray-500 text-sm w-24 text-right">{{ day.condition }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import gsap from 'gsap';

interface WeatherData {
    current_condition: {
        temp_C: string;
        FeelsLikeC: string;
        humidity: string;
        windspeedKmph: string;
        pressure: string;
        weatherDesc: { value: string }[];
        weatherCode: string;
    }[];
    nearest_area: {
        areaName: { value: string }[];
        region: { value: string }[];
    }[];
    weather: {
        date: string;
        avgtempC: string;
        mintempC: string;
        maxtempC: string;
        hourly: {
            time: string;
            tempC: string;
            weatherDesc: { value: string }[];
            weatherCode: string;
        }[];
    }[];
}

// Reactive data
const weatherData = ref<WeatherData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const searchLocation = ref('');
const location = ref('Loading location...');

// Refs for GSAP animations
const currentWeather = ref<HTMLElement | null>(null);
const hourlyForecast = ref<HTMLElement | null>(null);
const dailyForecast = ref<HTMLElement | null>(null);

// Formatted date and time
const now = new Date();
const formattedDate = computed(() => {
    return now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

const formattedTime = computed(() => {
    return now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
});

// Computed properties for weather data
const currentTemp = computed(() => {
    return weatherData.value?.current_condition[0]?.temp_C || '--';
});

const feelsLikeTemp = computed(() => {
    return weatherData.value?.current_condition[0]?.FeelsLikeC || '--';
});

const currentCondition = computed(() => {
    return weatherData.value?.current_condition[0]?.weatherDesc[0]?.value || '--';
});

const weatherIconClass = computed(() => {
    return getWeatherIconClass(weatherData.value?.current_condition[0]?.weatherCode || '113');
});

// Process hourly forecast data
const hourlyData = computed(() => {
    if (!weatherData.value) return [];

    // Get today's hourly data
    const today = weatherData.value.weather[0].hourly;
    return today
        .filter((_, i) => i % 2 === 0) // Take every 2nd hour
        .map(hour => ({
            time: hour.time.padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2'),
            temp: hour.tempC,
            condition: hour.weatherDesc[0].value,
            weatherCode: hour.weatherCode
        }));
});

// Process daily forecast data
const dailyData = computed(() => {
    if (!weatherData.value) return [];

    return weatherData.value.weather.slice(0, 5).map(day => {
        const date = new Date(day.date);
        return {
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            minTemp: day.mintempC,
            maxTemp: day.maxtempC,
            condition: day.hourly[0].weatherDesc[0].value,
            weatherCode: day.hourly[0].weatherCode
        };
    });
});

// Weather icon mapping
const getWeatherIconClass = (code: string) => {
    const iconMap: Record<string, string> = {
        '113': 'i-carbon-sun text-yellow-400', // Sunny
        '116': 'i-carbon-partly-cloudy text-blue-300', // Partly Cloudy
        '119': 'i-carbon-cloudy text-gray-400', // Cloudy
        '122': 'i-carbon-cloudy text-gray-500', // Overcast
        '143': 'i-carbon-fog text-gray-300', // Fog
        '176': 'i-carbon-rain text-blue-400', // Patchy rain
        '179': 'i-carbon-snow text-blue-200', // Patchy snow
        '182': 'i-carbon-sleet text-blue-200', // Patchy sleet
        '185': 'i-carbon-sleet text-blue-200', // Patchy freezing drizzle
        '200': 'i-carbon-thunderstorm text-purple-500', // Thundery outbreaks
        '227': 'i-carbon-wind-power text-gray-400', // Blowing snow
        '230': 'i-carbon-snow text-blue-100', // Blizzard
        '248': 'i-carbon-fog text-gray-300', // Fog
        '260': 'i-carbon-fog text-gray-300', // Freezing fog
        '263': 'i-carbon-rain text-blue-300', // Light drizzle
        '266': 'i-carbon-rain text-blue-300', // Light drizzle
        '281': 'i-carbon-sleet text-blue-300', // Freezing drizzle
        '284': 'i-carbon-sleet text-blue-300', // Heavy freezing drizzle
        '293': 'i-carbon-rain text-blue-300', // Light rain
        '296': 'i-carbon-rain text-blue-400', // Light rain
        '299': 'i-carbon-rain-heavy text-blue-500', // Moderate rain
        '302': 'i-carbon-rain-heavy text-blue-600', // Heavy rain
        '305': 'i-carbon-rain-heavy text-blue-500', // Heavy rain
        '308': 'i-carbon-rain-heavy text-blue-600', // Heavy rain
        '311': 'i-carbon-sleet text-blue-300', // Light freezing rain
        '314': 'i-carbon-sleet text-blue-400', // Moderate/heavy freezing rain
        '317': 'i-carbon-sleet text-blue-400', // Light sleet
        '320': 'i-carbon-sleet text-blue-500', // Moderate/heavy sleet
        '323': 'i-carbon-snow text-blue-200', // Light snow
        '326': 'i-carbon-snow text-blue-200', // Light snow
        '329': 'i-carbon-snow text-blue-300', // Moderate snow
        '332': 'i-carbon-snow text-blue-300', // Heavy snow
        '335': 'i-carbon-snow-heavy text-blue-400', // Heavy snow
        '338': 'i-carbon-snow-heavy text-blue-400', // Heavy snow
        '350': 'i-carbon-hail text-blue-200', // Ice pellets
        '353': 'i-carbon-rain text-blue-300', // Light shower
        '356': 'i-carbon-rain-heavy text-blue-500', // Moderate/heavy shower
        '359': 'i-carbon-rain-heavy text-blue-600', // Torrential rain shower
        '362': 'i-carbon-sleet text-blue-300', // Light sleet shower
        '365': 'i-carbon-sleet text-blue-400', // Moderate/heavy sleet shower
        '368': 'i-carbon-snow text-blue-200', // Light snow shower
        '371': 'i-carbon-snow-heavy text-blue-400', // Moderate/heavy snow shower
        '374': 'i-carbon-hail text-blue-200', // Light shower of ice pellets
        '377': 'i-carbon-hail text-blue-300', // Moderate/heavy shower of ice pellets
        '386': 'i-carbon-thunderstorm text-purple-500', // Thunderstorm
        '389': 'i-carbon-thunderstorm text-purple-600', // Heavy thunderstorm
        '392': 'i-carbon-thunderstorm text-purple-500', // Patchy thunderstorm with snow
        '395': 'i-carbon-thunderstorm text-purple-600' // Heavy thunderstorm with snow
    };

    return iconMap[code] || 'i-carbon-unknown text-gray-400';
};

// Fetch weather data
const fetchWeather = async () => {
    loading.value = true;
    error.value = null;

    try {
        // Use user's location or default to Paris
        const locationParam = searchLocation.value || '';
        const response = await fetch(`https://wttr.in/${locationParam}?format=j1`);

        if (!response.ok) {
            throw new Error(`Weather data not available: ${response.status}`);
        }

        const data: WeatherData = await response.json();
        weatherData.value = data;

        // Set location name
        const area = data.nearest_area[0];
        location.value = `${area.areaName[0].value}, ${area.region[0].value}`;

        // Animate content in
        setTimeout(animateContent, 100);
    } catch (err) {
        error.value = (err as Error).message || 'Failed to fetch weather data';
        console.error('Weather API error:', err);
    } finally {
        loading.value = false;
    }
};

// Animate content with GSAP
const animateContent = () => {
    if (currentWeather.value && hourlyForecast.value && dailyForecast.value) {
        // Reset positions
        gsap.set([currentWeather.value, hourlyForecast.value, dailyForecast.value], {
            opacity: 0,
            y: 20
        });

        // Animate in sequence
        gsap.to(currentWeather.value, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        });

        gsap.to(hourlyForecast.value, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.2
        });

        gsap.to(dailyForecast.value, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.4
        });
    }
};

// Initial fetch on component mount
onMounted(() => {
    fetchWeather();
});
</script>

<style scoped>
</style>