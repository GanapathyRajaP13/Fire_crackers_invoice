import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import numberToWords from "number-to-words";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const InvoicePreview = ({ invoiceData, handleBack }) => {
  const componentRef = useRef(null);
  const { clientDetails, productDetails, discount, mobileNumbers } =
    invoiceData;
  const [discountedRate, setDiscountedRate] = useState(0);
  const [total, setTotal] = useState(0);
  const nonDiscountTotalValue = 0;
  const nonDiscountItemCount = 0;
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
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgData = canvas.toDataURL("image/jpeg", 2);
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      const addFooter = () => {
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(`Page ${pageNumber}`, pdfWidth - 20, pdfHeight - 10);
        pageNumber += 1;
      };
      addFooter();

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        addFooter();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(
        `${clientDetails?.name}-${clientDetails?.estimateNo}-${clientDetails?.date}.pdf`
      );
    });
  };

  const numberInWords = `${numberToWords.toWords(
    Math.floor(discountedRate)
  )} only`;

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
            sx={{
              fontWeight: "bold",
              border: "1px solid #000",
              borderBottom: "none",
              textAlign: "center",
            }}
          >
            ESTIMATE - RETAIL
          </Typography>
          <Box sx={{ border: "1px solid #000", textAlign: "center" }}>
            <Typography variant="h6">
              <strong>SIVAKASI CRACKERS</strong>
            </Typography>
            <Grid
              container
              spacing={0}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={1}>
                <Typography>
                  <strong>Phone No:</strong>
                </Typography>
              </Grid>

              {mobileNumbers.map((number, index) => (
                <Grid item xs={1} key={index}>
                  <Typography>
                    {number}
                    {index < mobileNumbers.length - 1 && ","}
                  </Typography>
                </Grid>
              ))}
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
          <Box p={2}>
            <Grid container alignItems="stretch" spacing={0}>
              <Grid item xs={3}>
                <Grid container>
                  <Grid item xs={4}>
                    <Typography>
                      <strong>Estimate To</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{`: ${clientDetails?.name}`}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={2}>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography>
                      <strong>City</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography>{`: ${clientDetails?.city}`}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={3}>
                <Grid container>
                  <Grid item xs={4}>
                    <Typography>
                      <strong>Mobile No</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{`: ${clientDetails?.mobile}`}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={3}>
                <Grid container spacing={0}>
                  <Grid item xs={5}>
                    <Typography>
                      <strong>Estimate No</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography>
                      {clientDetails?.estimateNo
                        ? `: ${clientDetails?.estimateNo} / ${clientDetails?.date}`
                        : `: ${clientDetails?.date}`}
                    </Typography>
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
            <TableHead>
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
                  Unit
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "1px solid #000",
                  }}
                >
                  Rate / unit (₹)
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "1px solid #000",
                  }}
                >
                  Amount (₹)
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
                    sx={{ border: "1px solid #000", textAlign: "center" }}
                  >
                    {product.unit}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #000", textAlign: "right" }}
                  >
                    {product.rate.toFixed(2)}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #000", textAlign: "right" }}
                  >
                    {getAmount(product.quantity, product.rate).toFixed(2)}
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
              <Typography m={2}>
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
                        <strong>Goods Value</strong>
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
                        align="right"
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
                        <strong>Tax %</strong>
                      </TableCell>
                      <TableCell
                        align="right"
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
                        <strong>Packing %</strong>
                      </TableCell>
                      <TableCell
                        align="right"
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
                        <strong>Net Amount</strong>
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

        <Typography mt={2}>
          <span style={{ color: "red" }}>*</span> This Symbol Notifies
          Non-Discount (Net-Rate) Items.
        </Typography>
        {/* <Box p={2}>
          <Grid container>
            <Grid item xs={8}>
              <Grid container spacing={1}>
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
                    sx={{
                      borderBottom: "1px solid #000",
                      width: "90px",
                      textAlign: "right",
                      pr:1
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
        </Box> */}
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Total No. Of Discount Items</strong>
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

                <Grid item xs={6}>
                  <Typography>
                    <strong>Total No. Of Non-Discount [Net-Rate] Items</strong>
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography pl={2} sx={{ borderBottom: "1px solid #000" }}>
                    <strong>{nonDiscountItemCount || 0}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={1} sx={{ paddingLeft: "0 !important" }}>
                  <Typography
                    sx={{
                      borderBottom: "1px solid #000",
                      width: "90px",
                      textAlign: "right",
                      pr:
                        Number(total) < 1000
                          ? 3
                          : Number(total) > 1000 && Number(total) < 100000
                          ? 2
                          : 0,
                    }}
                  >
                    <strong>
                      {nonDiscountTotalValue?.toFixed(2) || ".00"}
                    </strong>
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
