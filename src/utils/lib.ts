import axios from "axios";

class GeoLib {
  public async getAddressFromCoordinates(
    coordinates: [number, number] | { lat: number; lon: number }
  ): Promise<string> {
    try {
      let lat, lon;

      if (Array.isArray(coordinates)) {
        [lat, lon] = coordinates;
      } else {
        lat = coordinates.lat;
        lon = coordinates.lon;
      }

      const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
      const response = await axios.get(apiUrl);
      const address = response.data.display_name;
      return address;
    } catch (error) {
      console.error("Erro ao obter o endereço:", error);
      throw new Error("Erro ao obter o endereço");
    }
  }

  public async getCoordinatesFromAddress(
    address: string
  ): Promise<{ lat: number; lon: number }> {
    try {
      const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`;
      const response = await axios.get(apiUrl);

      if (response.data.length === 0) {
        throw new Error(
          "Nenhum resultado encontrado para o endereço fornecido"
        );
      }

      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } catch (error) {
      console.error("Erro ao obter as coordenadas:", error);
      throw new Error("Erro ao obter as coordenadas");
    }
  }
}

export default new GeoLib();
