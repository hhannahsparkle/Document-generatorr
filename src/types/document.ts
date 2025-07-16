export interface DocumentTemplate {
    id: string
    name: string
    type: "letter" | "invoice" | "insurance" | "report" | "certificate"
    category: string
    description: string
}

export interface LetterData {
    date: string
    recipientName: string
    recipientCompany: string
    recipientAddress: string
    subject: string
    content: string
    senderName: string
    senderTitle: string
    senderCompany: string
    tableData?: TableRow[]
}

export interface TableRow {
    company: string
    chequeNo: string
    type: string
    policyNo: string
    amount: number
}

export interface InvoiceData {
    invoiceNo: string
    date: string
    dueDate: string
    clientName: string
    clientAddress: string
    items: InvoiceItem[]
    taxRate: number
    notes: string
}

export interface InvoiceItem {
    description: string
    quantity: number
    rate: number
    amount: number
}