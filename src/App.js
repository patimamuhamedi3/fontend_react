import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { motion } from "framer-motion";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="bg-blue-900 min-h-screen text-blue-100">
        <header className="bg-blue-700 shadow-lg p-4">
          <nav className="flex justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div>
              <Link to="/" className="mr-4 hover:text-blue-300">
                Home
              </Link>
              <Link to="/items" className="mr-4 hover:text-blue-300">
                View Items
              </Link>
              <Link to="/orders" className="mr-4 hover:text-blue-300">
                Make Order
              </Link>
              <Link to="/payment" className="hover:text-blue-300">
                Payment
              </Link>
            </div>
          </nav>
        </header>

        <main className="p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<ViewItems />} />
            <Route path="/orders" element={<MakeOrder />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const Home = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center"
  >
    <h2 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h2>
    <p className="text-xl">
      Manage your items, orders, and payments effortlessly!
    </p>
  </motion.div>
);

const ViewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/items/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch items.");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading items...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.length > 0 ? (
        items.map((item) => (
          <Card key={item.id} className="bg-blue-800 text-blue-100">
            <CardContent>
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p>Category: {item.category}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Description: {item.description}</p>
              <Button className="mt-4 bg-blue-500 hover:bg-blue-600">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No items available.</p>
      )}
    </motion.div>
  );
};

const MakeOrder = () => {
  const [formData, setFormData] = useState({ item_id: "", quantity: "" });
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch the list of items
    fetch("http://127.0.0.1:8000/api/items/")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    

    // Send the item_id and quantity in the order request
    fetch("http://127.0.0.1:8000/api/orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to place order.");
        }
        return response.json();
      })
      .then(() => {
        setMessage("Order placed successfully!");
        setFormData({ item_id: "", quantity: "" }); // Reset the form
      })
      .catch(() => {
        setMessage("Error placing the order. Please try again.");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto bg-blue-800 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Make an Order</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Item:</label>
        <select
          name="item_id"
          value={formData.item_id}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded-md bg-blue-900 text-blue-100 border border-blue-500"
          required
        >
          <option value="">Select an item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.category}) - {item.quantity} available
            </option>
          ))}
        </select>

        <label className="block mb-2">Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded-md bg-blue-900 text-blue-100 border border-blue-500"
          placeholder="Enter quantity"
          required
        />

        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
          Place Order
        </Button>
      </form>
      {message && <p className="mt-4 text-center text-blue-300">{message}</p>}
    </motion.div>
  );
};


const Payment = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="max-w-xl mx-auto bg-blue-800 p-6 rounded-lg shadow-md"
  >
    <h2 className="text-2xl font-bold mb-4">Make a Payment</h2>
    <form>
      <label className="block mb-2">Order ID:</label>
      <input
        type="text"
        className="w-full p-2 mb-4 rounded-md bg-blue-900 text-blue-100 border border-blue-500"
        placeholder="Enter order ID"
      />

      <label className="block mb-2">Amount:</label>
      <input
        type="number"
        className="w-full p-2 mb-4 rounded-md bg-blue-900 text-blue-100 border border-blue-500"
        placeholder="Enter amount"
      />

      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
        Pay Now
      </Button>
    </form>
  </motion.div>
);

export default App;
