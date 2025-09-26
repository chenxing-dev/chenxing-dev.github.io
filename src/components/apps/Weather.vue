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
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="text-xl font-bold mb-2">Error fetching weather data</p>
      <p class="text-center mb-4">{{ error }}</p>
      <button @click="fetchWeather" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Try
        Again</button>
    </div>

    <!-- Main weather display -->
    <div v-else-if="weatherData" class="weather-content px-4 pb-4">
      <!-- Current weather -->
      <div ref="currentWeather" class="current-weather bg-zinc-50/80 rounded-xl shadow-md px-6 py-4 mb-4">
        <div class="flex flex-row justify-between">
          <div class="flex items-center">
            <div class="text-4xl font-bold text-zinc-700">{{ currentTemp }}°</div>
            <div class="ml-4">
              <p class="text-lg text-zinc-800 font-semibold">{{ currentCondition }}</p>
              <p class="text-zinc-500">Feels like {{ feelsLikeTemp }}°</p>
            </div>
          </div>
          <div class="weather-icon w-16 h-16" v-html="getWeatherIcon(currentWeatherCode)"></div>
        </div>
      </div>

      <!-- Hourly forecast -->
      <div ref="hourlyForecast" class="hourly-forecast bg-zinc-50/80 rounded-xl shadow-lg px-6 py-4 mb-4">
        <h2 class="text-xl font-bold text-zinc-800 mb-4">Hourly Forecast</h2>
        <div class="flex overflow-x-auto pb-2">
          <div v-for="(hour, index) in hourlyData" :key="index" class="flex flex-col items-center pr-2 py-2 min-w-max">
            <div class="text-zinc-500 font-medium">{{ hour.time }}</div>
            <div class="hour-icon my-2 w-16 h-16" v-html="getWeatherIcon(hour.weatherCode)"></div>
            <div class="font-bold text-zinc-700">{{ hour.temp }}°</div>
          </div>
        </div>
      </div>

      <!-- Daily forecast -->
      <div ref="dailyForecast" class="daily-forecast bg-zinc-50/80 rounded-xl shadow-lg px-6 py-4">
        <h2 class="text-xl font-bold text-zinc-800 mb-4">3-Day Forecast</h2>
        <div class="space-y-1">
          <div v-for="(day, index) in dailyData" :key="index" class="flex items-center justify-between">
            <div class="font-medium text-zinc-700 w-24">{{ day.date }}</div>
            <div class="flex items-center w-16 justify-center">
              <div class="day-icon w-16 h-16" v-html="getWeatherIcon(day.weatherCode)"></div>
            </div>
            <div class="flex space-x-2">
              <span class="text-zinc-500">{{ day.minTemp }}°</span>
              <span class="font-bold text-zinc-700">{{ day.maxTemp }}°</span>
            </div>
            <div class="text-zinc-500 text-sm w-24 text-right">{{ day.condition }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import gsap from "gsap";

import type { WeatherData } from "@/types";

// Reactive data
const weatherData = ref<WeatherData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const searchLocation = ref("");
const location = ref("Loading location...");

// Refs for GSAP animations
const currentWeather = ref<HTMLElement | null>(null);
const hourlyForecast = ref<HTMLElement | null>(null);
const dailyForecast = ref<HTMLElement | null>(null);

// Formatted date and time
const now = new Date();
const formattedDate = computed(() => {
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
});

const formattedTime = computed(() => {
  return now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
});

// Computed properties for weather data
const currentTemp = computed(() => {
  return weatherData.value?.current_condition[0]?.temp_C || "--";
});

const feelsLikeTemp = computed(() => {
  return weatherData.value?.current_condition[0]?.FeelsLikeC || "--";
});

const currentCondition = computed(() => {
  return weatherData.value?.current_condition[0]?.weatherDesc[0]?.value || "--";
});

const currentWeatherCode = computed(() => {
  return weatherData.value?.current_condition[0]?.weatherCode || "--";
});

// Process hourly forecast data
const hourlyData = computed(() => {
  if (!weatherData.value) return [];

  // Get today's hourly data
  const today = weatherData.value.weather[0].hourly;
  return today
    .filter((_, i) => i % 2 === 0) // Take every 2nd hour
    .map(hour => ({
      time: hour.time.padStart(4, "0").replace(/(\d{2})(\d{2})/, "$1:$2"),
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
      date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      minTemp: day.mintempC,
      maxTemp: day.maxtempC,
      condition: day.hourly[0].weatherDesc[0].value,
      weatherCode: day.hourly[0].weatherCode
    };
  });
});

// Weather icon mapping to Meteocons animated icons
const getWeatherIcon = (code: string) => {
  const iconMap: Record<string, string> = {
    "113": sunnyIcon, // Sunny
    "116": partlyCloudyIcon, // Partly Cloudy
    "119": cloudyIcon, // Cloudy
    "122": overcastIcon, // Overcast
    "143": fogIcon, // Fog
    "176": rainIcon, // Patchy rain
    "179": snowIcon, // Patchy snow
    "182": sleetIcon, // Patchy sleet
    "185": freezingDrizzleIcon, // Patchy freezing drizzle
    "200": thunderIcon, // Thundery outbreaks
    "227": blowingSnowIcon, // Blowing snow
    "230": blizzardIcon, // Blizzard
    "248": fogIcon, // Fog
    "260": fogIcon, // Freezing fog
    "263": drizzleIcon, // Light drizzle
    "266": drizzleIcon, // Light drizzle
    "281": freezingDrizzleIcon, // Freezing drizzle
    "284": freezingDrizzleIcon, // Heavy freezing drizzle
    "293": rainIcon, // Light rain
    "296": rainIcon, // Light rain
    "299": rainIcon, // Moderate rain
    "302": heavyRainIcon, // Heavy rain
    "305": heavyRainIcon, // Heavy rain
    "308": heavyRainIcon, // Heavy rain
    "311": sleetIcon, // Light freezing rain
    "314": sleetIcon, // Moderate/heavy freezing rain
    "317": sleetIcon, // Light sleet
    "320": sleetIcon, // Moderate/heavy sleet
    "323": snowIcon, // Light snow
    "326": snowIcon, // Light snow
    "329": snowIcon, // Moderate snow
    "332": snowIcon, // Heavy snow
    "335": heavySnowIcon, // Heavy snow
    "338": heavySnowIcon, // Heavy snow
    "350": hailIcon, // Ice pellets
    "353": rainIcon, // Light shower
    "356": heavyRainIcon, // Moderate/heavy shower
    "359": heavyRainIcon, // Torrential rain shower
    "362": sleetIcon, // Light sleet shower
    "365": sleetIcon, // Moderate/heavy sleet shower
    "368": snowIcon, // Light snow shower
    "371": heavySnowIcon, // Moderate/heavy snow shower
    "374": hailIcon, // Light shower of ice pellets
    "377": hailIcon, // Moderate/heavy shower of ice pellets
    "386": thunderIcon, // Thunderstorm
    "389": thunderIcon, // Heavy thunderstorm
    "392": thunderSnowIcon, // Patchy thunderstorm with snow
    "395": thunderSnowIcon // Heavy thunderstorm with snow
  };

  return iconMap[code] || unknownIcon;
};

// Meteocons SVG icons (with animation)
const sunnyIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Icon from Meteocons by Bas Milius - https://github.com/basmilius/weather-icons/blob/dev/LICENSE --><defs><symbol id="meteoconsClearDay0" viewBox="0 0 375 375"><circle cx="187.5" cy="187.5" r="84" fill="none" stroke="#fbbf24" stroke-miterlimit="10" stroke-width="15"/><path fill="none" stroke="#fbbf24" stroke-linecap="round" stroke-miterlimit="10" stroke-width="15" d="M187.5 57.2V7.5m0 360v-49.7m92.2-222.5l35-35M60.3 314.7l35.1-35.1m0-184.4l-35-35m254.5 254.5l-35.1-35.1M57.2 187.5H7.5m360 0h-49.7"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 187.5 187.5; 45 187.5 187.5"/></path></symbol></defs><use width="375" height="375" href="#meteoconsClearDay0" transform="translate(68.5 68.5)"/></svg>
`;

const partlyCloudyIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Icon from Meteocons by Bas Milius - https://github.com/basmilius/weather-icons/blob/dev/LICENSE --><defs><symbol id="meteoconsPartlyCloudyDay0" viewBox="0 0 193 193"><circle cx="96.5" cy="96.5" r="40" fill="none" stroke="#fbbf24" stroke-miterlimit="10" stroke-width="9"/><path fill="none" stroke="#fbbf24" stroke-linecap="round" stroke-miterlimit="10" stroke-width="9" d="M96.5 29.9V4.5m0 184v-25.4m47.1-113.7l18-18M31.4 161.6l18-18m0-94.2l-18-18m130.2 130.2l-18-18M4.5 96.5h25.4m158.6 0h-25.4"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 96.5 96.5; 45 96.5 96.5"/></path></symbol><symbol id="meteoconsPartlyCloudyDay1" viewBox="0 0 359 231"><path fill="none" stroke="#a1a1aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="M295.5 223.5a56 56 0 0 0 0-112l-2.5.1a83.9 83.9 0 0 0-153-64.2a56 56 0 0 0-84.6 48.1a56.6 56.6 0 0 0 .8 9a60 60 0 0 0 11.2 119"/></symbol><symbol id="meteoconsPartlyCloudyDay2" viewBox="0 0 435.5 371.5"><g clip-path="url(#meteoconsPartlyCloudyDay3)"><use width="193" height="193" href="#meteoconsPartlyCloudyDay0" transform="translate(69.5 110.5)"/></g><use width="359" height="231" href="#meteoconsPartlyCloudyDay1" transform="translate(76.5 140.5)"/></symbol><clipPath id="meteoconsPartlyCloudyDay3"><path fill="none" d="M288 148a83.8 83.8 0 0 0-71.4 40a56 56 0 0 0-84.6 48a56.6 56.6 0 0 0 .8 9A60 60 0 0 0 84 304H0V0h288Z"/></clipPath></defs><use width="435.5" height="371.5" href="#meteoconsPartlyCloudyDay2"/></svg>
`;

const cloudyIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Icon from Meteocons by Bas Milius - https://github.com/basmilius/weather-icons/blob/dev/LICENSE --><defs><symbol id="meteoconsCloudy0" viewBox="0 0 359 231"><path fill="none" stroke="#a1a1aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="M295.5 223.5a56 56 0 0 0 0-112l-2.5.1a83.9 83.9 0 0 0-153-64.2a56 56 0 0 0-84.6 48.1a56.6 56.6 0 0 0 .8 9a60 60 0 0 0 11.2 119"/></symbol></defs><use width="359" height="231" href="#meteoconsCloudy0" transform="translate(76.5 140.5)"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="translate" values="-18 0; 18 0; -18 0"/></use></svg>
`;

const rainIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Icon from Meteocons by Bas Milius - https://github.com/basmilius/weather-icons/blob/dev/LICENSE --><defs><symbol id="meteoconsRain0" viewBox="0 0 359 231"><path fill="none" stroke="#a1a1aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="M295.5 223.5a56 56 0 0 0 0-112l-2.5.1a83.9 83.9 0 0 0-153-64.2a56 56 0 0 0-84.6 48.1a56.6 56.6 0 0 0 .8 9a60 60 0 0 0 11.2 119"/></symbol><symbol id="meteoconsRain1" viewBox="0 0 128 56"><path fill="#0a5ad4" d="M8 56a8 8 0 0 1-8-8V8a8 8 0 0 1 16 0v40a8 8 0 0 1-8 8Z" opacity="0"><animateTransform id="meteoconsRain2" additive="sum" attributeName="transform" begin="0s; x1.end+.33s" dur=".67s" repeatCount="indefinite" type="translate" values="0 -60; 0 60"/><animate id="meteoconsRain3" attributeName="opacity" begin="0s; y1.end+.33s" dur=".67s" repeatCount="indefinite" keyTimes="0; .25; 1" values="0; 1; 0"/></path><path fill="#0a5ad4" d="M64 56a8 8 0 0 1-8-8V8a8 8 0 0 1 16 0v40a8 8 0 0 1-8 8Z" opacity="0"><animateTransform id="meteoconsRain4" additive="sum" attributeName="transform" begin=".33s; x2.end+.33s" dur=".67s" repeatCount="indefinite" type="translate" values="0 -60; 0 60"/><animate id="meteoconsRain5" attributeName="opacity" begin=".33s; y2.end+.33s" dur=".67s" repeatCount="indefinite"  keyTimes="0; .25; 1" values="0; 1; 0"/></path><path fill="#0a5ad4" d="M120 56a8 8 0 0 1-8-8V8a8 8 0 0 1 16 0v40a8 8 0 0 1-8 8Z" opacity="0"><animateTransform id="meteoconsRain6" additive="sum" attributeName="transform" begin="-.33s; x3.end+.33s" dur=".67s" repeatCount="indefinite" type="translate" values="0 -30; 0 90"/><animate id="meteoconsRain7" attributeName="opacity" begin="-.33s; y3.end+.33s" dur=".67s" repeatCount="indefinite" keyTimes="0; .5; 1" values="0; 1; 0"/></path></symbol></defs><use width="359" height="231" href="#meteoconsRain0" transform="translate(76.5 140.5)"/><use width="128" height="56" href="#meteoconsRain1" transform="translate(192 344)"/></svg>
`;

const heavyRainIcon = `
  <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 512 512"><!-- Icon from Meteocons by Bas Milius - https://github.com/basmilius/weather-icons/blob/dev/LICENSE --><defs><symbol id="meteoconsExtremeRain0" viewBox="0 0 214.3 140.1"><path fill="none" stroke="#94a3b8" stroke-linejoin="round" stroke-width="15" d="M7.5 100.2a32.4 32.4 0 0 0 32.4 32.4h129.8v-.1l2.3.1a34.8 34.8 0 0 0 6.5-68.9a32.4 32.4 0 0 0-48.5-33a48.6 48.6 0 0 0-88.6 37.1h-1.5a32.4 32.4 0 0 0-32.4 32.4Z"/></symbol><symbol id="meteoconsExtremeRain1" viewBox="0 0 359 231"><path fill="none" stroke="#475569" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="M295.5 223.5a56 56 0 0 0 0-112l-2.5.1a83.9 83.9 0 0 0-153-64.2a56 56 0 0 0-84.6 48.1a56.6 56.6 0 0 0 .8 9a60 60 0 0 0 11.2 119"/></symbol><symbol id="meteoconsExtremeRain2" viewBox="0 0 447.7 371.5"><g clip-path="url(#meteoconsExtremeRaina)"><use width="214.3" height="140.1" href="#meteoconsExtremeRain0" transform="translate(195.51 165.01)"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="translate" values="-9 0; 9 0; -9 0"/></use></g><use width="359" height="231" href="#meteoconsExtremeRain1" transform="translate(0 140.5)"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="translate" values="-18 0; 18 0; -18 0"/></use></symbol><symbol id="meteoconsExtremeRain3" viewBox="0 0 128 56"><path fill="#0a5ad4" d="M8 56a8 8 0 0 1-8-8V8a8 8 0 0 1 16 0v40a8 8 0 0 1-8 8Z" opacity="0"><animateTransform id="meteoconsExtremeRain4" additive="sum" attributeName="transform" begin="0s; x1.end+.33s" dur=".67s" type="translate" values="0 -60; 0 60"/><animate id="meteoconsExtremeRain5" attributeName="opacity" begin="0s; y1.end+.33s" dur=".67s" keyTimes="0; .25; 1" values="0; 1; 0"/></path><path fill="#0a5ad4" d="M64 56a8 8 0 0 1-8-8V8a8 8 0 0 1 16 0v40a8 8 0 0 1-8 8Z" opacity="0"><animateTransform id="meteoconsExtremeRain6" additive="sum" attributeName="transform" begin=".33s; x2.end+.33s" dur=".67s" type="translate" values="0 -60; 0 60"/><animate id="meteoconsExtremeRain7" attributeName="opacity" begin=".33s; y2.end+.33s" dur=".67s" keyTimes="0; .25; 1" values="0; 1; 0"/></path><path fill="#0a5ad4" d="M120 56a8 8 0 0 1-8-8V8a8 8 0 0 1 16 0v40a8 8 0 0 1-8 8Z" opacity="0"><animateTransform id="meteoconsExtremeRain8" additive="sum" attributeName="transform" begin="-.33s; x3.end+.33s" dur=".67s" type="translate" values="0 -60; 0 60"/><animate id="meteoconsExtremeRain9" attributeName="opacity" begin="-.33s; y3.end+.33s" dur=".67s" keyTimes="0; .25; 1" values="0; 1; 0"/></path></symbol><clipPath id="meteoconsExtremeRaina"><path fill="none" d="M351.5 308a56 56 0 0 0-56-56l-2.5.1A83.7 83.7 0 0 0 211.5 148V0h236.2v308Z"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="translate" values="-18 0; 18 0; -18 0"/></path></clipPath></defs><use width="447.7" height="371.5" href="#meteoconsExtremeRain2" transform="translate(64.34)"/><use width="128" height="56" href="#meteoconsExtremeRain3" transform="translate(192 344)"/></svg>
`;

const thunderIcon = `
  <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 512 512"><!-- Icon from Meteocons by Bas Milius - https://github.com/basmilius/weather-icons/blob/dev/LICENSE --><defs><symbol id="meteoconsThunderstorms0" viewBox="0 0 359 231"><path fill="none" stroke="#a1a1aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="M295.5 223.5a56 56 0 0 0 0-112l-2.5.1a83.9 83.9 0 0 0-153-64.2a56 56 0 0 0-84.6 48.1a56.6 56.6 0 0 0 .8 9a60 60 0 0 0 11.2 119"/></symbol><symbol id="meteoconsThunderstorms1" viewBox="0 0 96 176"><path fill="#f6a823" d="M32 0L0 96h32l-16 80L96 64H48L80 0H32z"><animate id="meteoconsThunderstorms2" attributeName="opacity" begin="0s; x1.end+.67s" dur="1.33s" keyTimes="0; .38; .5; .63; .75; .86; .94; 1" values="1; 1; 0; 1; 0; 1; 0; 1"/></path></symbol></defs><use width="359" height="231" href="#meteoconsThunderstorms0" transform="translate(76.5 140.5)"/><use width="96" height="176" href="#meteoconsThunderstorms1" transform="translate(208 293)"/></svg>
`;

const snowIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Icon from Meteocons by Bas Milius - https://github.com/basmilius/weather-icons/blob/dev/LICENSE --><defs><symbol id="meteoconsSnow0" viewBox="0 0 359 231"><path fill="none" stroke="#a1a1aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="M295.5 223.5a56 56 0 0 0 0-112l-2.5.1a83.9 83.9 0 0 0-153-64.2a56 56 0 0 0-84.6 48.1a56.6 56.6 0 0 0 .8 9a60 60 0 0 0 11.2 119"/></symbol><symbol id="meteoconsSnow1" viewBox="0 0 155.2 48"><g><path fill="#86c3db" d="m41.2 30.5l-5.8-3.3a13.7 13.7 0 0 0 0-6.4l5.8-3.3a4 4 0 0 0 1.5-5.5a4 4 0 0 0-5.6-1.5l-5.8 3.3a13.6 13.6 0 0 0-2.6-2a13.8 13.8 0 0 0-3-1.2V4a4 4 0 0 0-8.1 0v6.6a14.3 14.3 0 0 0-5.7 3.2l-5.8-3.3A4 4 0 0 0 .5 12A4 4 0 0 0 2 17.5l5.8 3.3a13.7 13.7 0 0 0 0 6.4L2 30.5A4 4 0 0 0 .5 36a4 4 0 0 0 3.6 2a4 4 0 0 0 2-.5l5.8-3.3a13.6 13.6 0 0 0 2.6 2a13.8 13.8 0 0 0 3 1.2V44a4 4 0 0 0 8 0v-6.6a14.2 14.2 0 0 0 5.8-3.2l5.8 3.3a4 4 0 0 0 2 .5a4 4 0 0 0 3.5-2a4 4 0 0 0-1.4-5.5Zm-22.6-1.3a6 6 0 0 1-2.3-8.2a6.1 6.1 0 0 1 5.3-3a6.2 6.2 0 0 1 3 .8A6 6 0 0 1 27 27a6.1 6.1 0 0 1-8.3 2.2Z" opacity="0"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 24 24; 360 24 24"/><animate id="meteoconsSnow2" attributeName="opacity" begin="0s; t1.end+1s" dur="2s" repeatCount="indefinite"  keyTimes="0; .17; .83; 1" values="0; 1; 1; 0"/></path><animateTransform id="meteoconsSnow3" additive="sum" attributeName="transform" begin="0s; s1.end+1s" dur="2s" repeatCount="indefinite"  type="translate" values="0 -36; 0 92;"/></g><g><path fill="#86c3db" d="m97.2 30.5l-5.8-3.3a13.7 13.7 0 0 0 0-6.4l5.8-3.3a4 4 0 0 0 1.5-5.5a4 4 0 0 0-5.6-1.5l-5.8 3.3a13.6 13.6 0 0 0-2.6-2a13.8 13.8 0 0 0-3-1.2V4a4 4 0 0 0-8.1 0v6.6a14.3 14.3 0 0 0-5.7 3.2l-5.8-3.3a4 4 0 0 0-5.6 1.5a4 4 0 0 0 1.5 5.5l5.8 3.3a13.7 13.7 0 0 0 0 6.4L58 30.5a4 4 0 0 0-1.5 5.5a4 4 0 0 0 3.6 2a4 4 0 0 0 2-.5l5.8-3.3a13.6 13.6 0 0 0 2.6 2a13.8 13.8 0 0 0 3 1.2V44a4 4 0 0 0 8 0v-6.6a14.2 14.2 0 0 0 5.8-3.2l5.8 3.3a4 4 0 0 0 2 .5a4 4 0 0 0 3.5-2a4 4 0 0 0-1.4-5.5Zm-22.6-1.3a6 6 0 0 1-2.3-8.2a6.1 6.1 0 0 1 5.3-3a6.2 6.2 0 0 1 3 .8A6 6 0 0 1 83 27a6.1 6.1 0 0 1-8.3 2.2Z" opacity="0"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 80 24; 360 80 24"/><animate id="meteoconsSnow4" attributeName="opacity" begin="-.83s; t2.end+1s" dur="2s" repeatCount="indefinite" keyTimes="0; .17; .83; 1" values="0; 1; 1; 0"/></path><animateTransform id="meteoconsSnow5" additive="sum" attributeName="transform" begin="-.83s; s2.end+1s" dur="2s" repeatCount="indefinite"  type="translate" values="0 -36; 0 92;"/></g><g><path fill="#86c3db" d="m153.2 30.5l-5.8-3.3a13.7 13.7 0 0 0 0-6.4l5.8-3.3a4 4 0 0 0 1.5-5.5a4 4 0 0 0-5.6-1.5l-5.8 3.3a13.6 13.6 0 0 0-2.6-2a13.8 13.8 0 0 0-3-1.2V4a4 4 0 0 0-8.1 0v6.6a14.3 14.3 0 0 0-5.7 3.2l-5.8-3.3a4 4 0 0 0-5.6 1.5a4 4 0 0 0 1.5 5.5l5.8 3.3a13.7 13.7 0 0 0 0 6.4l-5.8 3.3a4 4 0 0 0-1.5 5.5a4 4 0 0 0 3.6 2a4 4 0 0 0 2-.5l5.8-3.3a13.6 13.6 0 0 0 2.6 2a13.8 13.8 0 0 0 3 1.2V44a4 4 0 0 0 8 0v-6.6a14.2 14.2 0 0 0 5.8-3.2l5.8 3.3a4 4 0 0 0 2 .5a4 4 0 0 0 3.5-2a4 4 0 0 0-1.4-5.5Zm-22.6-1.3a6 6 0 0 1-2.3-8.2a6.1 6.1 0 0 1 5.3-3a6.2 6.2 0 0 1 3 .8a6 6 0 0 1 2.2 8.2a6.1 6.1 0 0 1-8.2 2.2Z" opacity="0"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 136 24; 360 136 24"/><animate id="meteoconsSnow6" attributeName="opacity" begin=".83s; t3.end+1s" dur="2s" repeatCount="indefinite" keyTimes="0; .17; .83; 1" values="0; 1; 1; 0"/></path><animateTransform id="meteoconsSnow7" additive="sum" attributeName="transform" begin=".83s; s3.end+1s" dur="2s" repeatCount="indefinite" type="translate" values="0 -36; 0 92;"/></g></symbol></defs><use width="359" height="231" href="#meteoconsSnow0" transform="translate(76.5 140.5)"/><use width="155.2" height="48" href="#meteoconsSnow1" transform="translate(178.4 338)"/></svg>
`;

const fogIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Icon from Meteocons by Bas Milius - https://github.com/basmilius/weather-icons/blob/dev/LICENSE --><defs><symbol id="meteoconsFog0" viewBox="0 0 359 231"><path fill="none" stroke="#a1a1aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="M295.5 223.5a56 56 0 0 0 0-112l-2.5.1a83.9 83.9 0 0 0-153-64.2a56 56 0 0 0-84.6 48.1a56.6 56.6 0 0 0 .8 9a60 60 0 0 0 11.2 119"/></symbol><symbol id="meteoconsFog1" viewBox="0 0 258 66"><path fill="none" stroke="#a1a1aa" stroke-linecap="round" stroke-miterlimit="10" stroke-width="18" d="M9 57h240"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="translate" values="-24 0; 24 0; -24 0"/></path><path fill="none" stroke="#a1a1aa" stroke-linecap="round" stroke-miterlimit="10" stroke-width="18" d="M9 9h240"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="translate" values="24 0; -24 0; 24 0"/></path></symbol></defs><use width="359" height="231" href="#meteoconsFog0" transform="translate(76.5 140.5)"/><use width="258" height="66" href="#meteoconsFog1" transform="translate(127 405)"/></svg>
`;

const sleetIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Icon from Meteocons by Bas Milius - https://github.com/basmilius/weather-icons/blob/dev/LICENSE --><defs><symbol id="meteoconsSleet0" viewBox="0 0 359 231"><path fill="none" stroke="#a1a1aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="M295.5 223.5a56 56 0 0 0 0-112l-2.5.1a83.9 83.9 0 0 0-153-64.2a56 56 0 0 0-84.6 48.1a56.6 56.6 0 0 0 .8 9a60 60 0 0 0 11.2 119"/></symbol><symbol id="meteoconsSleet1" viewBox="0 0 155.2 48"><g><path fill="#86c3db" d="m41.2 30.5l-5.8-3.3a13.7 13.7 0 0 0 0-6.4l5.8-3.3a4 4 0 0 0 1.5-5.5a4 4 0 0 0-5.6-1.5l-5.8 3.3a13.6 13.6 0 0 0-2.6-2a13.8 13.8 0 0 0-3-1.2V4a4 4 0 0 0-8.1 0v6.6a14.3 14.3 0 0 0-5.7 3.2l-5.8-3.3A4 4 0 0 0 .5 12A4 4 0 0 0 2 17.5l5.8 3.3a13.7 13.7 0 0 0 0 6.4L2 30.5A4 4 0 0 0 .5 36a4 4 0 0 0 3.6 2a4 4 0 0 0 2-.5l5.8-3.3a13.6 13.6 0 0 0 2.6 2a13.8 13.8 0 0 0 3 1.2V44a4 4 0 0 0 8 0v-6.6a14.2 14.2 0 0 0 5.8-3.2l5.8 3.3a4 4 0 0 0 2 .5a4 4 0 0 0 3.5-2a4 4 0 0 0-1.4-5.5Zm-22.6-1.3a6 6 0 0 1-2.3-8.2a6.1 6.1 0 0 1 5.3-3a6.2 6.2 0 0 1 3 .8A6 6 0 0 1 27 27a6.1 6.1 0 0 1-8.3 2.2Z" opacity="0"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 24 24; 360 24 24"/><animate id="meteoconsSleet2" attributeName="opacity" begin="0s; t1.end+1s" dur="2s" repeatCount="indefinite" keyTimes="0; .17; .83; 1" values="0; 1; 1; 0"/></path><animateTransform id="meteoconsSleet3" additive="sum" attributeName="transform" begin="0s; s1.end+1s" dur="2s" repeatCount="indefinite" type="translate" values="0 -26; 0 102;"/></g><g><path fill="#86c3db" d="m97.2 30.5l-5.8-3.3a13.7 13.7 0 0 0 0-6.4l5.8-3.3a4 4 0 0 0 1.5-5.5a4 4 0 0 0-5.6-1.5l-5.8 3.3a13.6 13.6 0 0 0-2.6-2a13.8 13.8 0 0 0-3-1.2V4a4 4 0 0 0-8.1 0v6.6a14.3 14.3 0 0 0-5.7 3.2l-5.8-3.3a4 4 0 0 0-5.6 1.5a4 4 0 0 0 1.5 5.5l5.8 3.3a13.7 13.7 0 0 0 0 6.4L58 30.5a4 4 0 0 0-1.5 5.5a4 4 0 0 0 3.6 2a4 4 0 0 0 2-.5l5.8-3.3a13.6 13.6 0 0 0 2.6 2a13.8 13.8 0 0 0 3 1.2V44a4 4 0 0 0 8 0v-6.6a14.2 14.2 0 0 0 5.8-3.2l5.8 3.3a4 4 0 0 0 2 .5a4 4 0 0 0 3.5-2a4 4 0 0 0-1.4-5.5Zm-22.6-1.3a6 6 0 0 1-2.3-8.2a6.1 6.1 0 0 1 5.3-3a6.2 6.2 0 0 1 3 .8A6 6 0 0 1 83 27a6.1 6.1 0 0 1-8.3 2.2Z" opacity="0"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 80 24; 360 80 24"/><animate id="meteoconsSleet4" attributeName="opacity" begin="-.83s; t2.end+1s" dur="2s" repeatCount="indefinite" keyTimes="0; .17; .83; 1" values="0; 1; 1; 0"/></path><animateTransform id="meteoconsSleet5" additive="sum" attributeName="transform" begin="-.83s; s2.end+1s" dur="2s" repeatCount="indefinite" type="translate" values="0 -46; 0 82;"/></g><g><path fill="#86c3db" d="m153.2 30.5l-5.8-3.3a13.7 13.7 0 0 0 0-6.4l5.8-3.3a4 4 0 0 0 1.5-5.5a4 4 0 0 0-5.6-1.5l-5.8 3.3a13.6 13.6 0 0 0-2.6-2a13.8 13.8 0 0 0-3-1.2V4a4 4 0 0 0-8.1 0v6.6a14.3 14.3 0 0 0-5.7 3.2l-5.8-3.3a4 4 0 0 0-5.6 1.5a4 4 0 0 0 1.5 5.5l5.8 3.3a13.7 13.7 0 0 0 0 6.4l-5.8 3.3a4 4 0 0 0-1.5 5.5a4 4 0 0 0 3.6 2a4 4 0 0 0 2-.5l5.8-3.3a13.6 13.6 0 0 0 2.6 2a13.8 13.8 0 0 0 3 1.2V44a4 4 0 0 0 8 0v-6.6a14.2 14.2 0 0 0 5.8-3.2l5.8 3.3a4 4 0 0 0 2 .5a4 4 0 0 0 3.5-2a4 4 0 0 0-1.4-5.5Zm-22.6-1.3a6 6 0 0 1-2.3-8.2a6.1 6.1 0 0 1 5.3-3a6.2 6.2 0 0 1 3 .8a6 6 0 0 1 2.2 8.2a6.1 6.1 0 0 1-8.2 2.2Z" opacity="0"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 136 24; 360 136 24"/><animate id="meteoconsSleet6" attributeName="opacity" begin=".83s; t3.end+1s" dur="2s" repeatCount="indefinite" keyTimes="0; .17; .83; 1" values="0; 1; 1; 0"/></path><animateTransform id="meteoconsSleet7" additive="sum" attributeName="transform" begin=".83s; s3.end+1s" dur="3s" repeatCount="indefinite" type="translate" values="-10 -36; -10 92;"/></g></symbol><symbol id="meteoconsSleet8" viewBox="0 0 155.2 48"><use width="155.2" height="48" href="#meteoconsSleet1"/><path fill="#0a5ad4" d="M21.6 38a8 8 0 0 1-8-8V18a8 8 0 0 1 16 0v12a8 8 0 0 1-8 8Z" opacity="0"><animateTransform id="meteoconsSleet9" additive="sum" attributeName="transform" begin="0s; x1.end+1s" dur="1s" repeatCount="indefinite" keyTimes="0; .25; 1" type="translate" values="0 -32; 0 -32; 0 120;"/><animate id="meteoconsSleeta" attributeName="opacity" begin="0s; y1.end+1s" dur="1s" repeatCount="indefinite" keyTimes="0; .25; 1" values="0; 1; 0"/></path><path fill="#0a5ad4" d="M77.6 38a8 8 0 0 1-8-8V18a8 8 0 0 1 16 0v12a8 8 0 0 1-8 8Z" opacity="0"><animateTransform id="meteoconsSleetb" additive="sum" attributeName="transform" begin="1.34s; x2.end+1s" dur="1s" repeatCount="indefinite" keyTimes="0; .5; 1" type="translate" values="0 -32; 0 -32; 0 120;"/><animate id="meteoconsSleetc" attributeName="opacity" begin="1.34s; y2.end+1s" dur="1s" repeatCount="indefinite" keyTimes="0; .25; 1" values="0; 1; 0"/></path><path fill="#0a5ad4" d="M133.6 38a8 8 0 0 1-8-8V18a8 8 0 0 1 16 0v12a8 8 0 0 1-8 8Z" opacity="0"><animateTransform id="meteoconsSleetd" additive="sum" attributeName="transform" begin=".67s; x3.end+1s" dur="1s" repeatCount="indefinite" keyTimes="0; .25; 1" type="translate" values="0 -32; 0 -32; 0 120;"/><animate id="meteoconsSleete" attributeName="opacity" begin=".67s; y3.end+1s" dur="1s" repeatCount="indefinite" keyTimes="0; .25; 1" values="0; 1; 0"/></path></symbol></defs><use width="359" height="231" href="#meteoconsSleet0" transform="translate(76.5 140.5)"/><use width="155.2" height="48" href="#meteoconsSleet8" transform="translate(178.4 338)"/></svg>
`;

const hailIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Icon from Meteocons by Bas Milius - https://github.com/basmilius/weather-icons/blob/dev/LICENSE --><defs><symbol id="meteoconsHail0" viewBox="0 0 359 231"><path fill="none" stroke="#a1a1aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="M295.5 223.5a56 56 0 0 0 0-112l-2.5.1a83.9 83.9 0 0 0-153-64.2a56 56 0 0 0-84.6 48.1a56.6 56.6 0 0 0 .8 9a60 60 0 0 0 11.2 119"/></symbol><symbol id="meteoconsHail1" viewBox="0 0 136 24"><path fill="#86c3db" d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0Z" opacity="0"><animateTransform id="meteoconsHail2" additive="sum" attributeName="transform" begin="0s; x1.end+.42s" dur=".58s" repeatCount="indefinite" keyTimes="0; .71; 1" type="translate" values="0 -46; 0 86; -18 74"/><animate id="meteoconsHail3" attributeName="opacity" begin="0s; y1.end+.42s" dur=".58s" repeatCount="indefinite" keyTimes="0; .14; .71; 1" values="0; 1; 1; 0"/></path><path fill="#86c3db" d="M68 0a12 12 0 1 0 12 12A12 12 0 0 0 68 0Z" opacity="0"><animateTransform id="meteoconsHail4" additive="sum" attributeName="transform" begin=".67s; x2.end+.42s" dur=".58s" repeatCount="indefinite" keyTimes="0; .71; 1" type="translate" values="0 -46; 0 86; 0 74"/><animate id="meteoconsHail5" attributeName="opacity" begin=".67s; y2.end+.42s" dur="2s" repeatCount="indefinite" keyTimes="0; .24; .61; 1" values="0; 1; 1; 0"/></path><path fill="#86c3db" d="M124 0a12 12 0 1 0 12 12a12 12 0 0 0-12-12Z" opacity="0"><animateTransform id="meteoconsHail6" additive="sum" attributeName="transform" begin=".33s; x3.end+.42s" dur=".58s" repeatCount="indefinite" keyTimes="0; .71; 1" type="translate" values="0 -46; 0 86; 18 74"/><animate id="meteoconsHail7" attributeName="opacity" begin=".33s; y3.end+.42s" dur=".58s" repeatCount="indefinite" keyTimes="0; .14; .71; 1" values="0; 1; 1; 0"/></path></symbol></defs><use width="359" height="231" href="#meteoconsHail0" transform="translate(76.5 140.5)"/><use width="136" height="24" href="#meteoconsHail1" transform="translate(188 350)"/></svg>
`;

const overcastIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Icon from Meteocons by Bas Milius - https://github.com/basmilius/weather-icons/blob/dev/LICENSE --><defs><symbol id="meteoconsOvercast0" viewBox="0 0 214.3 140.1"><path fill="none" stroke="#94a3b8" stroke-linejoin="round" stroke-width="15" d="M7.5 100.2a32.4 32.4 0 0 0 32.4 32.4h129.8v-.1l2.3.1a34.8 34.8 0 0 0 6.5-68.9a32.4 32.4 0 0 0-48.5-33a48.6 48.6 0 0 0-88.6 37.1h-1.5a32.4 32.4 0 0 0-32.4 32.4Z"/></symbol><symbol id="meteoconsOvercast1" viewBox="0 0 359 231"><path fill="none" stroke="#a1a1aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="M295.5 223.5a56 56 0 0 0 0-112l-2.5.1a83.9 83.9 0 0 0-153-64.2a56 56 0 0 0-84.6 48.1a56.6 56.6 0 0 0 .8 9a60 60 0 0 0 11.2 119"/></symbol><symbol id="meteoconsOvercast2" viewBox="0 0 447.7 371.5"><g clip-path="url(#meteoconsOvercast3)"><use width="214.3" height="140.1" href="#meteoconsOvercast0" transform="translate(195.51 165.01)"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="translate" values="-9 0; 9 0; -9 0"/></use></g><use width="359" height="231" href="#meteoconsOvercast1" transform="translate(0 140.5)"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="translate" values="-18 0; 18 0; -18 0"/></use></symbol><clipPath id="meteoconsOvercast3"><path fill="none" d="M351.5 308a56 56 0 0 0-56-56l-2.5.1A83.7 83.7 0 0 0 211.5 148V0h236.2v308Z"><animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="translate" values="-18 0; 18 0; -18 0"/></path></clipPath></defs><use width="447.7" height="371.5" href="#meteoconsOvercast2" transform="translate(64.34)"/></svg>
`;

const unknownIcon = `
  <svg viewBox="0 0 24 24" class="weather-icon unknown">
  </svg>
`;

const freezingDrizzleIcon = sleetIcon;
const blowingSnowIcon = snowIcon;
const blizzardIcon = heavyRainIcon;
const drizzleIcon = rainIcon;
const thunderSnowIcon = thunderIcon;
const heavySnowIcon = snowIcon;

// Fetch weather data
const fetchWeather = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Use user's location or default to Paris
    const locationParam = searchLocation.value || "";
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
    error.value = (err as Error).message || "Failed to fetch weather data";
    console.error("Weather API error:", err);
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
      ease: "power2.out"
    });

    gsap.to(hourlyForecast.value, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.2
    });

    gsap.to(dailyForecast.value, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.4
    });
  }
};

// Initial fetch on component mount
onMounted(() => {
  fetchWeather();
});
</script>
