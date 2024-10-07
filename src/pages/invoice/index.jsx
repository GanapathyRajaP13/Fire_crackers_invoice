import React, { useState, useEffect } from "react";
import InvoiceForm from "../../components/invoiceForm";
import InvoicePreview from "../../components/invoicePreview";

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
    const savedItems = localStorage.getItem("items");
    if (savedItems) {
      try {
        setInvoiceData(JSON.parse(savedItems));
      } catch (error) {
        console.error("Failed to parse saved items:", error);
        setInvoiceData([]);
      }
    }
  }, []);

  return (
    <div>
      {!isSubmitted && (
        <InvoiceForm onSubmit={handleSubmit} invoiceData={invoiceData} />
      )}
      {isSubmitted && (
        <InvoicePreview invoiceData={invoiceData} handleBack={handleBack} />
      )}
    </div>
  );
};

export default Invoice;
