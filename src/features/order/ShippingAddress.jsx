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
            onClick={(e) => {
              e.preventDefault();
              dispatch(fetchUserAddress());
            }}
            disabled={isLoadingAddress}
            loading={isLoadingAddress}
            content="Get My Address"
          />
        )}
      </div>

      <div className="space-y-4">
        <InputField
          id="address"
          type="text"
          name="address"
          placeholder="123 Main Street"
          isRequired
          defaultValue={addressComponents?.street || ""}
          hasLabel
          labelText="Street Address"
        />

        {addressStatus === "error" && (
          <p className="text-red-500 text-sm">{addressError}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="city"
            type="text"
            name="city"
            placeholder="City"
            isRequired
            defaultValue={addressComponents?.city || ""}
            hasLabel
            labelText="City"
          />
          <InputField
            id="zipCode"
            type="text"
            name="zipCode"
            placeholder="ZIP"
            isRequired
            defaultValue={addressComponents?.postalCode || ""}
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
          defaultValue={addressComponents?.country || ""}
          hasLabel
          labelText="Country"
        />
      </div>
    </div>
  );
};

export default ShippingAddress;
