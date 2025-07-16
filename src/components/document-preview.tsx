"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, PrinterIcon as Print, Edit, ArrowLeft } from "lucide-react"
import type { LetterData, InvoiceData, TableRow } from "../types/document" // Removed unused imports like CardHeader, CardTitle, Badge, FileText, Table

interface DocumentPreviewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any // Keeping as any for now to resolve build, ideally use a union type
  onEdit: () => void
  onBack: () => void
}

export function DocumentPreview({ data, onEdit, onBack }: DocumentPreviewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real application, you would generate a PDF here
    alert("PDF download functionality would be implemented here")
  }

  // Type guard to check if data is LetterData
  const isLetterData = (docData: LetterData | InvoiceData): docData is LetterData => {
    return (docData as LetterData).recipientName !== undefined
  }

  const totalAmount =
    isLetterData(data) && data.tableData ? data.tableData.reduce((sum, row) => sum + row.amount, 0) : 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={onEdit} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Print className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Document Preview */}
      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-12 bg-white">
          <div className="space-y-6 text-black">
            {/* Date */}
            <div className="text-right">
              <p className="text-sm">{formatDate(data.date)}</p>
            </div>

            {isLetterData(data) ? (
              <>
                {/* Recipient */}
                <div className="space-y-1">
                  <p className="font-medium">{data.recipientName}</p>
                  <p className="font-medium">{data.recipientCompany}</p>
                  <div className="whitespace-pre-line text-sm">{data.recipientAddress}</div>
                </div>

                {/* Attention Line */}
                <div>
                  <p>
                    {"Attention: "}
                    {data.recipientName}
                  </p>
                </div>

                {/* Subject */}
                <div>
                  <p>
                    {"Subject: "}
                    {data.subject}
                  </p>
                </div>

                {/* Salutation */}
                <div>
                  <p>Dear Sir,</p>
                </div>

                {/* Content */}
                <div className="whitespace-pre-line">{data.content}</div>

                {/* Table */}
                {data.tableData && data.tableData.length > 0 && (
                  <div className="my-6">
                    <table className="w-full border-collapse border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black px-3 py-2 text-left font-medium">Company</th>
                          <th className="border border-black px-3 py-2 text-left font-medium">Cheque no.</th>
                          <th className="border border-black px-3 py-2 text-left font-medium">Type</th>
                          <th className="border border-black px-3 py-2 text-left font-medium">Policy No.</th>
                          <th className="border border-black px-3 py-2 text-right font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.tableData.map((row: TableRow, index: number) => (
                          <tr key={index}>
                            <td className="border border-black px-3 py-2">{row.company}</td>
                            <td className="border border-black px-3 py-2">{row.chequeNo}</td>
                            <td className="border border-black px-3 py-2">{row.type}</td>
                            <td className="border border-black px-3 py-2">{row.policyNo}</td>
                            <td className="border border-black px-3 py-2 text-right">{row.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                        {/* Additional rows for vehicles if needed */}
                        <tr>
                          <td className="border border-black px-3 py-2" colSpan={4}>
                            Vehicles
                          </td>
                          <td className="border border-black px-3 py-2 text-right font-medium">
                            {totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Closing */}
                <div className="space-y-4 mt-8">
                  <p>Kindly acknowledge receipt.</p>

                  <div className="space-y-2">
                    <p>Yours truly</p>
                    <p>{data.senderTitle}</p>
                    <p className="font-medium">{data.senderCompany}</p>
                  </div>
                </div>
              </>
            ) : (
              // Placeholder for InvoiceData preview if needed
              <div>
                <h3 className="text-xl font-semibold">Invoice Preview</h3>
                <p>
                  {"Invoice No: "}
                  {data.invoiceNo}
                </p>
                <p>
                  {"Client: "}
                  {data.clientName}
                </p>
                {/* Add more invoice details here */}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
