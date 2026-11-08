import { useState } from "react";
import InputField from "../../ui/InputField";
import MainButton from "../../ui/MainButton";
import { fetchUserAddress } from "../users/userSlice";

const ShippingAddress = ({
  dispatch,
  addressStatus,
  addressComponents,
  isLoadingAddress,
  addressError,
  position,
  savedAddress = "",
  errors = {},
}) => {
  // Controlled, so "Get My Address" can fill fields that are already on
  // screen. The previous uncontrolled `defaultValue`s were only read on
  // mount, so a geocoded address arriving later never appeared. Seeded from
  // any address already fetched this session, else the Profile page's saved
  // address. That one is a single free-text line, so it goes into Street
  // Address as-is for the shopper to check.
  const [fields, setFields] = useState(() => ({
    address: addressComponents?.street || savedAddress,
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
    <section
      aria-labelledby="shipping-address-heading"
      className="bg-cream border border-stone p-6"
    >
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2
          id="shipping-address-heading"
          className="text-xs font-medium uppercase tracking-[0.2em] text-taupe"
        >
          Shipping address
        </h2>

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
          isRequired
          hideRequiredMark
          value={fields.address}
          onChange={handleFieldChange}
          hasLabel
          labelText="Street address"
          autoComplete="street-address"
          enterKeyHint="next"
          error={errors.address}
        />

        {addressStatus === "error" && (
          <p className="text-error text-sm">{addressError}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="city"
            type="text"
            name="city"
            isRequired
            hideRequiredMark
            value={fields.city}
            onChange={handleFieldChange}
            hasLabel
            labelText="City"
            autoComplete="address-level2"
            enterKeyHint="next"
            error={errors.city}
          />
          <InputField
            id="zipCode"
            type="text"
            name="zipCode"
            isRequired
            hideRequiredMark
            value={fields.zipCode}
            onChange={handleFieldChange}
            hasLabel
            labelText="Postcode"
            autoComplete="postal-code"
            enterKeyHint="next"
            error={errors.zipCode}
          />
        </div>

        <InputField
          id="country"
          type="text"
          name="country"
          isRequired
          hideRequiredMark
          value={fields.country}
          onChange={handleFieldChange}
          hasLabel
          labelText="Country"
          autoComplete="country-name"
          enterKeyHint="next"
          error={errors.country}
        />
      </div>
    </section>
  );
};

export default ShippingAddress;
