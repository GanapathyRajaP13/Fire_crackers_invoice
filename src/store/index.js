import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import productReducer from "./slice";

const productPersistConfig = {
  key: "product",
  storage,
  whitelist: ["productList"],
};

const persistedProductReducer = persistReducer(
  productPersistConfig,
  productReducer
);

export const Store = configureStore({
  reducer: {
    product: persistedProductReducer,
  },
});

export const persistor = persistStore(Store);
