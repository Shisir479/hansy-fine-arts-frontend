'use client';

import { MdDeleteForever } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateQuantity, removeFromCart } from '@/lib/redux/slices/cartSlice';

const ProductCart: React.FC = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);

  const handleUpdateQuantity = (id: string, delta: number) => {
    const product = cart.find((item) => item._id === id);
    if (product) {
      const newQuantity = product.quantity + delta;
      if (newQuantity > 0) {
        dispatch(updateQuantity({ id, quantity: newQuantity }));
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="flex flex-col md:flex-row justify-between lg:p-6 gap-6">
      {/* Check if the cart is empty */}
      {cart.length === 0 ? (
        <div className="w-full text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">No Art is Selected</h2>
          <p className="text-gray-600">Your cart is currently empty.</p>
          <Link href="/shop" className="text-blue-500 text-sm underline">
            Browse Artworks
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="w-full md:w-3/5">
            <h2 className="text-xl font-semibold mb-4">SHOPPING CART</h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center border-b pb-4">
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={item.image}
                      alt={item.name || item.productTitle || 'Product Image'}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-lg font-medium">
                      {item.name || item.productTitle || 'Unknown'}
                    </p>
                    <p className="text-gray-600">
                      ${isNaN(item.price) ? '0.00' : Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => handleUpdateQuantity(item._id, -1)}
                    >
                      -
                    </button>
                    <p>{item.quantity || 1}</p>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => handleUpdateQuantity(item._id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="w-16 text-right">
                    $
                    {isNaN(item.price)
                      ? '0.00'
                      : (item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                  <button
                    className="ml-4 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    <MdDeleteForever size={24} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="w-full md:w-2/5 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">CART TOTALS</h2>
            <div className="flex justify-between mb-2">
              <p className="text-gray-600">TOTAL ITEMS:</p>
              <p className="font-medium">{totalItems}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">Shipping:</p>
              <p className="text-gray-800">
                Shipping to 123 Default St, Default City, DC
              </p>
              <button className="text-blue-500 text-sm underline">
                Change Address
              </button>
            </div>
            <div className="flex justify-between mb-6">
              <p className="text-gray-600">Total Price:</p>
              <p className="font-bold">${totalPrice}</p>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-slate-900 text-white py-2 rounded-lg font-medium text-center hover:bg-slate-800"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCart;
