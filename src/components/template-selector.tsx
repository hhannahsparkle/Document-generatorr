"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Table, Download, FileSpreadsheet } from 'lucide-react'
import type { DocumentTemplate } from "../types/document" // Import type from your types folder

interface TemplateSelectorProps {
    onSelectTemplate: (template: DocumentTemplate, type: "word" | "excel") => void
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
    const wordTemplates: DocumentTemplate[] = [
        {
            id: "business-letter",
            name: "Business Letter",
            type: "letter",
            category: "Communication",
            description: "Professional business correspondence with letterhead",
        },
        {
            id: "insurance-letter",
            name: "Insurance Payment Letter",
            type: "letter",
            category: "Insurance",
            description: "Insurance installment and payment notification",
        },
        {
            id: "invoice-word",
            name: "Invoice Document",
            type: "invoice",
            category: "Finance",
            description: "Professional invoice with company branding",
        },
    ]

    const excelTemplates: DocumentTemplate[] = [
        {
            id: "invoice-excel",
            name: "Invoice Spreadsheet",
            type: "invoice",
            category: "Finance",
            description: "Detailed invoice with automatic calculations",
        },
        {
            id: "insurance-records",
            name: "Insurance Records",
            type: "report",
            category: "Insurance",
            description: "Insurance policy tracking and management",
        },
    ]

    const getIcon = (type: string) => {
        switch (type) {
            case "letter":
                return FileText
            case "invoice":
                return Table // Using Table icon for invoice in Excel context
            case "insurance":
                return FileSpreadsheet // Using FileSpreadsheet for insurance in Excel context
            case "report":
                return FileText // Using FileText for report in Word context
            default:
                return FileText
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Document Type</h2>
                <p className="text-gray-600">Select Word or Excel template to generate your document</p>
            </div>

            {/* Word Templates */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">MS Word Documents</h3>
                    <Badge className="bg-blue-100 text-blue-800">Professional Letters & Reports</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wordTemplates.map((template) => {
                        const IconComponent = getIcon(template.type)
                        return (
                            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <IconComponent className="w-8 h-8 text-blue-600" />
                                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                                            Word
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg">{template.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                                    <Button
                                        onClick={() => onSelectTemplate(template, "word")}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Create Word Doc
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Excel Templates */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">MS Excel Spreadsheets</h3>
                    <Badge className="bg-green-100 text-green-800">Data & Calculations</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {excelTemplates.map((template) => {
                        const IconComponent = getIcon(template.type)
                        return (
                            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <IconComponent className="w-8 h-8 text-green-600" />
                                        <Badge variant="outline" className="text-green-600 border-green-200">
                                            Excel
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg">{template.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                                    <Button
                                        onClick={() => onSelectTemplate(template, "excel")}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Create Excel File
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}