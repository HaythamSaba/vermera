import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const fetchUserAddress = createAsyncThunk(
  "user/fetchAddress",
  async () => {
    // Get user's GPS coordinates
    const position = await getPosition();
    const positionCoords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    // Get address from coordinates
    const addressData = await getAddress(positionCoords);

    // Format address string (for display)
    const streetAddress =
      `${addressData.streetNumber} ${addressData.streetName}`.trim();
    const fullAddress = `${streetAddress}, ${addressData.city}, ${addressData.state} ${addressData.postalCode}, ${addressData.country}`;

    // Return all the data
    return {
      position: positionCoords,
      address: fullAddress,
      addressComponents: {
        street: streetAddress || "",
        city: addressData.city || "",
        postalCode: addressData.postalCode || "",
        state: addressData.state || "",
        country: addressData.country || "",
      },
    };
  }
);

// Session-only state for checkout's "Get My Address" geolocation lookup.
// The shopper's name and saved details live in localStorage instead
// (profileStorage.js); the old in-memory `username` was retired with the
// /profile name prompt (audit decision C).
const initialState = {
  status: "idle",
  position: {
    latitude: 0,
    longitude: 0,
  },
  address: "",
  addressComponents: {
    street: "",
    city: "",
    postalCode: "",
    state: "",
    country: "",
  },
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchUserAddress.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchUserAddress.fulfilled, (state, action) => {
        state.status = "idle";
        state.position.latitude = action.payload.position.latitude;
        state.position.longitude = action.payload.position.longitude;
        state.address = action.payload.address;
        state.addressComponents = action.payload.addressComponents;
      })
      .addCase(fetchUserAddress.rejected, (state) => {
        state.status = "error";
        state.error =
          "There was an error fetching your address. make sure to fill in your address manually.";
      }),
});

export default userSlice.reducer;
