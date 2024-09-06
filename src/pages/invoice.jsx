import { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const defaultForm = {
  image: {
    src: null,
    width: null,
    height: null,
    aspectRatio: null,
  },
  invoice: "INVOICE",
  hashtag: "1",
  to: "",
  from: "",
  billToText: "Bill to",
  shipToText: "Ship to",
  dateText: "Date",
  date: "",
  shipTo: "",
  paymentTermsText: "Payment Terms",
  paymentTerms: "",
  dueDateText: "Due Date",
  dueDate: "",
  PONumberText: "PO Number",
  PONumber: "",
  itemText: "Item",
  amountText: "Amount",
  quantityText: "Quantity",
  rateText: "Rate",
  items: [
    {
      item: "",
      quantity: "1",
      rate: "0",
      amount: "0.00",
    },
  ],
  notesText: "Notes",
  notes: "",
  termsText: "Terms",
  terms: "",
  subTotalText: "Subtotal",
  subTotal: null,
  discountText: "Discount",
  discount: null,
  amountDiscount: null,
  totalText: "Total",
  total: null,
  taxText: "Tax",
  tax: null,
  amountTax: null,
  shippingText: "Shipping",
  shipping: "",
  amountPaidText: "Amount Paid",
  amountPaid: "",
  balanceDueText: "Balance Due",
  balanceDue: "",
};

const Invoice = () => {
  const [invoiceForm, setInvoiceForm] = useState(() => {
    const savedForm = localStorage.getItem("form");
    return savedForm ? JSON.parse(savedForm) : defaultForm;
  });

  const [logo, setLogo] = useState(() => {
    const savedLogo = localStorage.getItem("logo");
    return savedLogo ? savedLogo : null;
  });

  const [isDiscountCur, setIsDiscountCur] = useState(false);
  const [isTaxCur, setIsTaxCur] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [isDiscountInput, setIsDiscountInput] = useState(false);
  const [isTaxInput, setIsTaxInput] = useState(false);
  const [isShippingInput, setIsShippingInput] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("Rp");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      const img = new Image();

      reader.onloadend = () => {
        img.src = reader.result;

        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const aspectRatio = width / height;

          setInvoiceForm((prevState) => ({
            ...prevState,
            image: {
              src: reader.result,
              width,
              height,
              aspectRatio,
            },
          }));

          setLogo(reader.result);
          localStorage.setItem("logo", reader.result);
        };
      };

      reader.readAsDataURL(file); // Baca file sebagai base64
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    setIsChange(!isChange);
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const field = name.split("_")[0];

    setIsChange(!isChange);

    setInvoiceForm((prevForm) => {
      const updatedItems = prevForm.items.map((item, i) => {
        if (i === index) {
          const newItem = { ...item, [field]: value };

          if (field === "quantity" || field === "rate") {
            const calculatedAmount =
              parseFloat(newItem.quantity) * parseFloat(newItem.rate);
            newItem.amount = isNaN(calculatedAmount)
              ? "0.00"
              : calculatedAmount.toFixed(2);
          }

          return newItem;
        }
        return item;
      });

      return {
        ...prevForm,
        items: updatedItems,
      };
    });
  };

  const addRow = () => {
    setInvoiceForm((prevForm) => ({
      ...prevForm,
      items: [
        ...prevForm.items,
        {
          item: "",
          quantity: "1",
          rate: "0",
          amount: "0.00",
        },
      ],
    }));
  };

  const handleDeleteRow = (index) => {
    setInvoiceForm((prevForm) => ({
      ...prevForm,
      items: prevForm.items.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteImage = (e) => {
    setLogo(null);
    setInvoiceForm((prevForm) => ({
      ...prevForm,
      image: {
        src: "",
        width: "",
        height: "",
        aspectRatio: "",
      },
    }));
    localStorage.removeItem("logo");
    e.stopPropagation();
  };

  const handleDiscount = () => {
    setIsDiscountCur(!isDiscountCur);
    setIsChange(!isChange);
  };

  const handleTax = () => {
    setIsTaxCur(!isTaxCur);
    setIsChange(!isChange);
  };

  const handleDiscountInput = () => {
    setIsDiscountInput(!isDiscountInput);
  };
  const handleTaxInput = () => {
    setIsTaxInput(!isTaxInput);
  };
  const handleShippingInput = () => {
    setIsShippingInput(!isShippingInput);
  };

  const handleDeleteShipping = () => {
    setIsShippingInput(!isShippingInput);
    setInvoiceForm((prev) => {
      return {
        ...prev,
        shipping: "",
      };
    });
  };

  const handleDeleteTax = () => {
    setIsTaxInput(!isTaxInput);
    setInvoiceForm((prev) => {
      return {
        ...prev,
        tax: "",
        amountTax: null,
      };
    });
  };

  const handleDeleteDiscount = () => {
    setIsDiscountInput(!isDiscountInput);
    setInvoiceForm((prev) => {
      return {
        ...prev,
        discount: "",
        amountDiscount: null,
      };
    });
  };

  const handleCurrency = (e) => {
    setSelectedCurrency(e.target.value);
  };

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const shipToRef = useRef(null);
  const notesRef = useRef(null);
  const termsRef = useRef(null);

  const autoResizeTextarea = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  const createRoundedImage = (imageSrc, radius) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageSrc;
      img.onload = function () {
        const width = img.width;
        const height = img.height;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(width - radius, 0);
        ctx.quadraticCurveTo(width, 0, width, radius);
        ctx.lineTo(width, height - radius);
        ctx.quadraticCurveTo(width, height, width - radius, height);
        ctx.lineTo(radius, height);
        ctx.quadraticCurveTo(0, height, 0, height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.clip();

        ctx.drawImage(img, 0, 0);
        ctx.restore();

        resolve(canvas.toDataURL("image/png"));
      };

      img.onerror = function (err) {
        reject(err);
      };
    });
  };

  // xxx
  const handlePDF = async () => {
    const doc = new jsPDF("p", "pt");

    try {
      if (invoiceForm.image.src) {
        const { src, width, height, aspectRatio } = invoiceForm.image;
        const maxWidth = 170;
        const maxHeight = 100;
        let pdfWidth = width;
        let pdfHeight = height;

        if (pdfWidth > maxWidth) {
          pdfWidth = maxWidth;
          pdfHeight = pdfWidth / aspectRatio;
        }

        if (pdfHeight > maxHeight) {
          pdfHeight = maxHeight;
          pdfWidth = pdfHeight * aspectRatio;
        }

        const roundedImageSrc = await createRoundedImage(src, 50);
        doc.addImage(roundedImageSrc, "PNG", 30, 20, pdfWidth, pdfHeight);
      }

      doc.setFontSize(24);
      doc.text(invoiceForm.invoice, 560, 50, "right");

      doc.setFontSize(12);
      doc.setTextColor(136, 140, 138);
      doc.text(`# ${invoiceForm.hashtag}`, 560, 68, "right");

      // checkpoint 1
      doc.setFontSize(10);
      doc.setTextColor(136, 140, 138);

      doc.text(invoiceForm.dateText, 450, 110, "right");
      doc.text(invoiceForm.paymentTermsText, 450, 130, "right");
      doc.text(invoiceForm.dueDateText, 450, 150, "right");
      doc.text(invoiceForm.PONumberText, 450, 170, "right");

      doc.setTextColor(0, 0, 0);
      doc.text(invoiceForm.date, 560, 110, "right");
      doc.text(invoiceForm.paymentTerms, 560, 130, "right");
      doc.text(invoiceForm.dueDate, 560, 150, "right");
      doc.text(invoiceForm.PONumber, 560, 170, "right");

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");

      doc.setFillColor(232, 230, 230);
      doc.roundedRect(300, 186, 270, 20, 4, 4, "F");

      doc.text(invoiceForm.balanceDueText, 450, 200, "right");
      doc.text(invoiceForm.balanceDue, 560, 200, "right");

      // Bill To / Ship To
      doc.text(invoiceForm.from, 40, 143);

      doc.text(invoiceForm.billToText, 40, 170);
      doc.text(invoiceForm.to, 40, 187);

      doc.text(invoiceForm.shipToText, 120, 170);
      doc.text(invoiceForm.shipTo, 120, 187);

      const tableHeaders = [
        { header: invoiceForm.itemText, dataKey: "item" },
        { header: invoiceForm.quantityText, dataKey: "quantity" },
        { header: invoiceForm.rateText, dataKey: "rate" },
        { header: invoiceForm.amountText, dataKey: "amount" },
      ];

      const tableData = [];

      invoiceForm.items.forEach((el) => {
        tableData.push({
          ...el,
          rate: `${selectedCurrency} ${formatter.format(el.rate)}`,
          amount: `${selectedCurrency} ${formatter.format(el.amount)}`,
        });
      });

      // autoTable function
      doc.autoTable({
        columns: tableHeaders,
        body: tableData,
        startY: 235,
        theme: "grid",
        margin: { left: 40, right: 30 },
        styles: {
          cellPadding: 4,
          lineWidth: 0,
        },
        headStyles: {},
        bodyStyles: {
          lineWidth: 0,
        },
        columnStyles: {
          0: { cellWidth: 230 },
          1: { cellWidth: 100 },
          2: { cellWidth: 100 },
        },
      });

      let yPosition = doc.previousAutoTable.finalY + 40;
      doc.setTextColor(136, 140, 138);
      doc.setFont("helvetica", "normal");

      const labels = [
        { text: `${invoiceForm.subTotalText}:`, value: invoiceForm.subTotal },

        ...(isDiscountCur
          ? [
              {
                text: `${invoiceForm.discountText}:`,
                value: invoiceForm.amountDiscount,
              },
            ]
          : [
              {
                text: `${invoiceForm.discountText} (${invoiceForm.discount} %):`,
                value: invoiceForm.amountDiscount,
              },
            ]),

        ...(isTaxCur
          ? [{ text: `${invoiceForm.taxText}:`, value: invoiceForm.amountTax }]
          : [
              {
                text: `${invoiceForm.taxText} (${invoiceForm.tax}%):`,
                value: invoiceForm.amountTax,
              },
            ]),

        { text: `${invoiceForm.shippingText}:`, value: invoiceForm.shipping },
        { text: `${invoiceForm.totalText}:`, value: invoiceForm.total },
        {
          text: `${invoiceForm.amountPaidText}:`,
          value: invoiceForm.amountPaid,
        },
      ];
      let currentPosition = yPosition + 20;
      const increment = 20;

      labels.forEach((label) => {
        if (
          label.value !== "" &&
          label.text &&
          label.value !== null &&
          label.value
        ) {
          console.log(label.text);
          doc.text(label.text, 450, currentPosition, "right");
          doc.setTextColor(0, 0, 0);
          doc.text(
            `${selectedCurrency} ${label.value}`,
            560,
            currentPosition,
            "right"
          );
          doc.setTextColor(136, 140, 138);
          currentPosition += increment;
        }
      });

      doc.text(invoiceForm.notes, 40, yPosition + 155);
      doc.text(invoiceForm.terms, 40, yPosition + 205);

      doc.setTextColor(136, 140, 138);
      doc.text(invoiceForm.notesText, 40, yPosition + 140);
      doc.text(invoiceForm.termsText, 40, yPosition + 190);

      // Save PDF only after everything is added
      doc.save("invoice.pdf");
    } catch (err) {
      console.error("Error creating PDF:", err);
    }
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("form"));

    if (data) {
      setInvoiceForm(data);
    } else {
      setInvoiceForm(defaultForm);
    }
  }, []);

  useEffect(() => {
    autoResizeTextarea(fromRef);
  }, [invoiceForm.from]);

  useEffect(() => {
    autoResizeTextarea(toRef);
  }, [invoiceForm.to]);

  useEffect(() => {
    autoResizeTextarea(shipToRef);
  }, [invoiceForm.shipTo]);

  useEffect(() => {
    autoResizeTextarea(notesRef);
  }, [invoiceForm.notes]);

  useEffect(() => {
    autoResizeTextarea(termsRef);
  }, [invoiceForm.terms]);

  useEffect(() => {
    localStorage.setItem("form", JSON.stringify(invoiceForm));
  }, [invoiceForm]);

  useEffect(() => {
    const newSubTotal = invoiceForm.items.reduce((acc, item) => {
      return acc + parseFloat(item.amount);
    }, 0);

    const discount = Number(invoiceForm.discount);
    let amountDiscount;

    let discountedTotal;
    if (!isDiscountCur) {
      amountDiscount = newSubTotal * (discount / 100);
      if (discount > 0) {
        discountedTotal = newSubTotal - newSubTotal * (discount / 100);
      } else {
        discountedTotal = newSubTotal;
      }
    } else {
      amountDiscount = Number(invoiceForm.discount);
      if (discount > 0) {
        discountedTotal = newSubTotal - discount;
      } else {
        discountedTotal = newSubTotal;
      }
    }

    const tax = Number(invoiceForm.tax);
    let amountTax;
    let finalTotal;

    if (!isTaxCur) {
      amountTax = discountedTotal * (tax / 100);
      if (tax > 0) {
        finalTotal = discountedTotal + discountedTotal * (tax / 100);
      } else {
        finalTotal = discountedTotal;
      }
    } else {
      amountTax = Number(invoiceForm.tax);
      if (tax > 0) {
        finalTotal = discountedTotal + tax;
      } else {
        finalTotal = discountedTotal;
      }
    }

    const shipping = Number(invoiceForm.shipping);
    let shippingTotal;

    if (shipping > 0) {
      shippingTotal = finalTotal + shipping;
    } else {
      shippingTotal = finalTotal;
    }

    const amountPaid = Number(invoiceForm.amountPaid);
    let newBalanceDue;

    if (amountPaid > 0) {
      newBalanceDue = shippingTotal - amountPaid;
    } else {
      newBalanceDue = shippingTotal;
    }

    setInvoiceForm((prev) => ({
      ...prev,
      subTotal: isNaN(newSubTotal) ? "0.00" : newSubTotal.toFixed(2),
      total: isNaN(shippingTotal) ? "0.00" : shippingTotal.toFixed(2),
      balanceDue: isNaN(newBalanceDue) ? "0.00" : newBalanceDue.toFixed(2),
      amountTax: isNaN(amountTax) ? null : amountTax.toFixed(2),
      amountDiscount: isNaN(amountDiscount) ? null : amountDiscount.toFixed(2),
    }));
  }, [
    invoiceForm.shipping,
    invoiceForm.items,
    invoiceForm.discount,
    invoiceForm.tax,
    isDiscountCur,
    isTaxCur,
    isChange,
    invoiceForm.amountPaid,
  ]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="container py-12 mx-auto lg:flex justify-center px-5 lg:px-0 lg:text-md text-sm">
      <div
        className="invoice bg-white max-w-[900px] text-[#909AA4] rounded-md border shadow-lg lg:p-12 p-4 md:p-8"
        id="content"
      >
        <div className="lg:flex lg:justify-between">
          <div className="overflow-hidden relative">
            {logo && (
              <button
                className="absolute w-8 h-8 bg-black text-white font-semibold rounded-lg text-md flex justify-center items-center top-3 left-3 z-10"
                onClick={handleDeleteImage}
              >
                X
              </button>
            )}
            <label
              htmlFor="photo"
              className={`${
                logo
                  ? "w-full lg:max-w-[400px] lg:max-h-[300px] max-w-[200px] max-h-200"
                  : "h-32 w-48 bg-[#F6F6F6]"
              } flex justify-center items-center rounded-md border cursor-pointer hover:bg-[#ececec] transition-all duration-300 relative`}
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Uploaded Logo"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-500">+ Add Your Logo</div>
              )}
            </label>
            <input
              type="file"
              name="image"
              id="photo"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="lg:flex flex-col items-end">
            <input
              type="text"
              name="invoice"
              value={invoiceForm.invoice}
              onChange={handleChange}
              className="text-black py-2 lg:px-5 rounded-md text-3xl lg:text-end hover:border-slate-300 border-gray-300 outline-none w-60 focus:shadow-neu focus:border-slate-300 border border-transparent transition-all duration-300 cursor-pointer"
            />

            <div className="flex items-center rounded-md text-end border-slate-300 outline-none w-40 border my-3 text-slate-500">
              <div className="py-2 px-4">#</div>
              <input
                type="text"
                name="hashtag"
                value={invoiceForm.hashtag}
                onChange={handleChange}
                className="py-2 pr-5 lg:text-end outline-none border-none focus:shadow-neu max-w-[116px] rounded-r-md"
              />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between gap-6 flex-col lg:flex-row">
          <div>
            <textarea
              ref={fromRef}
              name="from"
              placeholder="who is this from?"
              value={invoiceForm.from}
              onChange={handleChange}
              className="no-resize border border-slate-300 px-5 py-2 outline-none lg:mt-5 mt-2 lg:mb-3 mb-2 rounded-md focus:shadow-neu focus:border-slate-300 overflow-hidden w-full lg:max-w-[300px]"
              style={{ resize: "none" }}
              cols="40"
            ></textarea>

            <div className="w-full flex lg:gap-6 flex-col lg:flex-row gap-2">
              <div className="w-ful">
                <input
                  type="text"
                  name="billToText"
                  value={invoiceForm.billToText}
                  onChange={handleChange}
                  className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300 transition-all duration-300"
                />

                <textarea
                  ref={toRef}
                  name="to"
                  placeholder="who is this from?"
                  value={invoiceForm.to}
                  onChange={handleChange}
                  className="no-resize border border-slate-300 px-5 py-2 outline-none my-1 rounded-md focus:shadow-neu focus:border-slate-300 overflow-hidden w-full"
                  style={{ resize: "none" }}
                ></textarea>
              </div>

              <div className="flex flex-col w-full">
                <input
                  type="text"
                  name="shipToText"
                  value={invoiceForm.shipToText}
                  onChange={handleChange}
                  className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300"
                />

                <textarea
                  ref={shipToRef}
                  name="shipTo"
                  placeholder="(optional)"
                  value={invoiceForm.shipTo}
                  onChange={handleChange}
                  className="no-resize border border-slate-300 px-5 py-2 outline-none my-1 rounded-md focus:shadow-neu focus:border-slate-300 overflow-hidden w-full"
                  style={{ resize: "none" }}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="lg:mt-7">
            <div className="flex gap-1 my-1">
              <input
                type="text"
                name="dateText"
                value={invoiceForm.dateText}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300 text-end"
              />
              <input
                type="date"
                name="date"
                value={invoiceForm.date}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 focus:shadow-neu rounded-md w-full hover:border-slate-300  transition-all duration-300 text-end"
              />
            </div>
            <div className="flex gap-1 my-1">
              <input
                type="text"
                name="paymentTermsText"
                value={invoiceForm.paymentTermsText}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300 text-end"
              />
              <input
                type="text"
                name="paymentTerms"
                value={invoiceForm.paymentTerms}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 focus:shadow-neu rounded-md w-full hover:border-slate-300  transition-all duration-300 text-end"
              />
            </div>
            <div className="flex gap-1 my-1">
              <input
                type="text"
                name="dueDateText"
                value={invoiceForm.dueDateText}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300 text-end"
              />
              <input
                type="date"
                name="dueDate"
                value={invoiceForm.dueDate}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 focus:shadow-neu rounded-md w-full hover:border-slate-300  transition-all duration-300 text-end"
              />
            </div>
            <div className="flex gap-1 my-1">
              <input
                type="text"
                name="PONumberText"
                value={invoiceForm.PONumberText}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300 text-end"
              />
              <input
                type="text"
                name="PONumber"
                value={invoiceForm.PONumber}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 focus:shadow-neu rounded-md w-full hover:border-slate-300  transition-all duration-300 text-end"
              />
            </div>
          </div>
        </div>
        <div>
          <table className="my-5 lg:table hidden ">
            <thead>
              <tr>
                <th className="w-1/3 ">
                  <input
                    type="text"
                    name="itemText"
                    value={invoiceForm.itemText}
                    onChange={handleChange}
                    className="py-2 px-5 outline-none rounded-l-md cursor-pointer transition-all duration-300 bg-[#132144] focus:shadow-neu-white w-full text-white"
                  />
                </th>
                <th>
                  <input
                    type="text"
                    name="quantityText"
                    value={invoiceForm.quantityText}
                    onChange={handleChange}
                    className="py-2 px-5 outline-none cursor-pointer transition-all duration-300 bg-[#132144] focus:shadow-neu-white w-full text-white"
                  />
                </th>
                <th>
                  <input
                    type="text"
                    name="rateText"
                    value={invoiceForm.rateText}
                    onChange={handleChange}
                    className="py-2 px-5 outline-none cursor-pointer transition-all duration-300 bg-[#132144] focus:shadow-neu-white w-full text-white"
                  />
                </th>
                <th>
                  <input
                    type="text"
                    name="amountText"
                    value={invoiceForm.amountText}
                    onChange={handleChange}
                    className="py-2 px-5 outline-none rounded-r-md cursor-pointer transition-all duration-300 bg-[#132144] focus:shadow-neu-white w-full text-white"
                  />
                </th>
                <th className="px-5 text-transparent text-xl opacity-0">x</th>
              </tr>
            </thead>
            <tbody>
              {invoiceForm.items.map((item, index) => (
                <tr key={index} className="group">
                  <td>
                    <input
                      type="text"
                      name={`item_${index}`}
                      placeholder="Description of item/service..."
                      value={item.item}
                      onChange={(e) => handleItemChange(e, index)}
                      className="py-2 px-5 outline-none rounded-l-md transition-all duration-300 border border-slate-300 focus:shadow-neu w-full rounded-md"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      name={`quantity_${index}`}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(e, index)}
                      className="py-2 px-5 outline-none transition-all duration-300 border border-slate-300 focus:shadow-neu w-full rounded-md"
                    />
                  </td>
                  <td>
                    <div className="relative flex items-center border rounded-md">
                      <div className="px-2 py-2">{selectedCurrency}</div>
                      <input
                        type="number"
                        name={`rate_${index}`}
                        value={item.rate}
                        onChange={(e) => handleItemChange(e, index)}
                        min="0"
                        className="py-2 px-5 outline-none transition-all duration-300 border-slate-300 focus:shadow-neu w-full rounded-r-md"
                      />
                    </div>
                  </td>
                  <td className="text-center whitespace-nowrap">
                    {selectedCurrency} {formatter.format(item.amount)}
                  </td>
                  <td className="text-center">
                    {invoiceForm.items.length > 1 && (
                      <button
                        onClick={() => handleDeleteRow(index)}
                        className="px-5 text-red-500 text-xl items-center py-2 opacity-0 group-hover:opacity-100"
                      >
                        x
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoiceForm.items.map((item, index) => {
            return (
              <div
                className="px-5 py-4 rounded-lg shadow-lg md:hidden w-full border border-slate-300 mt-5 mb-3 relative"
                key={index}
              >
                <div>
                  <div>
                    <span className="font-medium">
                      {invoiceForm.amountText}
                    </span>
                    : {selectedCurrency} {item.amount}
                  </div>

                  <div className="flex my-2 items-center gap-3">
                    <div className="relative flex items-center border rounded-md">
                      <div className="px-2 py-2">{selectedCurrency}</div>
                      <input
                        type="number"
                        name={`rate_${index}`}
                        value={item.rate}
                        onChange={(e) => handleItemChange(e, index)}
                        min="0"
                        className="py-2 px-5 outline-none transition-all duration-300 border-slate-300 focus:shadow-neu w-full rounded-r-md"
                      />
                    </div>
                    X
                    <div>
                      {" "}
                      <input
                        type="number"
                        min="0"
                        name={`quantity_${index}`}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(e, index)}
                        className="py-2 px-5 outline-none transition-all duration-300 border border-slate-300 focus:shadow-neu w-full rounded-md"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    name={`item_${index}`}
                    placeholder="Description of item/service..."
                    value={item.item}
                    onChange={(e) => handleItemChange(e, index)}
                    className="py-2 px-5 outline-none rounded-l-md transition-all duration-300 border border-slate-300 focus:shadow-neu w-full rounded-md"
                  />
                </div>
                {invoiceForm.items.length > 1 && (
                  <button
                    onClick={() => handleDeleteRow(index)}
                    className="px-5 text-red-500 text-xl items-center py-2 absolute top-0 right-0"
                  >
                    x
                  </button>
                )}
              </div>
            );
          })}
          <button
            onClick={addRow}
            className="py-2 px-4 bg-[#132144] text-white rounded-md hover:bg-[#0e1a29] transition-all duration-300"
          >
            Add Row
          </button>
        </div>
        <div className="mt-10 flex justify-between gap-6 flex-col lg:flex-row">
          <div>
            <div>
              <input
                type="text"
                name="notesText"
                value={invoiceForm.notesText}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300 transition-all duration-300"
              />

              <textarea
                ref={notesRef}
                name="notes"
                placeholder="Notes - any relevany information not already covered"
                value={invoiceForm.notes}
                onChange={handleChange}
                className="no-resize border border-slate-300 px-5 py-2 outline-none my-1 rounded-md focus:shadow-neu focus:border-slate-300 overflow-hidden w-full"
                style={{ resize: "none" }}
              ></textarea>
            </div>
            <div className="mt-3">
              <input
                type="text"
                name="termsText"
                value={invoiceForm.termsText}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full text-md cursor-pointer hover:border-slate-300 transition-all duration-300"
              />

              <textarea
                ref={termsRef}
                name="terms"
                placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                value={invoiceForm.terms}
                onChange={handleChange}
                className="no-resize border border-slate-300 px-5 py-2 outline-none my-1 rounded-md focus:shadow-neu focus:border-slate-300 overflow-hidden w-full text-md"
                style={{ resize: "none" }}
              ></textarea>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="flex gap-1 w-full">
              <input
                type="text"
                name="subTotalText"
                value={invoiceForm.subTotalText}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300 text-end"
              />
              <div className="mx-5 my-2 text-end max-w-28 w-full whitespace-nowrap">
                {selectedCurrency} {formatter.format(invoiceForm.subTotal)}
              </div>
            </div>
            <div className="mr-10">
              {isDiscountInput && (
                <div className="flex gap-1 w-full">
                  <input
                    type="text"
                    name="discountText"
                    value={invoiceForm.discountText}
                    onChange={handleChange}
                    className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300 text-end"
                  />
                  <div className="border border-slate-300 relative flex rounded-md">
                    {isDiscountCur ? (
                      <div className="flex items-center">
                        <div className="px-3 py-2">{selectedCurrency}</div>
                        <input
                          type="number"
                          name="discount"
                          value={
                            invoiceForm.discount ? invoiceForm.discount : ""
                          }
                          onChange={handleChange}
                          className={`py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu w-full cursor-pointer hover:border-slate-300 transition-all duration-300 text-end rounded-r-md`}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <input
                          type="number"
                          name="discount"
                          value={invoiceForm.discount}
                          onChange={handleChange}
                          className={`py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu w-full cursor-pointer hover:border-slate-300 transition-all duration-300 text-end rounded-l-md`}
                        />
                        <div className="px-3 py-2">%</div>
                      </div>
                    )}

                    <button
                      className="py-2 px-2 border-l border-slate-300 hover:bg-slate-600 transition-all duration-300"
                      onClick={handleDiscount}
                    >
                      ≡
                    </button>

                    <button
                      className="absolute -right-5 top-2 font-semibold text-red-500"
                      onClick={handleDeleteDiscount}
                    >
                      X
                    </button>
                  </div>
                </div>
              )}
              {isTaxInput && (
                <div className="flex gap-1 w-full my-1">
                  <input
                    type="text"
                    name="taxText"
                    value={invoiceForm.taxText}
                    onChange={handleChange}
                    className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300 text-end"
                  />
                  <div className="border border-slate-300 relative flex rounded-md">
                    {isTaxCur ? (
                      <div className="flex items-center">
                        <div className="px-3 py-2">{selectedCurrency}</div>
                        <input
                          type="number"
                          name="tax"
                          value={invoiceForm.tax}
                          onChange={handleChange}
                          className={`py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu w-full cursor-pointer hover:border-slate-300 transition-all duration-300 text-end rounded-r-md`}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <input
                          type="number"
                          name="tax"
                          value={invoiceForm.tax}
                          onChange={handleChange}
                          className={`py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu w-full cursor-pointer hover:border-slate-300 transition-all duration-300 text-end rounded-l-md`}
                        />
                        <div className="px-3 py-2">%</div>
                      </div>
                    )}

                    <button
                      className="py-2 px-2 border-l border-slate-300 hover:bg-slate-600 transition-all duration-300"
                      onClick={handleTax}
                    >
                      ≡
                    </button>

                    <button
                      className="absolute -right-5 top-2 font-semibold text-red-500"
                      onClick={handleDeleteTax}
                    >
                      X
                    </button>
                  </div>
                </div>
              )}
              {isShippingInput && (
                <div className="flex gap-1 w-full my-1 relative">
                  <input
                    type="text"
                    name="shippingText"
                    value={invoiceForm.shippingText}
                    onChange={handleChange}
                    className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300 text-end"
                  />
                  <div className="border border-slate-300 relative flex rounded-md">
                    <div className="flex items-center">
                      <div className="px-3 py-2">{selectedCurrency}</div>
                      <input
                        type="number"
                        name="shipping"
                        value={invoiceForm.shipping}
                        onChange={handleChange}
                        className={`py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu w-full cursor-pointer hover:border-slate-300 transition-all duration-300 text-end rounded-r-md`}
                      />
                    </div>
                  </div>
                  <button
                    className="absolute -right-5 top-2 font-semibold text-red-500"
                    onClick={handleDeleteShipping}
                  >
                    X
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              {!isDiscountInput && (
                <button
                  className="text-[#107A5f] font-semibold hover:opacity-75 px-4 py-2"
                  onClick={handleDiscountInput}
                >
                  + Discount
                </button>
              )}

              {!isTaxInput && (
                <button
                  className="text-[#107A5f] font-semibold hover:opacity-75 px-4 py-2"
                  onClick={handleTaxInput}
                >
                  + Tax
                </button>
              )}

              {!isShippingInput && (
                <button
                  className="text-[#107A5f] font-semibold hover:opacity-75 px-4 py-2"
                  onClick={handleShippingInput}
                >
                  + Shipping
                </button>
              )}
            </div>
            <div className="flex gap-1 w-full">
              <input
                type="text"
                name="totalText"
                value={invoiceForm.totalText}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300 text-end"
              />
              <div className="mx-5 my-2 text-end max-w-28 w-full whitespace-nowrap">
                {selectedCurrency} {formatter.format(invoiceForm.total)}
              </div>
            </div>
            <div className="flex gap-1 w-full my-1">
              <input
                type="text"
                name="amountPaidText"
                value={invoiceForm.amountPaidText}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300 text-end"
              />
              <div className="border border-slate-300 relative flex rounded-md">
                <div className="flex items-center">
                  <div className="px-3 py-2">{selectedCurrency}</div>
                  <input
                    type="number"
                    name="amountPaid"
                    value={invoiceForm.amountPaid}
                    onChange={handleChange}
                    className={`py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu w-full cursor-pointer hover:border-slate-300 transition-all duration-300 text-end rounded-r-md`}
                  />
                </div>
              </div>
            </div>
            <div className="flex">
              <input
                type="text"
                name="balanceDueText"
                value={invoiceForm.balanceDueText}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full cursor-pointer hover:border-slate-300  transition-all duration-300 text-end"
              />
              <div className="mx-5 my-2 text-end max-w-28 w-full whitespace-nowrap">
                {selectedCurrency} {formatter.format(invoiceForm.balanceDue)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:max-w-[300px] lg:p-12 w-full mx-auto lg:mx-0 pt-5">
        <button
          className="w-full py-3 hover:opacity-70 rounded-lg text-white font-semibold my-2 bg-[#009E74]"
          onClick={handlePDF}
        >
          Download
        </button>

        <div className="w-full py-7 border-y my-5 text-slate-500">
          <p>Currency</p>

          <div className="relative my-2">
            <select
              className="py-2 px-3 bg-white border w-full rounded-md text-start appearance-none outline-none focus:shadow-neu"
              onChange={handleCurrency}
            >
              <option value="Rp">IDR (Rp)</option>
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="¥">JPY (¥)</option>
              <option value="£">GBP (£)</option>
              <option value="A$">AUD (A$)</option>
              <option value="C$">CAD (C$)</option>
              <option value="Fr">CHF (Fr)</option>
              <option value="¥">CNY (¥)</option>
              <option value="₹">INR (₹)</option>
            </select>
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none rotate-90">
              ›
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
