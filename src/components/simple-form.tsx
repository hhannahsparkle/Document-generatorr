"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, FileText } from "lucide-react" // Added Table import

interface SimpleFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void
  onCancel: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SimpleForm({ template, onSubmit, onCancel }: SimpleFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({
    // Basic fields
    date: new Date().toISOString().split("T")[0],
    recipientName: "",
    recipientCompany: "",
    recipientAddress: "",
    subject: "",
    content: "",
    senderName: "",
    senderTitle: "",
    senderCompany: "",

    // Table data for letters
    tableData: [],

    // Invoice specific
    invoiceNo: "",
    dueDate: "",
    items: [],

    // Agreement specific
    partyA: "",
    partyB: "",
    terms: "",
  })

  const addTableRow = () => {
    setFormData({
      ...formData,
      tableData: [
        ...formData.tableData,
        {
          company: "",
          chequeNo: "",
          type: "",
          policyNo: "",
          amount: 0,
        },
      ],
    })
  }

  const addInvoiceItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ],
    })
  }

  const updateTableRow = (index: number, field: string, value: any) => {
    const updatedRows = [...formData.tableData]
    updatedRows[index] = { ...updatedRows[index], [field]: value }
    setFormData({ ...formData, tableData: updatedRows })
  }

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Auto calculate amount
    if (field === "quantity" || field === "rate") {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
    }

    setFormData({ ...formData, items: updatedItems })
  }

  const removeTableRow = (index: number) => {
    const updatedRows = formData.tableData.filter((_: any, i: number) => i !== index)
    setFormData({ ...formData, tableData: updatedRows })
  }

  const removeInvoiceItem = (index: number) => {
    const updatedItems = formData.items.filter((_: any, i: number) => i !== index)
    setFormData({ ...formData, items: updatedItems })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, template })
  }

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
            placeholder="3rd Floor, Azayam Plaza, Karachi"
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
            placeholder="Insurance 3rd Installment and Complete Payment"
            required
          />
        </div>
        <div>
          <Label htmlFor="content">Letter Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="With reference below mentioned policies..."
            rows={4}
            required
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Table Data</h3>
          <Button type="button" onClick={addTableRow} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
        </div>

        {formData.tableData.length > 0 && (
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
                {formData.tableData.map((row: any, index: number) => (
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

      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recipientName">Client Name</Label>
            <Input
              id="recipientName"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
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
          <Label htmlFor="recipientAddress">Client Address</Label>
          <Textarea
            id="recipientAddress"
            value={formData.recipientAddress}
            onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
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
                  <th className="px-4 py-2 text-left text-sm font-semibold">Rate</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Amount</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item: any, index: number) => (
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
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateInvoiceItem(index, "rate", Number(e.target.value))}
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            {template.name} - Word Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
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
            {template.type === "letter" && renderLetterFields()}
            {template.type === "invoice" && renderInvoiceFields()}

            {/* Sender Information */}
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
                    placeholder="Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="senderCompany">Your Company</Label>
                  <Input
                    id="senderCompany"
                    value={formData.senderCompany}
                    onChange={(e) => setFormData({ ...formData, senderCompany: e.target.value })}
                    placeholder="Your Company Name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Generate Word Document
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
