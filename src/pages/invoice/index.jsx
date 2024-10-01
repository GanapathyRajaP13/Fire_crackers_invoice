import React, { useState } from "react";
import InvoiceForm from "../../comonents/invoiceForm";
import InvoicePreview from "../../comonents/invoicePreview";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (data, bool) => {
    setInvoiceData(data);
    setIsSubmitted(bool);
  };

  const handleBack = () => {
    setIsSubmitted(false);
    setInvoiceData([]);
  };

  return (
    <div>
      {!isSubmitted && <InvoiceForm onSubmit={handleSubmit} />}
      {isSubmitted && (
        <InvoicePreview invoiceData={invoiceData} handleBack={handleBack} />
      )}
    </div>
  );
};

export default Invoice;
