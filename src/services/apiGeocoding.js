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
    const address = data.address || {};

    return {
      streetNumber: address.house_number || "",
      streetName: address.road || address.street || "",
      city:
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        "",
      postalCode: address.postcode || "",
      state: address.state || address.province || "",
      country: address.country || "",
      countryCode: address.country_code?.toUpperCase() || "",
      displayAddress: data.display_name || "",
      suburb: address.suburb || address.neighbourhood || "",
      county: address.county || "",
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    throw new Error("Unable to get address. Please enter manually.");
  }
}
