export async function getAddress({ latitude, longitude }) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "FurnitureStore/1.0", // Required by Nominatim
        },
      }
    );

    if (!res.ok) throw Error("Failed getting address");

    const data = await res.json();

    // Extract address components
    const address = data.address || {};

    return {
      // Street information
      streetNumber: address.house_number || "",
      streetName: address.road || address.street || "",

      // City information
      city:
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        "",

      // Postal code
      postalCode: address.postcode || "",

      // State/Province
      state: address.state || address.province || "",

      // Country
      country: address.country || "",
      countryCode: address.country_code?.toUpperCase() || "",

      // Full formatted address
      displayAddress: data.display_name || "",

      // Additional useful fields
      suburb: address.suburb || address.neighbourhood || "",
      county: address.county || "",
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    throw new Error("Unable to get address. Please enter manually.");
  }
}
