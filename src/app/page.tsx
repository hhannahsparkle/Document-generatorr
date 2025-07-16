"use client"

import { useState } from "react"
import { TemplateSelector } from "@/components/template-selector"
import { SimpleForm } from "@/components/simple-form"
import { DocumentPreview } from "@/components/document-preview"

type AppState = "templates" | "form" | "preview"

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>("templates")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [documentType, setDocumentType] = useState<"word" | "excel">("word")
  const [documentData, setDocumentData] = useState<any>(null)

  const handleSelectTemplate = (template: any, type: "word" | "excel") => {
    setSelectedTemplate(template)
    setDocumentType(type)
    setCurrentState("form")
  }

  const handleFormSubmit = (data: any) => {
    setDocumentData(data)
    setCurrentState("preview")
  }

  const handleBack = () => {
    if (currentState === "preview") {
      setCurrentState("form")
    } else if (currentState === "form") {
      setCurrentState("templates")
      setSelectedTemplate(null) // Reset selected template when going back to templates
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Office Document Generator</h1>
            <p className="text-gray-600 mt-2 text-lg">Create Professional MS Word & Excel Documents</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Word Documents
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Excel Spreadsheets
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {currentState === "templates" && (
          <TemplateSelector onSelectTemplate={handleSelectTemplate} />
        )}

        {currentState === "form" && selectedTemplate && (
          <SimpleForm
            template={selectedTemplate}
            type={documentType}
            onSubmit={handleFormSubmit}
            onCancel={handleBack}
          />
        )}

        {currentState === "preview" && documentData && (
          <DocumentPreview data={documentData} onBack={handleBack} />
        )}
      </div>
    </div>
  )
}