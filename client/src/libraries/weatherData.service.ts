/**
 * @module
 * Custom type definitions for API data.
 * @version 1.0.0
 */

/**
 * Request object types
 */

interface LatLongResults {
  admin1: string,
  admin1_id: number,
  admin2: string,
  admin2_id: number,
  country: string,
  country_code: string,
  country_id: number,
  elevation: number,
  feature_code: string,
  id: number,
  latitude: number,
  longitude: number,
  name: string,
  population: number,
  timezone: string
}

export interface WeatherDataLatLong {
  generationtime_ms: number,
  results: LatLongResults[]
}

interface HourlyUnits {
  time: string,
  temperature_2m: string,
  precipitation_probability: string
}

interface Hourly {
  time: string[],
  temperature_2m: number[],
  precipitation_probability: (number | null)[]
}

export interface WeatherResponse {
  latitude: number,
  longitude: number,
  generationtime_ms: number,
  utc_offset_seconds: number,
  timezone: string,
  timezone_abbreviation: string,
  elevation: number,
  hourly_units: HourlyUnits,
  hourly: Hourly
}