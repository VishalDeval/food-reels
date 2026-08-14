import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = e.target.fullName.value;
    const contactName = e.target.contactName.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/foodPartner/register",
        {
          fullName,
          contactName,
          email,
          phone,
          address,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Registration Successful:", response.data);
      
      // Store token in localStorage for use in API requests
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      navigate("/create-food");
    } catch (error) {
      console.error(
        "Registration Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <span className="inline-block text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3">
          For Partners
        </span>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Register your business
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Partner with us to reach more customers
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Business Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Tasty Bites"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="contactName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Name
            </label>

            <input
              id="contactName"
              name="contactName"
              type="text"
              required
              placeholder="Jane Doe"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="business@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>

            <input
              id="address"
              name="address"
              type="text"
              required
              placeholder="123 Market Street"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already a partner?{" "}
          <a
            href="/food-partner/login"
            className="text-emerald-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;