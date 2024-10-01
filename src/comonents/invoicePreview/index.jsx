import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./style.css";
import moment from "moment";

const InvoicePreview = ({ invoiceData, handleBack }) => {
  const componentRef = useRef(null);

  const [discountedRate, setDiscountedRate] = useState(0);
  const [total, setTotal] = useState(0);

  const getAmount = (qnty, amount) => {
    return Number(qnty) * Number(amount);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const { productDetails, discount } = invoiceData;
    const totalBeforeDiscount = productDetails.reduce((total, product) => {
      const itemTotal = product.rate * product.quantity;
      return total + itemTotal;
    }, 0);

    const discountAmount = (totalBeforeDiscount * discount) / 100;

    const finalTotal = totalBeforeDiscount - discountAmount;
    setDiscountedRate(Number(Math.floor(finalTotal)).toFixed(2));
    setTotal(totalBeforeDiscount);
  }, [invoiceData]);

  const handleDownloadPDF = () => {
    const input = componentRef.current;
    html2canvas(input, { scale: 3 }).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight() + 20;
      const imgData = canvas.toDataURL("image/jpeg", 2);
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      const topMargin = 20;
      let pageNumber = 1;

      const addFooter = () => {
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(`Page ${pageNumber}`, pdfWidth - 20, pdfHeight - 30);
        pageNumber += 1;
      };
      addFooter();

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + topMargin;
        pdf.addPage();
        addFooter();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${clientDetails?.name}.pdf`);
    });
  };

  const { clientDetails, productDetails, discount } = invoiceData;

  const numberToWords = (num) => {
    if (num === 0) return "zero";

    const belowTwenty = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    let words = "";
    if (num >= 1000) {
      words += belowTwenty[Math.floor(num / 1000)] + " thousand ";
      num %= 1000;
    }
    if (num >= 100) {
      words += belowTwenty[Math.floor(num / 100)] + " hundred ";
      num %= 100;
    }
    if (num >= 20) {
      words += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    }
    if (num > 0) {
      words += belowTwenty[num] + " ";
    }

    return words.trim();
  };

  const numberInWords = `${numberToWords(discountedRate)} only`;

  return (
    <Box p={4}>
      <Grid container spacing={2} justifyContent="flex-end" mb={2}>
        <Grid item>
          <Button variant="outlined" color="primary" onClick={handleBack}>
            Back
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
        </Grid>
      </Grid>

      <Box
        ref={componentRef}
        sx={{
          padding: "20px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              border: "1px solid #000",
              backgroundColor: "#f5f5f5",
              borderBottom: "none",
              textAlign: "center",
            }}
          >
            ESTIMATE
          </Typography>
          <Box p={2} sx={{ border: "1px solid #000", textAlign: "center" }}>
            <Typography>
              <strong>SIVAKASI CRACKERS</strong>
            </Typography>
            <Typography>
              <strong>77Z/1, GANDHI ROAD</strong>
            </Typography>
            <Typography>
              <strong>NEAR SATHYA MOBILES</strong>
            </Typography>
            <Typography>
              <strong>SIVAKASI</strong>
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={3}>
                <Typography>
                  <strong>Phone No:</strong> 9486496298
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  <strong>Mobile No:</strong> 78119 71270
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #000",
            borderTop: "none",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #000",
              p: 1,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: "bold" }}>
                  Client Details:
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>
                  Agent Name:{" "}
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Direct
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: "bold", paddingLeft: "18px" }}>
                  Estimate Details:
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box p={2}>
            <Grid container alignItems="stretch" spacing={2}>
              <Grid item xs={8}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography>
                      <strong>Client Name</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography>:{clientDetails?.name}</Typography>
                  </Grid>

                  {/* <Grid item xs={3}>
                    <Typography>
                      <strong>Address 1</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography>:{clientDetails?.address1}</Typography>
                  </Grid> */}

                  <Grid item xs={3}>
                    <Typography>
                      <strong>City</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography>:{clientDetails?.city}</Typography>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>
                      <strong>Mobile</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography>:{clientDetails?.mobile}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Divider
                  orientation="vertical"
                  sx={{ height: "100%", borderWidth: 2 }}
                />
              </Grid>

              <Grid item xs={3}>
                <Grid container spacing={1}>
                  {/* Estimate Date */}
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Estimate Date:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {moment(clientDetails?.date).format("DD/MM/YYYY")}
                    </Typography>
                  </Grid>

                  {/* Estimate No */}
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Estimate No:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{clientDetails?.estimateNo}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid #000",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "1px solid #000",
                  }}
                >
                  S.No
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "1px solid #000",
                  }}
                >
                  Product Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "1px solid #000",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "1px solid #000",
                  }}
                >
                  Rate
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "1px solid #000",
                  }}
                >
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productDetails?.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell
                    sx={{ border: "1px solid #000", textAlign: "center" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #000" }}>
                    {product.name}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #000", textAlign: "right" }}
                  >
                    {product.quantity}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #000", textAlign: "right" }}
                  >
                    {product.rate.toFixed(2)}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #000", textAlign: "right" }}
                  >
                    {getAmount(product.quantity, product.rate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #000",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography>
                <strong>
                  Goods once Sold Can't be Taken Back (or) Exchanged.
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderLeft: "1px solid #000",
                          borderBottom: "none",
                        }}
                      >
                        <strong>Goods Value:</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                        }}
                      ></TableCell>
                      <TableCell align="right" sx={{ borderBottom: "none" }}>
                        <strong>₹{total.toFixed(2)}</strong>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                          borderLeft: "1px solid #000",
                        }}
                      >
                        <strong>Discount %</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                        }}
                      >
                        <strong>{Number(discount).toFixed(2)}</strong>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: "none" }}>
                        ₹{discountedRate}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                          borderLeft: "1px solid #000",
                        }}
                      >
                        <strong>Sub-Total</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                        }}
                      ></TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          borderTop: "1px solid #000",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        <strong>₹{discountedRate}</strong>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                          borderLeft: "1px solid #000",
                        }}
                      >
                        <strong>Tax%:</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                        }}
                      >
                        .00
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: "none" }}>
                        .00
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                          borderLeft: "1px solid #000",
                        }}
                      >
                        <strong>Packing%:</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                        }}
                      >
                        .00
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: "none" }}>
                        .00
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                          borderLeft: "1px solid #000",
                        }}
                      >
                        <strong>Net Amount:</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                        }}
                      ></TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          borderBottom: "none",
                        }}
                      >
                        <strong>₹{discountedRate}</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #000",
            borderTop: "none",
          }}
        >
          <Typography ml={2}>
            <strong>Rupees in words:</strong> {numberInWords}
          </Typography>
        </Box>

        {/* Final Note and Email */}
        <Typography mt={2}>
          <span style={{ color: "red" }}>*</span> This Symbol Notifies
          Non-Discount (Net-Rate) Items.
        </Typography>
        <Box p={2}>
          <Grid container>
            <Grid item xs={8}>
              <Grid container spacing={1}>
                {/* Client Name */}
                <Grid item xs={6}>
                  <Typography>
                    <strong>Total No.Of Discount Items</strong>
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography pl={2}>
                    <strong>{productDetails.length}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography sx={{ textAlign: "right" }}>
                    <strong>{Number(total).toFixed(2)}</strong>
                  </Typography>
                </Grid>

                {/* Address 1 */}
                <Grid item xs={6}>
                  <Typography>
                    <strong>Total No.Of Non- Discount [Net-Rate] Items</strong>
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography pl={2} sx={{ borderBottom: "1px solid #000" }}>
                    <strong>0</strong>
                  </Typography>
                </Grid>
                <Grid item xs={1} sx={{ paddingLeft: "0 !important" }}>
                  <Typography
                    pl={2}
                    sx={{
                      borderBottom: "1px solid #000",
                      width: "80px",
                      textAlign: "center",
                    }}
                  >
                    <strong>.00</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Total Items And Value</strong>
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography pl={2}>
                    <strong>{productDetails.length}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography sx={{ textAlign: "right" }}>
                    <strong>{Number(total).toFixed(2)}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoicePreview;
