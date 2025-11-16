import React, { useState, FormEvent, ChangeEvent } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Country, State, City, ICountry, IState, ICity } from "country-state-city";
import Swal from "sweetalert2";

// Shadcn/ui Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// --- 1. Define Component Props Interface ---
interface OrderFormProps {
  productSKU: string;
  productTitle: string;
  Price: number;
  onCancel: () => void; // To go back to the product view
}

// --- 2. Define Form Data Interface ---
interface IFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  address1: string;
  city: string;
  stateCode: string;
  zipPostalCode: string;
  countryCode: string;
  phone: string;
  productSKU: string;
  productTitle: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
  productSKU,
  productTitle,
  Price,
  onCancel,
}) => {
  // --- 3. State Definitions (Typed) ---
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState<boolean>(false);

  const [formData, setFormData] = useState<IFormData>({
    firstName: "",
    lastName: "",
    companyName: "",
    address1: "",
    city: "",
    stateCode: "",
    zipPostalCode: "",
    countryCode: "US", // Default to US
    phone: "",
    productSKU: productSKU || "",
    productTitle: productTitle || "",
  });

  // Location States
  const [countries] = useState<ICountry[]>(Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  // --- 4. Event Handlers ---

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Updated for shadcn/ui Select (passes value, not event)
  const handleCountryChange = (isoCode: string) => {
    const country = countries.find((c) => c.isoCode === isoCode);
    if (!country) return;

    setFormData({ ...formData, countryCode: country.isoCode, stateCode: "", city: "" });
    setStates(State.getStatesOfCountry(country.isoCode));
    setCities([]);
  };

  // Updated for shadcn/ui Select
  const handleStateChange = (isoCode: string) => {
    const state = states.find((s) => s.isoCode === isoCode);
    if (!state) return;

    setFormData({ ...formData, stateCode: state.isoCode, city: "" });
    setCities(
      City.getCitiesOfState(formData.countryCode, state.isoCode)
    );
  };

  // Updated for shadcn/ui Select
  const handleCityChange = (cityName: string) => {
    setFormData({ ...formData, city: cityName });
  };

  // API Submission Logic (Unchanged)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Guard clause to ensure payment was made
    if (!isPaymentSuccessful) {
      Swal.fire({
        title: "Payment Required",
        text: "Please complete the payment before submitting your order.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const orderData = {
      orders: [
        {
          order_po: `PO_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          recipient: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company_name: formData.companyName,
            address_1: formData.address1,
            city: formData.city,
            state_code: formData.stateCode,
            zip_postal_code: formData.zipPostalCode,
            country_code: formData.countryCode,
            phone: formData.phone,
            // ... (other null fields from your original code)
          },
          order_items: [
            {
              product_qty: 1,
              product_sku: formData.productSKU,
              product_title: formData.productTitle,
              // ... (other null fields)
            },
          ],
          shipping_code: "SD",
          test_mode: true,
        },
      ],
      validate_only: false,
    };

    console.log("Submitting Order Data:", orderData); // For debugging

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/submit-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "Order Confirmed!",
          text: "Your order has been successfully placed.",
          icon: "success",
          confirmButtonText: "OK",
        });
        // Reset form and payment status
        setFormData({
          firstName: "", lastName: "", companyName: "", address1: "",
          city: "", stateCode: "", zipPostalCode: "", countryCode: "US",
          phone: "", productSKU: "", productTitle: "",
        });
        setIsPaymentSuccessful(false);
      } else {
        Swal.fire({
          title: "Order Submission Failed",
          text: "There was an error confirming your order. Please try again.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while processing your order.",
        icon: "error",
        confirmButtonText: "Retry",
      });
      console.error("Order submission error:", err);
    }
  };

  // Form fields to be mapped
  const formFields = [
    { label: "First Name", name: "firstName", type: "text", required: true },
    { label: "Last Name", name: "lastName", type: "text", required: true },
    { label: "Company Name", name: "companyName", type: "text" },
    { label: "Address", name: "address1", type: "text", required: true },
    { label: "Zip Code", name: "zipPostalCode", type: "text", required: true },
    { label: "Phone", name: "phone", type: "text", required: true },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
      <h2 className="scroll-m-20 text-center text-2xl font-semibold tracking-tight mb-6">
        Complete Your Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Location Dropdowns --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={formData.countryCode}
              onValueChange={handleCountryChange}
              required
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={formData.stateCode}
              onValueChange={handleStateChange}
              disabled={states.length === 0}
              required
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={formData.city}
              onValueChange={handleCityChange}
              disabled={cities.length === 0}
              required
            >
              <SelectTrigger id="city">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- Mapped Text Inputs --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map(({ label, name, type, required }) => (
            <div className="space-y-2" key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input
                type={type}
                id={name}
                name={name}
                value={formData[name as keyof IFormData]} // Type assertion
                onChange={handleChange}
                required={required}
              />
            </div>
          ))}
        </div>

        {/* --- Read-only Product Info --- */}
        <div className="space-y-2">
          <Label htmlFor="productSKU">Product SKU</Label>
          <Input
            id="productSKU"
            name="productSKU"
            value={formData.productSKU}
            readOnly
            disabled
            className="bg-gray-100"
          />
        </div>

        {/* --- PayPal Buttons --- */}
        <div className="space-y-4 pt-4">
          <h3 className="font-semibold text-lg text-center">Payment</h3>
          {!isPaymentSuccessful ? (
            <PayPalScriptProvider
              options={{
                clientId: `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`,
                currency: "USD",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: Price.toFixed(2),
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order!.capture().then((details) => {
                    Swal.fire({
                      title: "Payment Successful!",
                      text: `Transaction completed by ${details.payer?.name?.given_name || 'customer'}`,
                      icon: "success",
                      confirmButtonText: "OK",
                    });
                    setIsPaymentSuccessful(true);
                  });
                }}
                onError={(err) => {
                  Swal.fire({
                    title: "Payment Error",
                    text: "An error occurred during the payment process.",
                    icon: "error",
                    confirmButtonText: "Retry",
                  });
                  console.error("PayPal Checkout onError:", err);
                }}
              />
            </PayPalScriptProvider>
          ) : (
            <Alert variant="success">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Received!</AlertTitle>
              <AlertDescription>
                Thank you. You can now submit your order.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* --- Form Action Buttons --- */}
        <div className="flex flex-col md:flex-row gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-auto"
            onClick={onCancel}
          >
            Back to Selection
          </Button>
          <Button
            type="submit"
            className="w-full"
            disabled={!isPaymentSuccessful}
          >
            {isPaymentSuccessful ? "Submit Order" : "Please Pay First"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;