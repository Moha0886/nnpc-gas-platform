// CSV Import/Export Utilities

import Papa from "papaparse";
import { saveAs } from "file-saver";

// CSV Templates for each data type
export const CSV_TEMPLATES = {
  production: {
    filename: "production_upload_template.csv",
    headers: ["Date", "Station", "Corridor", "Oil (bopd)", "Gas (MMscf/d)", "Condensate (bopd)", "Water (bopd)", "BSW (%)", "Remarks"],
    sample: [
      ["2026-07-15", "Escravos Gas Plant", "Eastern", "5230", "450.5", "320", "850", "14.2", "Normal operations"],
      ["2026-07-15", "Oben Gas Plant", "Eastern", "3850", "380.2", "280", "620", "13.8", ""],
    ],
  },
  nominations: {
    filename: "nominations_upload_template.csv",
    headers: ["Date", "Customer", "Corridor", "DCQ (MMscf/d)", "Nominated (MMscf/d)", "Confirmed (MMscf/d)", "Status", "Remarks"],
    sample: [
      ["2026-07-15", "Egbin Power Station", "Lagos", "125.0", "118.5", "118.5", "Confirmed", ""],
      ["2026-07-15", "Geregu Power Plant", "Northern", "85.0", "75.0", "75.0", "Confirmed", "Reduced due to maintenance"],
    ],
  },
  flows: {
    filename: "flows_upload_template.csv",
    headers: ["Date", "Pipeline", "Corridor", "Inlet Pressure (PSI)", "Outlet Pressure (PSI)", "Flow Rate (MMscf/d)", "Temperature (°C)", "Status", "Remarks"],
    sample: [
      ["2026-07-15", "ELPS", "Eastern", "1233", "1050", "850.5", "28", "Operational", ""],
      ["2026-07-15", "OB3", "Eastern", "1305", "1200", "720.3", "26", "Operational", ""],
    ],
  },
  deliveries: {
    filename: "deliveries_upload_template.csv",
    headers: ["Date", "Customer", "Corridor", "Contracted (MMscf/d)", "Delivered (MMscf/d)", "Shortfall (MMscf/d)", "Revenue (₦)", "Status", "Remarks"],
    sample: [
      ["2026-07-15", "Egbin Power Station", "Lagos", "125.0", "118.5", "6.5", "25850000", "Delivered", ""],
      ["2026-07-15", "Dangote Industries", "Lagos", "65.0", "65.0", "0.0", "28275000", "Delivered", ""],
    ],
  },
  flare: {
    filename: "flare_upload_template.csv",
    headers: ["Date", "Station", "Corridor", "Gas Produced (MMscf/d)", "Gas Utilized (MMscf/d)", "Gas Flared (MMscf/d)", "Flare Rate (%)", "Reason", "Remarks"],
    sample: [
      ["2026-07-15", "Escravos", "Eastern", "480.5", "450.5", "30.0", "6.2", "Planned maintenance", "Compressor offline"],
      ["2026-07-15", "Oben", "Eastern", "400.2", "380.2", "20.0", "5.0", "Operational constraint", ""],
    ],
  },
  deferment: {
    filename: "deferment_upload_template.csv",
    headers: ["Date", "Station/Pipeline", "Corridor", "Planned (MMscf/d)", "Actual (MMscf/d)", "Deferred (MMscf/d)", "Reason", "Category", "Remarks"],
    sample: [
      ["2026-07-15", "Trans-Niger Pipeline", "Eastern", "350.0", "285.2", "64.8", "Pipeline vandalism", "Security", "Hot tap at KP 125"],
      ["2026-07-15", "Bonny Plant", "Eastern", "2500.0", "2450.0", "50.0", "Compressor failure", "Maintenance", "CS-02 bearing replacement"],
    ],
  },
};

// Download CSV template
export const downloadTemplate = (templateType: keyof typeof CSV_TEMPLATES) => {
  const template = CSV_TEMPLATES[templateType];
  const csv = Papa.unparse({
    fields: template.headers,
    data: template.sample,
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, template.filename);
};

// Export data to CSV
export const exportToCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
};

// Parse CSV file
export const parseCSVFile = (
  file: File
): Promise<{ data: any[]; errors: any[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve({
          data: results.data,
          errors: results.errors,
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

// Detect duplicates in uploaded data
export interface DuplicateRecord {
  row: number;
  date: string;
  station?: string;
  customer?: string;
  pipeline?: string;
  [key: string]: any;
}

export const detectDuplicates = (
  uploadedData: any[],
  existingData: any[],
  identifierFields: string[]
): DuplicateRecord[] => {
  const duplicates: DuplicateRecord[] = [];

  uploadedData.forEach((uploadedRow, index) => {
    const isDuplicate = existingData.some((existingRow) => {
      return identifierFields.every(
        (field) =>
          String(uploadedRow[field]).toLowerCase() ===
          String(existingRow[field]).toLowerCase()
      );
    });

    if (isDuplicate) {
      duplicates.push({
        row: index + 2, // +2 because: +1 for header row, +1 for 1-based indexing
        ...uploadedRow,
      });
    }
  });

  return duplicates;
};

// Validate uploaded data
export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

export const validateData = (
  data: any[],
  requiredFields: string[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  data.forEach((row, index) => {
    requiredFields.forEach((field) => {
      if (
        row[field] === null ||
        row[field] === undefined ||
        row[field] === ""
      ) {
        errors.push({
          row: index + 2, // +2 for header and 1-based indexing
          field,
          message: `${field} is required`,
          value: row[field],
        });
      }
    });
  });

  return errors;
};

// Format date for CSV (YYYY-MM-DD)
export const formatDateForCSV = (date: Date | string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Get template instructions
export const getTemplateInstructions = (templateType: keyof typeof CSV_TEMPLATES) => {
  const instructions: Record<keyof typeof CSV_TEMPLATES, string[]> = {
    production: [
      "Date must be in YYYY-MM-DD format (e.g., 2026-07-15)",
      "Station name must match existing stations in the system",
      "Corridor must be: Eastern, Western, Northern, or Lagos",
      "Numeric values should not include commas or currency symbols",
      "BSW (Basic Sediment and Water) is in percentage",
      "Leave Remarks blank if no comments",
    ],
    nominations: [
      "Date must be in YYYY-MM-DD format",
      "Customer name must match existing customers",
      "DCQ = Daily Contract Quantity",
      "Nominated volume cannot exceed DCQ",
      "Status must be: Pending, Confirmed, or Rejected",
      "All volumes in MMscf/d (Million Standard Cubic Feet per Day)",
    ],
    flows: [
      "Date must be in YYYY-MM-DD format",
      "Pipeline name must match existing pipelines",
      "Pressure values in PSI (Pounds per Square Inch)",
      "Temperature in Celsius",
      "Status must be: Operational, Partial-Outage, or Maintenance",
      "Inlet pressure should be higher than outlet pressure",
    ],
    deliveries: [
      "Date must be in YYYY-MM-DD format",
      "Customer name must match existing customers",
      "Shortfall = Contracted - Delivered",
      "Revenue in Nigerian Naira (₦), no commas",
      "Status must be: Delivered, Partial, or Not Delivered",
      "Delivered cannot exceed Contracted quantity",
    ],
    flare: [
      "Date must be in YYYY-MM-DD format",
      "Station name must match existing stations",
      "Flare Rate % = (Gas Flared / Gas Produced) × 100",
      "Gas Flared = Gas Produced - Gas Utilized",
      "Reason: Planned maintenance, Operational constraint, Emergency, etc.",
      "Target flare rate should be <5% for compliance",
    ],
    deferment: [
      "Date must be in YYYY-MM-DD format",
      "Station/Pipeline name must match existing facilities",
      "Deferred = Planned - Actual",
      "Category: Maintenance, Security, Operational, Technical, Force Majeure",
      "Reason should explain root cause",
      "All volumes in MMscf/d",
    ],
  };

  return instructions[templateType];
};
