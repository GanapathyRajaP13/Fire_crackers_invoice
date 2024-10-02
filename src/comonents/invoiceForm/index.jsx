import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Autocomplete,
  InputLabel,
  Box,
  Paper,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { CrackersPriceList } from "../../crackersPriceList";
import { inputFieldStyle } from "./style";
import background from "../../../public/Crackers.png";

const InvoiceForm = ({ onSubmit }) => {
  const [clientName, setClientName] = useState("");
  // const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [estimateDate, setEstimateDate] = useState(null);
  const [estimateNo, setEstimateNo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState([{ selectedCracker: "", quantity: 1 }]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!clientName) newErrors.clientName = "Client Name is required";
    // if (!address1) newErrors.address1 = "Address 1 is required";
    if (!city) newErrors.city = "City is required";
    if (!mobileNo.match(/^\d{10}$/))
      newErrors.mobileNo = "Mobile number must be 10 digits";
    if (!estimateDate) {
      newErrors.estimateDate = "Estimate Date is required";
      setEstimateDate("");
    }
    if (!estimateNo) newErrors.estimateNo = "Estimate Number is required";

    items.forEach((item, index) => {
      if (!item.selectedCracker) {
        newErrors[`items.${index}.selectedCracker`] =
          "Please select a cracker for all items";
      }
      if (item.quantity < 1) {
        newErrors[`items.${index}.quantity`] = "Quantity must be at least 1";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productDetails = items.map((item) => {
      const cracker = CrackersPriceList.find(
        (c) => c.id === item.selectedCracker
      );
      return {
        id: cracker.id,
        name: cracker.name,
        unit: cracker.unit,
        quantity: item.quantity,
        rate: cracker.rate,
      };
    });

    const formattedData = {
      clientDetails: {
        name: clientName,
        // address1,
        city,
        mobile: mobileNo,
        estimateNo,
        date: moment(estimateDate).format("DD-MM-YYYY"),
      },
      productDetails,
      discount,
    };

    onSubmit(formattedData, true);
  };

  const handleAddItem = () => {
    setItems([...items, { selectedCracker: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);

    const errorKey = `items.${index}.${field}`;
    setErrors((prev) => ({ ...prev, [errorKey]: "" }));
  };

  const handleClientNameChange = (e) => {
    setClientName(e.target.value);
    setErrors((prev) => ({ ...prev, clientName: "" }));
  };

  // const handleAddress1Change = (e) => {
  //   setAddress1(e.target.value);
  //   setErrors((prev) => ({ ...prev, address1: "" }));
  // };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  const handleMobileNoChange = (e) => {
    setMobileNo(e.target.value);
    setErrors((prev) => ({
      ...prev,
      mobileNo:
        e.target.value.length <= 10 ? "" : "Mobile number must be 10 digits",
    }));
  };

  const handleEstimateNoChange = (e) => {
    setEstimateNo(e.target.value);
    setErrors((prev) => ({ ...prev, estimateNo: "" }));
  };

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  return (
    <Container
      sx={{
        my: 6,
        borderRadius: "8px",
        bgcolor: "#eee",
        p: 2,
        boxShadow: "10px 10px 5px #cfcfcf",
      }}
    >
      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#adb4b9",
          mb: 2,
          mt: 2,
          backgroundImage: `url(${background})`,
          backgroundPosition: "right",
          backgroundRepeat: "no-repeat",
          borderRadius: "4px",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Sivakasi Crackers Invoice Form
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <InputLabel sx={{ ...inputFieldStyle.labelStyle }}>
              Client Name {<span>*</span>}
            </InputLabel>
            <TextField
              placeholder="enter name"
              value={clientName}
              onChange={handleClientNameChange}
              error={!!errors.clientName}
              fullWidth
              sx={{
                ...inputFieldStyle.textFieldSx,
              }}
            />
            {errors.clientName && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.clientName}
              </Typography>
            )}
          </Grid>

          {/* <Grid item xs={4}>
            <InputLabel sx={{ ...inputFieldStyle.labelStyle }}>
              Address {<span>*</span>}
            </InputLabel>
            <TextField
              placeholder="Address"
              value={address1}
              onChange={handleAddress1Change}
              error={!!errors.address1}
              fullWidth
              sx={{
                ...inputFieldStyle.textFieldSx,
              }}
            />
            {errors.address1 && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.address1}
              </Typography>
            )}
          </Grid> */}

          <Grid item xs={4}>
            <InputLabel sx={{ ...inputFieldStyle.labelStyle }}>
              City {<span>*</span>}
            </InputLabel>
            <TextField
              placeholder="enter city"
              value={city}
              onChange={handleCityChange}
              error={!!errors.city}
              fullWidth
              sx={{
                ...inputFieldStyle.textFieldSx,
              }}
            />
            {errors.city && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.city}
              </Typography>
            )}
          </Grid>

          <Grid item xs={4}>
            <InputLabel sx={{ ...inputFieldStyle.labelStyle }}>
              Mobile No {<span>*</span>}
            </InputLabel>
            <TextField
              placeholder="enter mobile"
              type="number"
              value={mobileNo}
              onChange={handleMobileNoChange}
              error={!!errors.mobileNo}
              fullWidth
              sx={{
                ...inputFieldStyle.textFieldSx,
                '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
                  {
                    "-webkit-appearance": "none",
                    margin: 0,
                  },
              }}
            />
            {errors.mobileNo && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.mobileNo}
              </Typography>
            )}
          </Grid>

          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <InputLabel
                htmlFor="estimate-date"
                sx={{ ...inputFieldStyle.labelStyle }}
              >
                Estimate Date {<span>*</span>}
              </InputLabel>
              <DatePicker
                id="estimate-date"
                value={estimateDate}
                onChange={(date) => {
                  setEstimateDate(date);
                  if (date) {
                    setErrors((prev) => ({ ...prev, estimateDate: "" }));
                  }
                }}
                fullWidth
                error={!!errors.estimateDate}
                sx={{
                  width: "100%",
                  ...inputFieldStyle.textFieldSx,
                }}
              />
              {errors.estimateDate && (
                <Typography color="error" sx={{ fontSize: "12px" }}>
                  {errors.estimateDate}
                </Typography>
              )}
            </LocalizationProvider>
          </Grid>

          <Grid item xs={4}>
            <InputLabel sx={{ ...inputFieldStyle.labelStyle }}>
              Estimate No {<span>*</span>}
            </InputLabel>
            <TextField
              placeholder="enter estimate no"
              type="number"
              value={estimateNo}
              onChange={handleEstimateNoChange}
              error={!!errors.estimateNo}
              fullWidth
              sx={{
                ...inputFieldStyle.textFieldSx,
                '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
                  {
                    "-webkit-appearance": "none",
                    margin: 0,
                  },
              }}
            />
            {errors.estimateNo && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.estimateNo}
              </Typography>
            )}
          </Grid>

          <Grid item xs={4}>
            <InputLabel sx={{ ...inputFieldStyle.labelStyle }}>
              Discount (%)
            </InputLabel>
            <TextField
              placeholder="enter discount"
              type="number"
              value={discount}
              onChange={handleDiscountChange}
              fullWidth
              sx={{
                ...inputFieldStyle.textFieldSx,
                '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
                  {
                    "-webkit-appearance": "none",
                    margin: 0,
                  },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={0} pt={2}>
              <Grid item xs={2}>
                <Typography variant="h6">Product Items</Typography>
              </Grid>
              <Grid item xs={2}>
                <Button
                  onClick={handleAddItem}
                  variant="contained"
                  color="primary"
                >
                  Add Item
                </Button>
              </Grid>
            </Grid>

            {items.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ marginTop: "2px" }}>
                <Grid item xs={4}>
                  <Autocomplete
                    options={CrackersPriceList}
                    getOptionLabel={(option) => option.name}
                    value={
                      item.selectedCracker
                        ? CrackersPriceList.find(
                            (c) => c.id === item.selectedCracker
                          ) || null
                        : null
                    }
                    onChange={(event, newValue) => {
                      handleItemChange(
                        index,
                        "selectedCracker",
                        newValue ? newValue.id : ""
                      );
                    }}
                    renderInput={(params) => (
                      <>
                        <TextField
                          {...params}
                          placeholder="Select Cracker"
                          variant="outlined"
                          error={!!errors[`items.${index}.selectedCracker`]}
                          InputLabelProps={{
                            shrink:
                              !!item.selectedCracker ||
                              !!params.inputProps.value,
                            sx: {
                              fontSize: "0.875rem",
                            },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              padding: "0px 8px",
                              fontSize: "0.875rem",
                              height: "40px",
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              padding: "0px",
                              fontSize: "0.875rem",
                              height: "40px",
                            },
                          }}
                        />

                        {!!errors[`items.${index}.selectedCracker`] && (
                          <Typography
                            color="error"
                            sx={{ fontSize: "12px", marginTop: "4px" }}
                          >
                            {errors[`items.${index}.selectedCracker`]
                              ?.message || "This field is required."}
                          </Typography>
                        )}
                      </>
                    )}
                    fullWidth
                    PaperComponent={({ children }) => (
                      <Paper
                        sx={{
                          maxHeight: 300,
                          overflow: "auto",
                          borderRadius: "8px",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        }}
                      >
                        {children}
                      </Paper>
                    )}
                    ListboxProps={{
                      sx: {
                        padding: 0,
                        "& .MuiAutocomplete-option": {
                          padding: "8px 12px",
                          fontSize: "0.875rem",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    fullWidth
                    error={!!errors[`items.${index}.quantity`]}
                    helperText={errors[`items.${index}.quantity`]}
                    sx={{
                      ...inputFieldStyle.textFieldSx,
                      '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
                        {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                    }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    label="Rate"
                    value={
                      item.selectedCracker
                        ? CrackersPriceList.find(
                            (c) => c.id === item.selectedCracker
                          )?.rate || ""
                        : 0
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    sx={{
                      ...inputFieldStyle.textFieldSx,
                    }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    label="Total"
                    value={
                      item.selectedCracker
                        ? CrackersPriceList.find(
                            (c) => c.id === item.selectedCracker
                          )?.rate * item.quantity || ""
                        : 0
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    sx={{
                      ...inputFieldStyle.textFieldSx,
                    }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRemoveItem(index)}
                    sx={{ fontWeight: "bold" }}
                    disabled={items.length === 1}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Grid>

          <Grid item xs={12} mb={2}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default InvoiceForm;
