"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from 'lucide-react'
import type { LetterData, TableRow, InvoiceData, InvoiceItem } from "../types/document"

interface SimpleFormProps {
    template: any
    type: "word" | "excel"
    onSubmit: (data: any) => void
    onCancel: () => void
}

export function SimpleForm({ template, type, onSubmit, onCancel }: SimpleFormProps) {
    const [formData, setFormData] = useState<any>({
        // Common fields
        date: new Date().toISOString().split("T")[0],
        senderName: "",
        senderCompany: "",
        senderTitle: "", // Added senderTitle for letters

        // Letter specific fields
        recipientName: "",
        recipientCompany: "",
        recipientAddress: "",
        subject: "",
        content: "",
        tableData: [] as TableRow[], // For letter tables

        // Invoice specific fields (for both Word and Excel invoices)
        invoiceNo: "",
        dueDate: "",
        clientName: "", // Used as recipientName for invoices
        clientAddress: "", // Used as recipientAddress for invoices
        items: [] as InvoiceItem[], // For invoice items
        taxRate: 0,
        notes: "",

        // Excel specific general fields
        title: "", // For general Excel sheets
        companyName: "", // For general Excel sheets
        rows: [] as any[], // For general Excel data rows
    })

    // --- Table/Item Management Functions ---
    const addTableRow = () => {
        setFormData({
            ...formData,
            tableData: [
                ...formData.tableData,
                { company: "", chequeNo: "", type: "", policyNo: "", amount: 0 },
            ],
        })
    }

    const updateTableRow = (index: number, field: keyof TableRow, value: any) => {
        const updatedRows = [...formData.tableData]
        updatedRows[index] = { ...updatedRows[index], [field]: value }
        setFormData({ ...formData, tableData: updatedRows })
    }

    const removeTableRow = (index: number) => {
        const updatedRows = formData.tableData.filter((_, i) => i !== index)
        setFormData({ ...formData, tableData: updatedRows })
    }

    const addInvoiceItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                { description: "", quantity: 1, rate: 0, amount: 0 },
            ],
        })
    }

    const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: any) => {
        const updatedItems = [...formData.items]
        updatedItems[index] = { ...updatedItems[index], [field]: value }

        // Auto calculate amount
        if (field === "quantity" || field === "rate") {
            updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
        }

        setFormData({ ...formData, items: updatedItems })
    }

    const removeInvoiceItem = (index: number) => {
        const updatedItems = formData.items.filter((_, i) => i !== index)
        setFormData({ ...formData, items: updatedItems })
    }

    const addExcelRow = () => {
        let newRow: any = {}
        if (template.id === "invoice-excel") {
            newRow = { description: "", quantity: 1, rate: 0, amount: 0 }
        } else if (template.id === "insurance-records") {
            newRow = { coverNoteNo: "", clientName: "", businessClass: "", amount: 0, status: "Active" }
        } else {
            newRow = { col1: "", col2: "", col3: "" } // Generic row for other excel types
        }
        setFormData({ ...formData, rows: [...formData.rows, newRow] })
    }

    const updateExcelRow = (index: number, field: string, value: any) => {
        const updatedRows = [...formData.rows]
        updatedRows[index] = { ...updatedRows[index], [field]: value }

        // Auto calculations for Excel invoice
        if (template.id === "invoice-excel" && (field === "quantity" || field === "rate")) {
            updatedRows[index].amount = updatedRows[index].quantity * updatedRows[index].rate
        }
        setFormData({ ...formData, rows: updatedRows })
    }

    const removeExcelRow = (index: number) => {
        const updatedRows = formData.rows.filter((_, i) => i !== index)
        setFormData({ ...formData, rows: updatedRows })
    }

    // --- Form Submission ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    // --- Render Functions for different template types ---
    const renderLetterFields = () => (
        <>
            {/* Recipient Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recipient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="recipientName">Recipient Name</Label>
                        <Input
                            id="recipientName"
                            value={formData.recipientName}
                            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                            placeholder="Mr. Amees / Miss. Uzma"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="recipientCompany">Company</Label>
                        <Input
                            id="recipientCompany"
                            value={formData.recipientCompany}
                            onChange={(e) => setFormData({ ...formData, recipientCompany: e.target.value })}
                            placeholder="Habib Risk Consultant (Pvt.) Ltd."
                            required
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="recipientAddress">Address</Label>
                    <Textarea
                        id="recipientAddress"
                        value={formData.recipientAddress}
                        onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                        placeholder="3rd Floor, Azayam Plaza, S/A.S.M.C.H.S Shahrah-e-Faisal, Karachi"
                        rows={3}
                        required
                    />
                </div>
            </div>

            {/* Letter Content */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Letter Content</h3>
                <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Insurance 3rd Installment and Complete Payment for policies below Rs. 35,000"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="content">Letter Body</Label>
                    <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="With reference below mentioned policies, please find the attached cheques of installment for Insurance Year 2024 - 25."
                        rows={4}
                        required
                    />
                </div>
            </div>

            {/* Table Data for Letters */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Table Data (Optional)</h3>
                    <Button type="button" onClick={addTableRow} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Row
                    </Button>
                </div>

                {formData.tableData && formData.tableData.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Company</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Cheque No.</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Policy No.</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Amount</th>
                                    <th className="px-4 py-2 text-center text-sm font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.tableData.map((row: TableRow, index: number) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2">
                                            <Input
                                                value={row.company}
                                                onChange={(e) => updateTableRow(index, "company", e.target.value)}
                                                placeholder="SEALOG (PVT) LTD."
                                                size="sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                value={row.chequeNo}
                                                onChange={(e) => updateTableRow(index, "chequeNo", e.target.value)}
                                                placeholder="60395457"
                                                size="sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                value={row.type}
                                                onChange={(e) => updateTableRow(index, "type", e.target.value)}
                                                placeholder="Private"
                                                size="sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                value={row.policyNo}
                                                onChange={(e) => updateTableRow(index, "policyNo", e.target.value)}
                                                placeholder="2024/08/HRCVPCDT000031"
                                                size="sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number"
                                                value={row.amount}
                                                onChange={(e) => updateTableRow(index, "amount", Number(e.target.value))}
                                                placeholder="16121"
                                                size="sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <Button
                                                type="button"
                                                onClick={() => removeTableRow(index)}
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )

    const renderInvoiceFields = () => (
        <>
            {/* Invoice Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="invoiceNo">Invoice Number</Label>
                        <Input
                            id="invoiceNo"
                            value={formData.invoiceNo}
                            onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                            placeholder="INV-001"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="date">Invoice Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Client Information (using recipient fields) */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input
                            id="clientName"
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            placeholder="Client Name"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="recipientCompany">Client Company</Label>
                        <Input
                            id="recipientCompany"
                            value={formData.recipientCompany}
                            onChange={(e) => setFormData({ ...formData, recipientCompany: e.target.value })}
                            placeholder="Company Name"
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="clientAddress">Client Address</Label>
                    <Textarea
                        id="clientAddress"
                        value={formData.clientAddress}
                        onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                        placeholder="Client Address"
                        rows={3}
                        required
                    />
                </div>
            </div>

            {/* Invoice Items */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Invoice Items</h3>
                    <Button type="button" onClick={addInvoiceItem} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                    </Button>
                </div>

                {formData.items.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Description</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Qty</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Rate (Rs.)</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Amount (Rs.)</th>
                                    <th className="px-4 py-2 text-center text-sm font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.map((item: InvoiceItem, index: number) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2">
                                            <Input
                                                value={item.description}
                                                onChange={(e) => updateInvoiceItem(index, "description", e.target.value)}
                                                placeholder="Service/Product Description"
                                                size="sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateInvoiceItem(index, "quantity", Number(e.target.value))}
                                                placeholder="1"
                                                size="sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number"
                                                value={item.rate}
                                                onChange={(e) => updateInvoiceItem(index, "rate", Number(e.target.value))}
                                                placeholder="1000"
                                                size="sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input type="number" value={item.amount} readOnly className="bg-gray-50" size="sm" />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <Button
                                                type="button"
                                                onClick={() => removeInvoiceItem(index)}
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )

    const renderExcelTableFields = () => (
        <>
            {/* General Excel Fields */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Spreadsheet Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="title">Document Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Insurance Records Report"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                            id="companyName"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            placeholder="IGI General Insurance Limited"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Dynamic Table for Excel */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Data Rows</h3>
                    <Button type="button" onClick={addExcelRow} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Row
                    </Button>
                </div>

                {formData.rows.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                                {template.id === "invoice-excel" && (
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">Description</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">Qty</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">Rate (Rs.)</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">Amount (Rs.)</th>
                                        <th className="px-4 py-2 text-center text-sm font-semibold">Action</th>
                                    </tr>
                                )}
                                {template.id === "insurance-records" && (
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">Cover Note No.</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">Client Name</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">Business Class</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">Amount (Rs.)</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                                        <th className="px-4 py-2 text-center text-sm font-semibold">Action</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {formData.rows.map((row: any, index: number) => (
                                    <tr key={index} className="border-t">
                                        {template.id === "invoice-excel" && (
                                            <>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        value={row.description}
                                                        onChange={(e) => updateExcelRow(index, "description", e.target.value)}
                                                        placeholder="Service/Product"
                                                        size="sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        type="number"
                                                        value={row.quantity}
                                                        onChange={(e) => updateExcelRow(index, "quantity", Number(e.target.value))}
                                                        size="sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        type="number"
                                                        value={row.rate}
                                                        onChange={(e) => updateExcelRow(index, "rate", Number(e.target.value))}
                                                        size="sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Input type="number" value={row.amount} readOnly className="bg-gray-50" size="sm" />
                                                </td>
                                            </>
                                        )}
                                        {template.id === "insurance-records" && (
                                            <>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        value={row.coverNoteNo}
                                                        onChange={(e) => updateExcelRow(index, "coverNoteNo", e.target.value)}
                                                        placeholder="2025/06/HRCVPCDT00029"
                                                        size="sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        value={row.clientName}
                                                        onChange={(e) => updateExcelRow(index, "clientName", e.target.value)}
                                                        placeholder="Client Name"
                                                        size="sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        value={row.businessClass}
                                                        onChange={(e) => updateExcelRow(index, "businessClass", e.target.value)}
                                                        placeholder="Private Car (Comprehensive)"
                                                        size="sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        type="number"
                                                        value={row.amount}
                                                        onChange={(e) => updateExcelRow(index, "amount", Number(e.target.value))}
                                                        size="sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        value={row.status}
                                                        onChange={(e) => updateExcelRow(index, "status", e.target.value)}
                                                        placeholder="Active"
                                                        size="sm"
                                                    />
                                                </td>
                                            </>
                                        )}
                                        <td className="px-4 py-2 text-center">
                                            <Button
                                                type="button"
                                                onClick={() => removeExcelRow(index)}
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {formData.rows.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <Table className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No data rows added yet. Click "Add Row" to start.</p>
                    </div>
                )}
            </div>
        </>
    )

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {template.name} - {type === "word" ? "Word Document" : "Excel Spreadsheet"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Common Fields: Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Conditional Fields based on template type */}
                        {type === "word" && template.type === "letter" && renderLetterFields()}
                        {type === "word" && template.type === "invoice" && renderInvoiceFields()}
                        {type === "excel" && renderExcelTableFields()}

                        {/* Sender Information (Common for all) */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Your Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="senderName">Your Name</Label>
                                    <Input
                                        id="senderName"
                                        value={formData.senderName}
                                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="senderTitle">Your Title</Label>
                                    <Input
                                        id="senderTitle"
                                        value={formData.senderTitle}
                                        onChange={(e) => setFormData({ ...formData, senderTitle: e.target.value })}
                                        placeholder="For and On Behalf of"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="senderCompany">Your Company</Label>
                                    <Input
                                        id="senderCompany"
                                        value={formData.senderCompany}
                                        onChange={(e) => setFormData({ ...formData, senderCompany: e.target.value })}
                                        placeholder="Mega & Forbes Group of Companies"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <Button type="submit" className="flex-1">
                                Generate {type === "word" ? "Word" : "Excel"} Document
                            </Button>
                            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}