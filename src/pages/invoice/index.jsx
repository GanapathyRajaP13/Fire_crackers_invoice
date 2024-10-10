import React, { useState, useEffect, lazy, Suspense } from "react";

const InvoiceForm = lazy(() => import("../../components/invoiceForm"));
const InvoicePreview = lazy(() => import("../../components/invoicePreview"));

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (data, bool) => {
    setInvoiceData(data);
    localStorage.setItem("items", JSON.stringify(data));
    setIsSubmitted(bool);
  };

  const handleBack = () => {
    setIsSubmitted(false);
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
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
