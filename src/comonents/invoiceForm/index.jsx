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
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { CrackersPriceList } from "../../crackersPriceList";

const InvoiceForm = ({ onSubmit }) => {
  const [clientName, setClientName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
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
    if (!address1) newErrors.address1 = "Address 1 is required";
    if (!address2) newErrors.address2 = "Address 2 is required";
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
      const cracker = CrackersPriceList.find((c) => c.id === item.selectedCracker);
      return {
        id: cracker.id,
        name: cracker.name,
        quantity: item.quantity,
        rate: cracker.rate,
      };
    });

    const formattedData = {
      clientDetails: {
        name: clientName,
        address1,
        address2,
        city,
        mobile: mobileNo,
        estimateNo,
        date: moment(estimateDate).format("DD/MM/YYYY"),
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

  const handleAddress1Change = (e) => {
    setAddress1(e.target.value);
    setErrors((prev) => ({ ...prev, address1: "" }));
  };

  const handleAddress2Change = (e) => {
    setAddress2(e.target.value);
    setErrors((prev) => ({ ...prev, address2: "" }));
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  const handleMobileNoChange = (e) => {
    setMobileNo(e.target.value);
    setErrors((prev) => ({ ...prev, mobileNo: "" }));
  };

  const handleEstimateNoChange = (e) => {
    setEstimateNo(e.target.value);
    setErrors((prev) => ({ ...prev, estimateNo: "" }));
  };

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  return (
    <Container sx={{ mt: 2, border: "1px solid #000" }}>
      <Box sx={{ padding: "20px", backgroundColor: "#adb4b9", mb: 2, mt: 2 }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Sivakasi Crackers Invoice Form
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <InputLabel>Client Name</InputLabel>
            <TextField
              placeholder="Client Name"
              value={clientName}
              onChange={handleClientNameChange}
              error={!!errors.clientName}
              helperText={errors.clientName}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Address 1</InputLabel>
            <TextField
              placeholder="Address 1"
              value={address1}
              onChange={handleAddress1Change}
              error={!!errors.address1}
              helperText={errors.address1}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Address 2</InputLabel>
            <TextField
              placeholder="Address 2"
              value={address2}
              onChange={handleAddress2Change}
              error={!!errors.address2}
              helperText={errors.address2}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>City</InputLabel>
            <TextField
              placeholder="City"
              value={city}
              onChange={handleCityChange}
              error={!!errors.city}
              helperText={errors.city}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Mobile No</InputLabel>
            <TextField
              placeholder="Mobile No"
              value={mobileNo}
              onChange={handleMobileNoChange}
              error={!!errors.mobileNo}
              helperText={errors.mobileNo}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <InputLabel htmlFor="estimate-date">Estimate Date</InputLabel>
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
            <InputLabel>Estimate No</InputLabel>
            <TextField
              placeholder="Estimate No"
              value={estimateNo}
              onChange={handleEstimateNoChange}
              error={!!errors.estimateNo}
              helperText={errors.estimateNo}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Discount (%)</InputLabel>
            <TextField
              placeholder="Discount"
              type="number"
              value={discount}
              onChange={handleDiscountChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} pt={2}>
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Cracker"
                        variant="outlined"
                        error={!!errors[`items.${index}.selectedCracker`]}
                        helperText={errors[`items.${index}.selectedCracker`]}
                      />
                    )}
                    value={
                      item.selectedCracker
                        ? CrackersPriceList.find((c) => c.id === item.selectedCracker) ||
                          null
                        : null
                    }
                    onChange={(event, newValue) => {
                      handleItemChange(
                        index,
                        "selectedCracker",
                        newValue ? newValue.id : ""
                      );
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={3}>
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
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    label="Rate"
                    value={
                      item.selectedCracker
                        ? CrackersPriceList.find((c) => c.id === item.selectedCracker)
                            ?.rate || ""
                        : ""
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRemoveItem(index)}
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
