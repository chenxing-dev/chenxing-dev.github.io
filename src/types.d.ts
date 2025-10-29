import type { Component } from 'vue';

export interface WindowPosition {
    x: number;
    y: number;
}

export interface WindowSize {
    width: number;
    height: number;
}

// Define window interface
export interface WindowItem {
    id: number;
    app: AppItem;
    position: WindowPosition;
    zIndex: number;
}

// Lightweight, storage-friendly snapshot (what we persist)
export interface StoredWindow {
    id: number;
    appId: string;
    position: WindowPosition;
    zIndex: number;
}

// Define app interface
export interface AppItem {
    id: string;
    title: string;
    size: WindowSize;
    mobileSize?: {
        height: number;
    };
}

export interface AppConfig {
    id: string; // Unique app type identifier
    label: string; // Icon label
    title: string; // Window title
    component: Component; // async component returned by defineAsyncComponent
    icon: Component; // async component returned by defineAsyncComponent
    width?: number;
    height?: number;
    mobileSize?: {
        height: number;
    };
    showOnDesktop: boolean; // Whether the app should be shown on the desktop
}

// Define the Repository interface
export interface Repository {
    id: number;
    name: string;
    description: string;
    topics: string[];
    html_url: string;
    homepage?: string | null;
    language?: string;
}


export interface WeatherData {
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

// Define the settings interface
export interface Settings {
    theme: string;
    background: string;
    clockFormat: "12h" | "24h";
}
