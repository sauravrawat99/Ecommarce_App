import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import orderReducer from "./slices/orderSlice";
import paymentReducer from "./slices/paymentSlice";
import collectionReducer from "./slices/collectionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    collection: collectionReducer,
    category: categoryReducer,
    cart: cartReducer,
    wishList: wishlistReducer,
    order: orderReducer,
    payment: paymentReducer,
    admin: adminReducer,
  },
});
