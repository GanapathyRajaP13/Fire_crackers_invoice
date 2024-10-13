import { LinearProgress } from "@mui/material";
import React, { useState, lazy, Suspense } from "react";

const InvoiceForm = lazy(() => import("../../components/invoiceForm"));
const InvoicePreview = lazy(() => import("../../components/invoicePreview"));

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (data, bool) => {
    setInvoiceData(data);
    setIsSubmitted(bool);
  };

  const handleBack = () => {
    setIsSubmitted(false);
  };

  return (
    <div>
      <Suspense fallback={<LinearProgress />}>
        {!isSubmitted && (
          <InvoiceForm onSubmit={handleSubmit} invoiceData={invoiceData} />
        )}
        {isSubmitted && (
          <InvoicePreview invoiceData={invoiceData} handleBack={handleBack} />
        )}
      </Suspense>
    </div>
  );
};

export default Invoice;
