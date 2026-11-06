import { useState } from "react";
import SectionHeader from "../../ui/SectionHeader";
import InputField from "../../ui/InputField";
import MainButton from "../../ui/MainButton";
import { MapPin } from "lucide-react";
import { fetchUserAddress } from "../users/userSlice";

const ShippingAddress = ({
  dispatch,
  addressStatus,
  addressComponents,
  isLoadingAddress,
  addressError,
  position,
}) => {
  // Controlled, so "Get My Address" can fill fields that are already on
  // screen. The previous uncontrolled `defaultValue`s were only read on
  // mount, so a geocoded address arriving later never appeared. Seeded from
  // any address already fetched this session.
  const [fields, setFields] = useState(() => ({
    address: addressComponents?.street || "",
    city: addressComponents?.city || "",
    zipCode: addressComponents?.postalCode || "",
    country: addressComponents?.country || "",
  }));
  const [isFilledFromLocation, setIsFilledFromLocation] = useState(false);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((current) => ({ ...current, [name]: value }));
  };

  const handleGetAddress = async () => {
    try {
      const { addressComponents: located } = await dispatch(
        fetchUserAddress(),
      ).unwrap();
      // Only overwrite with values the geocoder actually returned, so a
      // missing postcode (common) doesn't wipe one the shopper typed.
      setFields((current) => ({
        address: located.street || current.address,
        city: located.city || current.city,
        zipCode: located.postalCode || current.zipCode,
        country: located.country || current.country,
      }));
      setIsFilledFromLocation(true);
    } catch {
      // Rejection is already stored in the user slice and rendered below as
      // addressError — nothing extra to do here.
    }
  };

  return (
    <div className="bg-cream border border-stone p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <SectionHeader
          title="Shipping Address"
          icon={<MapPin className="w-6 h-6 mr-2 text-brass" aria-hidden="true" />}
        />

        {!position.latitude && !position.longitude && (
          <MainButton
            type="button"
            variant="outline"
            size="small"
            onClick={handleGetAddress}
            disabled={isLoadingAddress}
            loading={isLoadingAddress}
            content="Get My Address"
          />
        )}
      </div>

      <div className="space-y-4">
        {isFilledFromLocation && (
          <p role="status" className="text-sm text-taupe">
            Address filled from your location. Please check it before placing
            your order.
          </p>
        )}

        <InputField
          id="address"
          type="text"
          name="address"
          placeholder="123 Main Street"
          isRequired
          value={fields.address}
          onChange={handleFieldChange}
          hasLabel
          labelText="Street Address"
        />

        {addressStatus === "error" && (
          <p className="text-error text-sm">{addressError}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="city"
            type="text"
            name="city"
            placeholder="City"
            isRequired
            value={fields.city}
            onChange={handleFieldChange}
            hasLabel
            labelText="City"
          />
          <InputField
            id="zipCode"
            type="text"
            name="zipCode"
            placeholder="ZIP"
            isRequired
            value={fields.zipCode}
            onChange={handleFieldChange}
            hasLabel
            labelText="ZIP Code"
          />
        </div>

        <InputField
          id="country"
          type="text"
          name="country"
          placeholder="Country"
          isRequired
          value={fields.country}
          onChange={handleFieldChange}
          hasLabel
          labelText="Country"
        />
      </div>
    </div>
  );
};

export default ShippingAddress;
