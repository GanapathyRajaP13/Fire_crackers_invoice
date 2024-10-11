import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  InputLabel,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import background from "../../assets/Crackers.png";
import { CrackersPriceList } from "../../crackersPriceList";
import { inputFieldStyle } from "./style";

const InvoiceForm = ({ onSubmit, invoiceData }) => {
  const boxRef = useRef(null);
  const quantityRefs = useRef([]);
  const selectRef = useRef([]);
  const [clientName, setClientName] = useState(
    invoiceData?.clientDetails?.name ?? ""
  );
  const [city, setCity] = useState(invoiceData?.clientDetails?.city ?? "");
  const [mobileNo, setMobileNo] = useState(
    invoiceData?.clientDetails?.mobile ?? ""
  );
  const [estimateDate, setEstimateDate] = useState(
    invoiceData?.length === 0
      ? null
      : dayjs(invoiceData?.clientDetails?.date).toDate()
  );
  const [estimateNo, setEstimateNo] = useState(
    invoiceData?.clientDetails?.estimateNo ?? ""
  );
  const [discount, setDiscount] = useState(invoiceData?.discount ?? 0);
  const [items, setItems] = useState(
    invoiceData?.productDetails?.length > 0
      ? invoiceData?.productDetails?.map((item) => {
          return {
            selectedCracker: item.id,
            ...item,
          };
        })
      : [{ selectedCracker: "", quantity: 1 }]
  );
  const [errors, setErrors] = useState({});

  const [mobileNumbers, setMobileNumbers] = useState(
    invoiceData?.mobileNumbers ?? []
  );
  const [mobileNoSet, setMobileNoSet] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (mobileNumbers.length < 1)
      newErrors.mobileNumbers = "Add atleat one mobile number";
    if (!clientName) newErrors.clientName = "Client Name is required";
    if (!city) newErrors.city = "City is required";
    if (!mobileNo.match(/^\d{10}$/))
      newErrors.mobileNo = "Mobile number must be 10 digits";
    if (!estimateDate) {
      newErrors.estimateDate = "Estimate Date is required";
      setEstimateDate("");
    }
    items.forEach((item, index) => {
      if (!item.selectedCracker) {
        newErrors[`items.${index}.selectedCracker`] =
          "Please select a cracker for all items";
      }
      if (item.quantity < 1) {
        newErrors[`items.${index}.quantity`] = "Quantity must be at least 1";
      }
    });
    if (discount > 100) newErrors.discount = "Discount must be less than 100 %";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [items]);

  const clearForm = () => {
    localStorage.clear();
    onSubmit([], false);
    setClientName("");
    setCity("");
    setMobileNo("");
    setEstimateDate(null);
    setEstimateNo("");
    setDiscount(0);
    setItems([{ selectedCracker: "", quantity: 1 }]);
    setErrors({});
    quantityRefs.current = [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const productDetails = items
      .filter((product) => product.selectedCracker !== "")
      .map((item) => {
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
        city,
        mobile: mobileNo,
        estimateNo,
        date: dayjs(estimateDate).format("DD-MM-YYYY"),
      },
      productDetails,
      discount,
      mobileNumbers,
    };

    onSubmit(formattedData, true);
  };

  const handleAddItem = () => {
    const emptyRow = items.some((item) => item.selectedCracker === "");
    if (!emptyRow) {
      setItems((prevItems) => {
        const updatedItems = [
          ...prevItems,
          { selectedCracker: "", quantity: 1 },
        ];

        setTimeout(() => {
          const newIndex = updatedItems.length - 1;
          selectRef.current[newIndex]?.focus();
        }, 0);

        return updatedItems;
      });
    }
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
    quantityRefs.current[index]?.focus();
  };

  const handleClientNameChange = (e) => {
    setClientName(e.target.value);
    setErrors((prev) => ({ ...prev, clientName: "" }));
  };

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

  const handleSaveMobileSet = (value) => {
    setMobileNoSet(value);
    setErrors((prev) => ({
      ...prev,
      mobileNoSet: value.length <= 10 ? "" : "Mobile number must be 10 digits",
    }));
  };

  const handleEstimateNoChange = (e) => {
    setEstimateNo(e.target.value);
  };

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
    setErrors((prev) => ({
      ...prev,
      discount: e.target.value < 100 ? "" : "Discount must be less than 100 %",
    }));
  };

  const handleEnterSelect = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputValue = e.target.value;
      if (
        inputValue !== "" &&
        !isNaN(inputValue) &&
        inputValue > 0 &&
        inputValue <= CrackersPriceList.length
      ) {
        handleItemChange(index, "selectedCracker", Number(inputValue));
        quantityRefs.current[index]?.focus();
      }
    }
  };

  const handleEnterQuantity = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.value !== "" && handleAddItem();
    }
  };

  const handleEnterMobileSet = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddMobileNumber();
    }
  };

  const handleAddMobileNumber = () => {
    if (!mobileNoSet.match(/^\d{10}$/)) {
      setErrors((prev) => ({
        ...prev,
        mobileNoSet: "Mobile number must be 10 digits",
      }));
      return;
    }
    console.log(mobileNumbers.length, "lllllllllllllllll");
    if (mobileNumbers.length >= 5) {
      setErrors((prev) => ({
        ...prev,
        mobileNoSet: null,
        mobileNumbers: "You can only add up to 5 mobile numbers.",
      }));
      return;
    }

    setMobileNumbers([...mobileNumbers, mobileNoSet]);
    setMobileNoSet("");
    setErrors((prev) => ({
      ...prev,
      mobileNoSet: "",
      mobileNumbers: "",
    }));
  };

  const handleRemoveMobileNumber = (index) => {
    const newMobileNumbers = mobileNumbers.filter((_, i) => i !== index);
    setMobileNumbers(newMobileNumbers);
  };

  return (
    <Container
      sx={{
        mt: 2,
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
          mt: 1,
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
              placeholder="Enter name"
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

          <Grid item xs={4}>
            <InputLabel sx={{ ...inputFieldStyle.labelStyle }}>
              City {<span>*</span>}
            </InputLabel>
            <TextField
              placeholder="Enter city"
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
              placeholder="Enter mobile number"
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
                htmlFor="Estimate-date"
                sx={{ ...inputFieldStyle.labelStyle }}
              >
                Estimate Date {<span>*</span>}
              </InputLabel>
              <DatePicker
                format="dd/MM/yyyy"
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
              Estimate No
            </InputLabel>
            <TextField
              placeholder="Enter estimate no"
              type="number"
              value={estimateNo}
              onChange={handleEstimateNoChange}
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

          <Grid item xs={4}>
            <InputLabel sx={{ ...inputFieldStyle.labelStyle }}>
              Discount (%)
            </InputLabel>
            <TextField
              placeholder="Enter discount"
              type="number"
              value={discount}
              onChange={handleDiscountChange}
              error={!!errors.discount}
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
            {errors.discount && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.discount}
              </Typography>
            )}
          </Grid>

          <Grid item xs={3}>
            <InputLabel sx={{ ...inputFieldStyle.labelStyle }}>
              Add shop contact mobile {<span>*</span>}
            </InputLabel>
            <Tooltip title="Enter 10 digit mobile number and press enter" arrow>
              <TextField
                placeholder="Enter mobile number"
                type="number"
                value={mobileNoSet}
                onChange={(e) => handleSaveMobileSet(e.target.value)}
                onKeyDown={(e) => handleEnterMobileSet(e)}
                error={!!errors.mobileNoSet}
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
            </Tooltip>
            {(errors.mobileNoSet || errors.mobileNumbers) && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.mobileNoSet ?? errors.mobileNumbers}
              </Typography>
            )}
          </Grid>

          {/* Display the list of mobile numbers */}
          {mobileNumbers.length > 0 && (
            <Grid item xs={9}>
              <Typography sx={{ fontSize: "12px", color: "#5F5F5F" }}>
                Mobile Numbers:
              </Typography>
              <Box>
                {mobileNumbers.map((number, index) => (
                  <Chip
                    key={index}
                    label={number}
                    onDelete={() => handleRemoveMobileNumber(index)}
                    color="gray"
                    variant="outlined"
                    sx={{ marginBottom: "10px", marginRight: "10px" }}
                  />
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Grid container spacing={0} pt={2}>
              <Grid item xs={2}>
                <Typography variant="h6">Product Items</Typography>
              </Grid>
            </Grid>

            <Box
              ref={boxRef}
              sx={{
                maxHeight: "200px",
                overflowY: "auto",
                overflowX: "hidden",
                border: "1px solid black",
                p: 1,
                boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                borderRadius: "8px",
                scrollBehavior: "smooth",
              }}
            >
              {items.map((item, index) => (
                <Grid
                  container
                  spacing={1}
                  key={index}
                  sx={{ marginTop: "2px" }}
                >
                  <Grid item xs={2}>
                    <Autocomplete
                      options={CrackersPriceList}
                      getOptionLabel={(option) => option.id.toString()}
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
                      onKeyDown={(e) => handleEnterSelect(e, index)}
                      renderInput={(params) => (
                        <>
                          <TextField
                            {...params}
                            placeholder="Id"
                            variant="outlined"
                            inputRef={(el) => (selectRef.current[index] = el)}
                            InputLabelProps={{
                              shrink:
                                !!item.selectedCracker ||
                                !!params.inputProps.value,
                              sx: { fontSize: "0.875rem" },
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

                  <Grid item xs={3}>
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
                      onKeyDown={(e) => handleEnterSelect(e, index)}
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
                              sx: { fontSize: "0.875rem" },
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
                              {errors[`items.${index}.selectedCracker`] ||
                                "This field is required."}
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
                      inputRef={(el) => (quantityRefs.current[index] = el)}
                      onKeyDown={(e) => handleEnterQuantity(e)}
                      fullWidth
                      error={!!errors[`items.${index}.quantity`]}
                      sx={{
                        ...inputFieldStyle.textFieldSx,
                        '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
                          {
                            "-webkit-appearance": "none",
                            margin: 0,
                          },
                      }}
                    />
                    {!!errors[`items.${index}.quantity`] && (
                      <Typography
                        color="error"
                        sx={{ fontSize: "12px", marginTop: "4px" }}
                      >
                        {errors[`items.${index}.quantity`] ||
                          "This field is required."}
                      </Typography>
                    )}
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

                  <Grid item xs={1}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleRemoveItem(index)}
                      sx={{ fontWeight: "bold", width: "80px" }}
                      disabled={items.length === 1}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Grid>

          <Grid item xs={1}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={clearForm}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default InvoiceForm;
