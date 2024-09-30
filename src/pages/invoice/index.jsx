import React, { useState } from "react";
import InvoiceForm from "../../comonents/invoiceForm";
import InvoicePreview from "../../comonents/invoicePreview";

const Invoice = () => {
  const initialData = {
    clientDetails: {
      name: "SIVAKASI CRACKERS",
      address1: "77Z/1, GANDHI ROAD",
      address2: "NEAR SATHYA MOBILES",
      city: "SIVAKASI",
      phone: "9486496298",
      mobile: "78119 71270",
      agent: "DIRECT",
      email: "dhilip781@gmail.com",
      date: "10-09-2024",
      estimateNo: "7",
    },
    productDetails: [
      { id: 1, name: "30 Cm Electric", quantity: 5, rate: 180 },
      { id: 2, name: "Flower Pot Big", quantity: 3, rate: 384 },
      { id: 3, name: "Flower Pot Spl", quantity: 2, rate: 560 },
    ],
    discount: 70,
  };

  const [invoiceData, setInvoiceData] = useState(initialData);
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
