import { createSlice } from "@reduxjs/toolkit";
import { CrackersPriceList } from "../../crackersPriceList";

const initialState = {
  productList: CrackersPriceList,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    productUpdate: (state, action) => {
      state.productList = action.payload;
    },
  },
});

export const { productUpdate } = productSlice.actions;

export default productSlice.reducer;
