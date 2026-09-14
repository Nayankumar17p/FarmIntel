// src/components/farmer/TransactionsView.tsx
import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  Download,
  DollarSign,
  ShieldCheck,
  Calendar,
  Building,
  Printer,
  Sparkles,
} from "lucide-react";
import { Transaction, User } from "../../types";
import { FarmLogoIcon } from "../common/FarmLogo";

interface TransactionsViewProps {
  currentUser: User | null;
  language: "hi" | "en" | "hinglish";
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ currentUser, language }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isExported, setIsExported] = useState(false);

  const fetchTransactions = () => {
    fetch("/api/transactions")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTransactions(data);
          if (data.length > 0 && !selectedTx) {
            setSelectedTx(data[0]);
          }
        }
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 3000);
    return () => clearInterval(interval);
  }, []);

  const exportToCSV = () => {
    if (!transactions || transactions.length === 0) return;

    const headers = [
      "Transaction ID",
      "Settlement Date",
      "Commodity",
      "Quantity (Quintals)",
      "Agreed Price Per Quintal (INR)",
      "Gross Sales Amount (INR)",
      "Freight & Transport Cost (INR)",
      "Storage & Handling Cost (INR)",
      "Mandi Cess & Taxes (INR)",
      "Total Expenses Deducted (INR)",
      "Net Bank Credit (INR)",
      "Buyer Name",
      "Buyer ID",
      "Farmer Name",
      "Farmer ID",
      "Payment Mode",
      "Payment Status",
      "Transaction Status",
    ];

    const escapeCsv = (value: string | number | undefined | null): string => {
      if (value === undefined || value === null) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = transactions.map((tx) => [
      escapeCsv(tx.id),
      escapeCsv(tx.settlementDate),
      escapeCsv(tx.cropName),
      escapeCsv(tx.quantityQuintals),
      escapeCsv(tx.pricePerQ),
      escapeCsv(tx.grossAmount),
      escapeCsv(tx.transportCost),
      escapeCsv(tx.storageAndHandlingCost),
      escapeCsv(tx.mandiTaxes),
      escapeCsv(tx.totalExpenses),
      escapeCsv(tx.netRealisation),
      escapeCsv(tx.buyerName),
      escapeCsv(tx.buyerId),
      escapeCsv(tx.farmerName),
      escapeCsv(tx.farmerId),
      escapeCsv(tx.paymentMethod),
      escapeCsv(tx.paymentStatus),
      escapeCsv(tx.status),
    ]);

    const csvString = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\r\n");

    // Prepend UTF-8 BOM so Excel & spreadsheet tools handle special characters & formatting seamlessly
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStamp = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `FarmIntel_Transactions_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExported(true);
    setTimeout(() => {
      setIsExported(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Mandi Bill &amp; Settlement Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {language === "hi" ? "भुगतान और डिजिटल रसीदें" : "Settlement & Transaction Receipts"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === "hi"
              ? "प्रत्येक सौदे का सकल मूल्य, कटा हुआ भाड़ा, मंडी सेस और आपके खाते में आई शुद्ध राशि।"
              : "Detailed ledger proving exact Gross Sales minus Freight & Taxes = True Net Bank Deposit."}
          </p>
        </div>

        {/* Action Button: Export CSV */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="export-transactions-csv-btn"
            onClick={exportToCSV}
            disabled={transactions.length === 0}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isExported
                ? "bg-emerald-600 text-white"
                : "bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
            title="Download CSV records for personal books and bookkeeping"
          >
            {isExported ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>{language === "hi" ? "CSV डाउनलोड हो गया!" : "CSV Exported!"}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>
                  {language === "hi"
                    ? `CSV रिकॉर्ड निर्यात करें (${transactions.length})`
                    : `Export CSV Records (${transactions.length})`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Transaction History List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Settled Mandi &amp; Buyer Deals
              </h2>
              {transactions.length > 0 && (
                <button
                  id="export-csv-link-btn"
                  onClick={exportToCSV}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === "hi" ? "CSV डाउनलोड" : "Download CSV"}</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedTx?.id === tx.id
                      ? "border-emerald-500 bg-emerald-50/40 shadow-xs"
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-stone-900">{tx.cropName}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          ✓ {tx.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Sold to: <strong>{tx.buyerName}</strong> • {tx.settlementDate}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-400">
                        Net Bank Credit
                      </span>
                      <p className="text-base font-extrabold text-emerald-700">
                        ₹{tx.netRealisation.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                    <span>
                      Volume: <strong>{tx.quantityQuintals} Quintals</strong> @ ₹{tx.pricePerQ}/Q
                    </span>
                    <span className="text-stone-500">
                      Gross: ₹{tx.grossAmount.toLocaleString("en-IN")} (Exp: -₹{tx.totalExpenses.toLocaleString("en-IN")})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Digital Bill / Receipt (5 cols) */}
        <div className="lg:col-span-5">
          {selectedTx ? (
            <div className="bg-white rounded-3xl p-6 border border-stone-300 shadow-lg space-y-4 relative">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-stone-200 shadow-2xs flex items-center justify-center">
                    <FarmLogoIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">FarmIntel e-Mandi Bill</h3>
                    <p className="text-[10px] text-stone-500">Invoice #{selectedTx.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600"
                  title="Print Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              {/* Bill Body */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Farmer:</span>
                  <span className="font-bold text-stone-800">{selectedTx.farmerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Purchaser / Buyer:</span>
                  <span className="font-bold text-stone-800">{selectedTx.buyerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Commodity &amp; Grade:</span>
                  <span className="font-bold text-stone-800">{selectedTx.cropName} (Grade A)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Total Weighed Quantity:</span>
                  <span className="font-bold text-stone-800">{selectedTx.quantityQuintals} Quintals</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Agreed Mandi Rate:</span>
                  <span className="font-bold text-stone-800">₹{selectedTx.pricePerQ} / Quintal</span>
                </div>

                {/* Financial Arithmetic Breakdown */}
                <div className="pt-2 space-y-1.5 bg-stone-50 p-3 rounded-2xl">
                  <div className="flex justify-between font-bold text-stone-800">
                    <span>1. Gross Sales Realisation:</span>
                    <span>₹{selectedTx.grossAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>2. Less: Freight &amp; Transport:</span>
                    <span>- ₹{selectedTx.transportCost.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>3. Less: Storage &amp; Handling:</span>
                    <span>- ₹{selectedTx.storageAndHandlingCost.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>4. Less: Mandi Market Cess (1%):</span>
                    <span>- ₹{selectedTx.mandiTaxes.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="pt-2 border-t border-stone-300 flex justify-between font-black text-sm text-emerald-950">
                    <span>Net Bank Deposit:</span>
                    <span className="text-emerald-700 text-base">
                      ₹{selectedTx.netRealisation.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 border border-emerald-200">
                  <span className="font-bold">Settlement Mode: </span>
                  {selectedTx.paymentMethod} • Status:{" "}
                  <strong className="text-emerald-700">{selectedTx.paymentStatus}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-stone-500">
              Select a transaction to view digital receipt
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
