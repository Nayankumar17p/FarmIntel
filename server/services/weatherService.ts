// server/services/weatherService.ts
// Modular weather service with live API adapter hook and high-fidelity local demo weather engine

export interface WeatherData {
  location: string;
  source: "live-api" | "demo-simulation";
  current: {
    tempC: number;
    condition: string;
    humidity: number;
    windKph: number;
    rainChancePercent: number;
    impactOnCrop: string;
  };
  forecast5Days: Array<{
    day: string;
    date: string;
    tempC: number;
    condition: string;
    rainProb: string;
  }>;
}

export interface IWeatherProvider {
  getWeather(district: string, state?: string): Promise<WeatherData>;
}

/**
 * Realistic local agro-weather simulator for Indian agricultural corridors (Bihar, UP, MP, Punjab, etc.)
 * Provides realistic seasonal variations, humidity, rainfall risks, and harvest/transit advisories
 * without requiring any paid API key.
 */
export class LocalDemoWeatherProvider implements IWeatherProvider {
  // District micro-climate baseline models
  private districtProfiles: Record<
    string,
    {
      baseTemp: number;
      baseHumidity: number;
      dominantCondition: string;
      transitRisk: string;
      baseRainChance?: number;
      baseWind?: number;
    }
  > = {
    patna: {
      baseTemp: 31,
      baseHumidity: 48,
      dominantCondition: "Clear & Sunny",
      transitRisk: "Optimal for field harvest and outdoor drying. Safe for open truck transport.",
      baseRainChance: 8,
      baseWind: 12,
    },
    muzaffarpur: {
      baseTemp: 29,
      baseHumidity: 58,
      dominantCondition: "Partly Cloudy",
      transitRisk: "Safe for transit. Keep tarpaulin sheet handy for high-moisture perishable produce.",
      baseRainChance: 22,
      baseWind: 14,
    },
    gaya: {
      baseTemp: 33,
      baseHumidity: 40,
      dominantCondition: "Dry & Sunny",
      transitRisk: "Very dry air. Excellent for grain transport and moisture stabilization.",
      baseRainChance: 5,
      baseWind: 10,
    },
    darbhanga: {
      baseTemp: 26,
      baseHumidity: 84,
      dominantCondition: "Thunderstorm & Rain Alert",
      transitRisk: "Heavy rain alert: Pause open-field harvesting immediately. Cover harvested grains with waterproof tarpaulin.",
      baseRainChance: 78,
      baseWind: 26,
    },
    purnia: {
      baseTemp: 27,
      baseHumidity: 78,
      dominantCondition: "Monsoon Showers & Overcast",
      transitRisk: "Rain warning: High moisture risk for wheat/maize. Expedite grain bagging into covered godown.",
      baseRainChance: 68,
      baseWind: 22,
    },
    katihar: {
      baseTemp: 28,
      baseHumidity: 72,
      dominantCondition: "Scattered Rain Alert",
      transitRisk: "Rain forecast in next 24-48 hours. Expedite mandi dispatch before road waterlogging.",
      baseRainChance: 55,
      baseWind: 18,
    },
    begusarai: {
      baseTemp: 30,
      baseHumidity: 52,
      dominantCondition: "Mild Breeze",
      transitRisk: "Favorable conditions for loading and mandi haulage.",
      baseRainChance: 15,
      baseWind: 11,
    },
    samastipur: {
      baseTemp: 29,
      baseHumidity: 55,
      dominantCondition: "Scattered Clouds",
      transitRisk: "Low rain probability (<15%). Road transit fully cleared.",
      baseRainChance: 14,
      baseWind: 13,
    },
    bhagalpur: {
      baseTemp: 31,
      baseHumidity: 50,
      dominantCondition: "Clear Skies",
      transitRisk: "Sunny and dry. Safe for tractor and open-bed mini truck transport.",
      baseRainChance: 10,
      baseWind: 12,
    },
    rohtas: {
      baseTemp: 32,
      baseHumidity: 42,
      dominantCondition: "Sunny & Warm",
      transitRisk: "Ideal harvesting and grain bagging climate.",
      baseRainChance: 5,
      baseWind: 9,
    },
    varanasi: {
      baseTemp: 32,
      baseHumidity: 46,
      dominantCondition: "Clear Sunlight",
      transitRisk: "Clear highway conditions across NH19 corridor.",
      baseRainChance: 7,
      baseWind: 11,
    },
  };

  async getWeather(district: string = "Patna", state: string = "Bihar"): Promise<WeatherData> {
    const key = district.trim().toLowerCase();
    const profile =
      this.districtProfiles[key] || {
        baseTemp: 30,
        baseHumidity: 50,
        dominantCondition: "Pleasant & Clear",
        transitRisk: "Optimal road conditions for agricultural logistics dispatch.",
        baseRainChance: 10,
        baseWind: 12,
      };

    const isRainAlertDistrict = (profile.baseRainChance ?? 10) >= 45;

    // Calculate dynamic 5-day agro forecast
    const days = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"];
    const now = new Date();

    const forecast5Days = days.map((dayLabel, index) => {
      const d = new Date(now.getTime() + index * 86400000);
      const dateStr = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      const tempDelta = (index % 2 === 0 ? 1 : -1) * (index % 3);

      let cond: string;
      let rainProbVal: number;

      if (isRainAlertDistrict) {
        // High rain profile
        const rainCurve = [profile.baseRainChance ?? 70, Math.max(20, (profile.baseRainChance ?? 70) - 15), 45, 25, 10];
        rainProbVal = rainCurve[index] ?? 20;
        const rainConditions = [profile.dominantCondition, "Scattered Showers", "Overcast & Damp", "Partly Cloudy", "Clear Skies"];
        cond = rainConditions[index % rainConditions.length];
      } else {
        // Dry / optimal profile
        const rainProbDelta = (index * 5) % 20;
        rainProbVal = Math.max(5, (profile.baseRainChance ?? 8) + rainProbDelta);
        const conditions = [profile.dominantCondition, "Clear Skies", "Mild Breeze", "Partly Cloudy", "Sunny"];
        cond = conditions[index % conditions.length];
      }

      return {
        day: dayLabel,
        date: dateStr,
        tempC: profile.baseTemp + tempDelta,
        condition: cond,
        rainProb: `${rainProbVal}%`,
      };
    });

    return {
      location: `${district}, ${state}`,
      source: "demo-simulation",
      current: {
        tempC: profile.baseTemp,
        condition: profile.dominantCondition,
        humidity: profile.baseHumidity,
        windKph: profile.baseWind ?? 12,
        rainChancePercent: profile.baseRainChance ?? 8,
        impactOnCrop: profile.transitRisk,
      },
      forecast5Days,
    };
  }
}

/**
 * Optional Live Weather Provider (e.g. OpenWeatherMap or WeatherAPI)
 * Automatically activates only if WEATHER_API_KEY is configured in .env
 */
export class ExternalApiWeatherProvider implements IWeatherProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getWeather(district: string, state: string = "Bihar"): Promise<WeatherData> {
    // Modular adapter: When WEATHER_API_KEY is supplied, connect to live API endpoint
    // If it fails or is invalid, gracefully fall back to local demo provider
    try {
      // Example endpoint: OpenWeatherMap Current + 5-day forecast
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        district
      )},IN&units=metric&appid=${this.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`External Weather API responded with HTTP ${res.status}`);
      }
      const data = await res.json();
      return {
        location: `${data.name || district}, ${state}`,
        source: "live-api",
        current: {
          tempC: Math.round(data.main?.temp ?? 30),
          condition: data.weather?.[0]?.description ?? "Clear",
          humidity: data.main?.humidity ?? 50,
          windKph: Math.round((data.wind?.speed ?? 3) * 3.6),
          rainChancePercent: data.rain ? 45 : 10,
          impactOnCrop:
            (data.main?.humidity ?? 50) > 80
              ? "High humidity: Cover produce with waterproof tarp during transit."
              : "Dry conditions: Safe for open truck transport.",
        },
        forecast5Days: new LocalDemoWeatherProvider()
          .getWeather(district, state)
          .then((r) => r.forecast5Days) as any,
      };
    } catch (err: any) {
      console.warn(`[WeatherService] Live API call failed (${err?.message}). Falling back to realistic local engine.`);
      const fallback = new LocalDemoWeatherProvider();
      return fallback.getWeather(district, state);
    }
  }
}

/**
 * Factory and Service Singleton
 */
class WeatherService {
  private provider: IWeatherProvider;
  public readonly isLiveApiConfigured: boolean;

  constructor() {
    const apiKey = process.env.WEATHER_API_KEY?.trim();
    if (apiKey) {
      this.provider = new ExternalApiWeatherProvider(apiKey);
      this.isLiveApiConfigured = true;
      console.log("🌦️ [WeatherService] Configured with live WEATHER_API_KEY adapter.");
    } else {
      this.provider = new LocalDemoWeatherProvider();
      this.isLiveApiConfigured = false;
      console.log("☀️ [WeatherService] WEATHER_API_KEY not provided. Using realistic local agro-weather demo engine.");
    }
  }

  async getAgroWeather(district: string = "Patna", state: string = "Bihar"): Promise<WeatherData> {
    return this.provider.getWeather(district, state);
  }
}

export const weatherService = new WeatherService();
