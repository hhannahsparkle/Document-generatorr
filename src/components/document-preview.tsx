"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Copy, ArrowLeft, FileText, Table } from 'lucide-react'
import type { LetterData, InvoiceData, TableRow, InvoiceItem } from "../types/document"

interface DocumentPreviewProps {
    data: any // This will contain all form data
    onBack: () => void
}

export function DocumentPreview({ data, onBack }: DocumentPreviewProps) {
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

    const generateWordContent = (data: any) => {
        let content = ""

        // Header
        content += `${data.template.name}\n\n`
        content += `Date: ${formatDate(data.date)}\n\n`

        // Recipient Info (for letters and invoices)
        if (data.recipientName) {
            content += `${data.recipientName}\n`
            content += `${data.recipientCompany}\n`
            content += `${data.recipientAddress}\n\n`
            content += `Attention: ${data.recipientName}\n\n`
        } else if (data.clientName) { // For invoices where clientName is used
            content += `${data.clientName}\n`
            content += `${data.recipientCompany || ''}\n` // Use recipientCompany for client company
            content += `${data.clientAddress}\n\n`
        }

        // Subject (for letters)
        if (data.subject) {
            content += `Subject: ${data.subject}\n\n`
            content += `Dear Sir,\n\n`
        }

        // Main Content (for letters)
        if (data.content) {
            content += `${data.content}\n\n`
        }

        // Table Data (for letters)
        if (data.tableData && data.tableData.length > 0) {
            content += `\nTable Data:\n`
            content += `Company\tCheque No.\tType\tPolicy No.\tAmount\n`
            data.tableData.forEach((row: TableRow) => {
                content += `${row.company}\t${row.chequeNo}\t${row.type}\t${row.policyNo}\t${row.amount}\n`
            })
            content += `\n`
        }

        // Invoice Items (for Word invoices)
        if (data.items && data.items.length > 0) {
            content += `\nInvoice Items:\n`
            content += `Description\tQuantity\tRate\tAmount\n`
            data.items.forEach((item: InvoiceItem) => {
                content += `${item.description}\t${item.quantity}\t${item.rate}\t${item.amount}\n`
            })
            const total = data.items.reduce((sum: number, item: InvoiceItem) => sum + item.amount, 0)
            content += `\nTotal: ${formatCurrency(total)}\n`
        }

        // Footer
        content += `\nKindly acknowledge receipt.\n\n` // Common closing for letters
        content += `Yours truly\n`
        content += `${data.senderTitle}\n`
        content += `${data.senderCompany}\n`

        return content
    }

    const generateExcelContent = (data: any) => {
        let content = ""

        // Header for Excel
        content += `${data.title}\n`
        content += `Date: ${formatDate(data.date)}\n`
        content += `Company: ${data.companyName}\n\n`

        // Specific Excel template headers and data
        if (data.template.id === "invoice-excel") {
            content += `Invoice No.: ${data.invoiceNo}\n`
            content += `Client Name: ${data.clientName}\n`
            content += `Due Date: ${formatDate(data.dueDate)}\n\n`
            content += `Description\tQuantity\tRate\tAmount\n`
            data.rows.forEach((row: InvoiceItem) => {
                content += `${row.description}\t${row.quantity}\t${row.rate}\t${row.amount}\n`
            })
            const total = data.rows.reduce((sum: number, row: InvoiceItem) => sum + row.amount, 0)
            content += `\nTotal: ${formatCurrency(total)}\n`
        } else if (data.template.id === "insurance-records") {
            content += `Cover Note No.\tClient Name\tBusiness Class\tAmount\tStatus\n`
            data.rows.forEach((row: any) => { // Assuming 'any' for simplicity, but should be specific type
                content += `${row.coverNoteNo}\t${row.clientName}\t${row.businessClass}\t${row.amount}\t${row.status}\n`
            })
        } else {
            // Generic Excel rows
            if (data.rows && data.rows.length > 0) {
                // Assuming headers are keys of the first row
                const headers = Object.keys(data.rows[0]).join('\t')
                content += `${headers}\n`
                data.rows.forEach((row: any) => {
                    content += `${Object.values(row).join('\t')}\n`
                })
            }
        }

        return content
    }

    const handleDownload = () => {
        let content = ""
        let filename = ""
        let mimeType = ""

        if (data.type === "word") {
            content = generateWordContent(data)
            filename = `${data.template.name.replace(/\s/g, '-')}.txt` // .docx is complex, so providing .txt for copy-paste
            mimeType = "text/plain"
        } else { // excel
            content = generateExcelContent(data)
            filename = `${data.template.name.replace(/\s/g, '-')}.txt` // .xlsx is complex, so providing .txt for copy-paste
            mimeType = "text/plain"
        }

        const blob = new Blob([content], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        alert(`File "${filename}" downloaded. You can open it with MS ${data.type === "word" ? "Word" : "Excel"} and save as .docx/.xlsx.`)
    }

    const copyToClipboard = () => {
        const content = data.type === "word" ? generateWordContent(data) : generateExcelContent(data)
        navigator.clipboard.writeText(content)
        alert(`Content copied to clipboard! You can now paste it into MS ${data.type === "word" ? "Word" : "Excel"}.`)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <Button onClick={onBack} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Content
                    </Button>
                    <Button onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download .txt
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

                        {/* Recipient / Client Info */}
                        {(data.recipientName || data.clientName) && (
                            <div className="space-y-1">
                                <p className="font-medium">{data.recipientName || data.clientName}</p>
                                <p className="font-medium">{data.recipientCompany}</p>
                                <div className="whitespace-pre-line text-sm">{data.recipientAddress || data.clientAddress}</div>
                            </div>
                        )}

                        {/* Attention Line */}
                        {data.recipientName && (
                            <div>
                                <p className="font-medium">Attention: {data.recipientName}</p>
                            </div>
                        )}

                        {/* Subject */}
                        {data.subject && (
                            <div>
                                <p className="font-medium underline">Subject: {data.subject}</p>
                            </div>
                        )}

                        {/* Salutation */}
                        {data.subject && (
                            <div>
                                <p>Dear Sir,</p>
                            </div>
                        )}

                        {/* Content */}
                        {data.content && (
                            <div className="whitespace-pre-line">{data.content}</div>
                        )}

                        {/* Table for Letters */}
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
                                                <td className="border border-black px-3 py-2 text-right">{formatCurrency(row.amount)}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="border border-black px-3 py-2 font-medium" colSpan={4}>Total</td>
                                            <td className="border border-black px-3 py-2 text-right font-medium">
                                                {formatCurrency(data.tableData.reduce((sum: number, row: TableRow) => sum + row.amount, 0))}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Invoice Items for Word Invoices */}
                        {data.items && data.items.length > 0 && data.template.type === "invoice" && data.type === "word" && (
                            <div className="my-6">
                                <h4 className="font-semibold mb-2">Invoice Items:</h4>
                                <table className="w-full border-collapse border border-black text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-black px-3 py-2 text-left font-medium">Description</th>
                                            <th className="border border-black px-3 py-2 text-left font-medium">Qty</th>
                                            <th className="border border-black px-3 py-2 text-left font-medium">Rate (Rs.)</th>
                                            <th className="border border-black px-3 py-2 text-right font-medium">Amount (Rs.)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.items.map((item: InvoiceItem, index: number) => (
                                            <tr key={index}>
                                                <td className="border border-black px-3 py-2">{item.description}</td>
                                                <td className="border border-black px-3 py-2">{item.quantity}</td>
                                                <td className="border border-black px-3 py-2">{formatCurrency(item.rate)}</td>
                                                <td className="border border-black px-3 py-2 text-right">{formatCurrency(item.amount)}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="border border-black px-3 py-2 font-medium" colSpan={3}>Total</td>
                                            <td className="border border-black px-3 py-2 text-right font-medium">
                                                {formatCurrency(data.items.reduce((sum: number, item: InvoiceItem) => sum + item.amount, 0))}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Closing */}
                        <div className="space-y-4 mt-8">
                            {data.subject && <p>Kindly acknowledge receipt.</p>} {/* Only for letters */}

                            <div className="space-y-2">
                                <p>Yours truly</p>
                                <p>{data.senderTitle}</p>
                                <p className="font-medium">{data.senderName}</p>
                                <p className="font-medium">{data.senderCompany}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Click "Download .txt" to get a text file.</li>
                    <li>• Open the downloaded text file.</li>
                    <li>• **Copy all content** from the text file.</li>
                    <li>• Open a **new blank document** in MS {data.type === "word" ? "Word" : "Excel"}.</li>
                    <li>• **Paste** the copied content into MS {data.type === "word" ? "Word" : "Excel"}.</li>
                    <li>• You can then apply desired formatting (fonts, colors, borders) in MS {data.type === "word" ? "Word" : "Excel"} and save it as a `.docx` or `.xlsx` file.</li>
                </ul>
            </div>
        </div>
    )
}