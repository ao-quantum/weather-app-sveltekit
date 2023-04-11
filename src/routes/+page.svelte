<script lang="ts">
    const wmo: {
        [key: number]: string;
    } = {
        0: "Clear",
        1: "Partly Cloudy",
        2: "Partly Cloudy",
        3: "Partly Cloudy",
        45: "Fog",
        48: "Fog",
        51: "Drizzle",
        53: "Drizzle",
        55: "Drizzle",
        56: "Freezing Drizzle",
        57: "Freezing Drizzle",
        61: "Rain",
        63: "Rain",
        65: "Rain",
        66: "Freezing Rain",
        67: "Freezing Rain",
        71: "Snow",
        73: "Snow",
        75: "Snow",
        77: "Snow Grains",
        80: "Rain Showers",
        81: "Rain Showers",
        82: "Rain Showers",
        85: "Snow Showers",
        86: "Snow Showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with rain",
    }

    async function fetchCity(name: string, latitude: number, longitude: number) {
        const raw = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const data: {
            current_weather: {
                temperature: number;
                windspeed: number;
                winddirection: number;
                weathercode: number;
            }
        } = await raw.json();

        return {
            name: name,
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            winddirection: data.current_weather.winddirection,
            description: wmo[data.current_weather.weathercode] || '?'
        }
    }

    async function fetchWeather() {
        const weather: {
            name: string
            temperature: number;
            windspeed: number;
            winddirection: number
            description: string;
        }[] = [];

        const cities = [
            {
                name: "Los Angeles",
                latitude: 34.05,
                longitude: -118.24
            }, {
                name: "New York",
                latitude: 40.71,
                longitude: -74.01
            }, {
                name: "London",
                latitude: 51.51,
                longitude: -0.13

            }, {
                name: "Paris",
                latitude: 48.86,
                longitude: 2.35
            }, {
                name: "Tokyo",
                latitude: 35.68,
                longitude: 139.69
            }
        ];

        for (const city of cities) {
            const data = await fetchCity(city.name, city.latitude, city.longitude)

            weather.push(data);
        }

        return weather;
    }

    let addWeatherInput: HTMLInputElement | null = null;
    let table: HTMLTableSectionElement | null = null;

    async function addWeather(){
        const cityName = addWeatherInput?.value;
        
        const search = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
        const searchResult = await search.json();

        if (!searchResult.results || !searchResult.results.length) {
            alert("City not found");
            return;
        }
        if (!table) {
            return;
        }

        const city = searchResult.results[0];
        
        const data = await fetchCity(city.name, city.latitude, city.longitude);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.name}</td>
            <td>${data.temperature}°C</td>
            <td>${data.windspeed} km/h</td>
            <td>${data.description}</td>
        `;
        table.appendChild(row);

        addWeatherInput && (addWeatherInput.value = '');
    }
</script>

<style lang="scss">
    main {
        margin: 2rem;

        h1 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            border: 1px solid #ddd;

            th {
                text-align: left;
                padding: 0.5rem;
                border-bottom: 1px solid #ddd;
            }

            td {
                padding: 0.5rem;
                border-bottom: 1px solid #ddd;
            }
        }
    }
</style>

<main>
    <h1>Weather</h1>

    <p>Weather data provided by <a href="https://open-meteo.com/">Open-Meteo</a></p>

    <!-- Add input field for new weather log -->
    <form on:submit={addWeather}>
        <div class="form-group">
            <div class="input-group mb-3">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Add Weather"
                    aria-label="Add Weather"
                    aria-describedby="basic-addon1"
                    bind:this={addWeatherInput}
                >
                <button type="submit" class="btn btn-primary">Add</button>
            </div>
        </div>
    </form>


    <table class="table">
        <thead>
            <tr>
                <th>City</th>
                <th>Temperature</th>
                <th>Wind Speed</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody bind:this={table}>
            {#await fetchWeather()}
                <tr>
                    <td>Loading...</td>
                    <td>Loading...</td>
                    <td>Loading...</td>
                    <td>Loading...</td>
                </tr>
            {:then weather}
                {#each weather as { name, temperature, windspeed, description }}
                    <tr>
                        <td>{name}</td>
                        <td>{temperature}°C</td>
                        <td>{windspeed} km/h</td>
                        <td>{description}</td>
                    </tr>
                {/each}
            {/await}
        </tbody>
    </table>
</main>
