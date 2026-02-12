"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Search01Icon,
  PlusSignIcon,
  Delete02Icon,
  UserIcon,
  PackageIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "react-hot-toast";
// import {
//   searchProductsAction,
//   searchUsersAction,
//   createOrderAction,
// } from "@/lib/actions";

export default function CreateOrderModal({ isOpen, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [foundProducts, setFoundProducts] = useState([]);

  // Form State
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    phone: "",
    zipCode: "0000",
    country: "Bangladesh",
  });
  const [shippingPrice, setShippingPrice] = useState(100);

  // Calculations
  const itemsPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalPrice = itemsPrice + shippingPrice;

  // Search logic
  useEffect(() => {
    if (userQuery.length > 2) {
      // searchUsersAction(userQuery).then((res) => setFoundUsers(res.data || []));
    }
  }, [userQuery]);

  const handleAddProduct = (product: any) => {
    // Default to first available size
    const defaultSize =
      product.sizeStock?.find((s: any) => s.stock > 0)?.size || "N/A";

    const newItem = {
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      selectedSize: defaultSize,
      maxStock: product.sizeStock, // keep track to prevent over-ordering
    };
    setItems([...items, newItem]);
    setProductQuery("");
    setFoundProducts([]);
  };

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!selectedUser || items.length === 0 || !shippingAddress.phone) {
      return toast.error("Please fill in all required fields");
    }

    setLoading(true);
    try {
      //   const res = await createOrderAction({
      //     user: selectedUser._id,
      //     items,
      //     shippingAddress,
      //     shippingPrice,
      //     itemsPrice,
      //     totalPrice,
      //     paymentMethod: "cash",
      //     orderStatus: "pending",
      //   });
      //   if (res.success) {
      //     toast.success("Order created successfully");
      //     onSuccess();
      //     onClose();
      //   } else {
      //     toast.error(res.message);
      //   }
    } catch (error) {
      toast.error("Error creating order");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Create New Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Customer & Products */}
          <div className="space-y-6">
            {/* User Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">
                Customer Selection
              </label>
              {!selectedUser ? (
                <div className="relative">
                  <input
                    className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border-none"
                    placeholder="Search user by email or name..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                  />
                  {foundUsers.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white dark:bg-neutral-800 border rounded-xl shadow-lg z-10">
                      {foundUsers.map((u: any) => (
                        <div
                          key={u._id}
                          onClick={() => {
                            setSelectedUser(u);
                            setUserQuery("");
                            setFoundUsers([]);
                          }}
                          className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer text-sm"
                        >
                          {u.name} ({u.email})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon
                      icon={UserIcon}
                      size={20}
                      className="text-red-500"
                    />
                    <div>
                      <p className="font-bold text-sm">{selectedUser.name}</p>
                      <p className="text-xs text-neutral-500">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Product Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">Add Products</label>
              <div className="relative">
                <input
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border-none"
                  placeholder="Search products..."
                  onChange={async (e) => {
                    if (e.target.value.length > 2) {
                      // const res = await searchProductsAction(e.target.value);
                      // setFoundProducts(res.data || []);
                    }
                  }}
                />
                {foundProducts.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white dark:bg-neutral-800 border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    {foundProducts.map((p: any) => (
                      <div
                        key={p._id}
                        onClick={() => handleAddProduct(p)}
                        className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer flex items-center gap-3"
                      >
                        <img
                          src={p.images[0]}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="text-sm">
                          <p className="font-bold">{p.name}</p>
                          <p className="text-neutral-500">৳{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2 mt-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
                  >
                    <img
                      src={item.image}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{item.name}</p>
                      <div className="flex gap-2 items-center">
                        <select
                          className="text-xs bg-transparent border rounded p-1"
                          value={item.selectedSize}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].selectedSize = e.target.value;
                            setItems(newItems);
                          }}
                        >
                          {item.maxStock.map((s: any) => (
                            <option
                              key={s.size}
                              value={s.size}
                              disabled={s.stock <= 0}
                            >
                              {s.size} ({s.stock})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          className="w-12 text-xs bg-transparent border rounded p-1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].quantity = parseInt(e.target.value);
                            setItems(newItems);
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right mr-2">
                      <p className="text-sm font-bold">
                        ৳{item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Shipping & Totals */}
          <div className="space-y-6">
            <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <HugeiconsIcon icon={PackageIcon} size={20} /> Shipping Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Phone Number"
                  className="col-span-2 p-3 rounded-xl border dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-sm"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      phone: e.target.value,
                    })
                  }
                />
                <input
                  placeholder="Street Address/House"
                  className="col-span-2 p-3 rounded-xl border dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-sm"
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      street: e.target.value,
                    })
                  }
                />
                <input
                  placeholder="City"
                  className="p-3 rounded-xl border dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-sm"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                      state: e.target.value,
                    })
                  }
                />
                <input
                  placeholder="Shipping Cost"
                  type="number"
                  className="p-3 rounded-xl border dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-sm"
                  value={shippingPrice}
                  onChange={(e) =>
                    setShippingPrice(parseInt(e.target.value) || 0)
                  }
                />
              </div>
            </div>

            <div className="p-5 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>৳{itemsPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>৳{shippingPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>Total</span>
                <span className="text-red-600">৳{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Create Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
