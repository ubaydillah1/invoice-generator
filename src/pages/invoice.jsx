import { useState, useRef, useEffect } from "react";

const Invoice = () => {
  const [invoiceForm, setInvoiceForm] = useState({
    invoice: "INVOICE",
    hashtag: "1",
    billToText: "Bill to",
    to: "who is this to?",
    from: "",
  });

  const fromRef = useRef(null);
  const toRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const autoResizeTextarea = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResizeTextarea(fromRef);
    autoResizeTextarea(toRef);
  }, [invoiceForm]);

  return (
    <div className="container bg-white max-w-[900px] h-screen mx-auto my-48 text-[#909AA4] rounded-md border shadow-lg p-12">
      <div className="invoice">
        <div className="flex justify-between">
          <div>
            <label
              htmlFor="photo"
              className="h-32 w-48 bg-[#F6F6F6] flex justify-center items-center rounded-md border cursor-pointer hover:bg-[#ececec]"
            >
              + Add Your Logo
            </label>
            <input type="file" name="photo" id="photo" className="hidden" />
          </div>
          <div className="flex flex-col items-end">
            <input
              type="text"
              name="invoice"
              value={invoiceForm.invoice}
              onChange={handleChange}
              className="text-black py-2 px-5 rounded-md text-3xl text-end hover:border-slate-300 border-gray-300 outline-none w-60 focus:shadow-neu focus:border-slate-300 border border-transparent"
            />

            <div className="flex items-center rounded-md text-end border-slate-300 outline-none w-40 border border-transparent my-3 text-slate-500">
              <div className="py-2 px-4">#</div>
              <input
                type="text"
                name="hashtag"
                value={invoiceForm.hashtag}
                onChange={handleChange}
                className="py-2 pr-5 text-end outline-none border-none focus:shadow-neu max-w-[116px] rounded-r-md"
              />
            </div>
          </div>
        </div>
        <div>
          <textarea
            ref={fromRef}
            name="from"
            placeholder="who is this from?"
            value={invoiceForm.from}
            onChange={handleChange}
            className="no-resize border border-slate-300 px-5 py-2 outline-none my-5 rounded-md focus:shadow-neu focus:border-slate-300 overflow-hidden"
            style={{ resize: "none" }}
            cols="40"
          ></textarea>

          <div className="max-w-[50%] flex gap-6">
            <div className="flex flex-col">
              <input
                type="text"
                name="billToText"
                value={invoiceForm.billToText}
                onChange={handleChange}
                className="py-2 px-5 outline-none border focus:border-slate-300 border-transparent focus:shadow-neu rounded-md w-full"
              />

              <textarea
                ref={toRef}
                name="to"
                placeholder="who is this from?"
                value={invoiceForm.to}
                onChange={handleChange}
                className="no-resize border border-slate-300 px-5 py-2 outline-none my-5 rounded-md focus:shadow-neu focus:border-slate-300 overflow-hidden"
                style={{ resize: "none" }}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="cetak"></div>
    </div>
  );
};

export default Invoice;
