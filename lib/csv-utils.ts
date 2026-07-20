// CSV Import/Export Utilities

import Papa from "papaparse";
import { saveAs } from "file-saver";

// CSV Templates for each data type - ALIGNED WITH ACTUAL NNPC EXCEL REPORTS
export const CSV_TEMPLATES = {
  // DAILY OFFTAKE REPORT (matches "DAILY GAS OFFTAKE REPORT AUGUST XXXX.xlsx")
  deliveries: {
    filename: "daily_offtake_upload_template.csv",
    headers: ["Date", "Region", "Customer Type", "Station", "Allocation (MMscf)", "Offtake (MMscf)", "Pressure", "Remarks", "Megawatts (MW)"],
    sample: [
      ["2026-07-15", "Western", "NPDC Power Customers", "Transcorp Ughelli", "47.6", "51.548", "24", "STATION ON STREAM", "193.54"],
      ["2026-07-15", "Western", "NIPP", "NIPP Olorunsogo", "27", "26.858", "33/31", "STATION ON STREAM", "103.73"],
      ["2026-07-15", "Western", "Independent Power", "Azura Power West Africa", "97.24", "95.004", "53/23", "STATION ON STREAM", "400.24"],
      ["2026-07-15", "Western", "Industrial", "WAPCO Sagamu", "", "0.021", "32/8", "STATION ON STREAM", ""],
    ],
  },
  // WEEKLY SUPPLY REPORT (matches "Weekly MOR gas supply offtake reporting.xlsx")
  production: {
    filename: "weekly_supply_upload_template.csv",
    headers: ["Week", "Producer", "Volume (MMscf)", "Source of Allocation", "Remarks"],
    sample: [
      ["Week 1 (01/07/2026 - 07/07/2026)", "CNL- Escravos", "2310.625", "CNL, NPDC JV", "Normal operations"],
      ["Week 1 (01/07/2026 - 07/07/2026)", "NEPL/NDW Utorogu", "1286.12", "CNL, NPDC JV, NPDC Oredo", ""],
      ["Week 1 (01/07/2026 - 07/07/2026)", "Seplat Oben", "2104.108", "", ""],
      ["Week 1 (01/07/2026 - 07/07/2026)", "AHL", "1905.12", "NPDC JV, CNL, Seplat", ""],
    ],
  },
  // NOMINATIONS (Simplified based on allocation patterns)
  nominations: {
    filename: "nominations_upload_template.csv",
    headers: ["Date", "Offtaker", "Source", "Allocation (MMscf)", "Actual Offtake (MMscf)", "Remarks"],
    sample: [
      ["2026-07-15", "Egbin Power", "CNL, NPDC JV", "852", "720.835", ""],
      ["2026-07-15", "Olorunsogo Power", "CNL, NPDC JV, NPDC Oredo", "3694", "2760.11", ""],
      ["2026-07-15", "Paras Energy", "CNL, NPDC Oredo, Tunu", "1018", "1093.686", ""],
    ],
  },
  // WEEKLY VOLUME & PRESSURE (matches "Weekly MOR volume and pressure reporting.xlsx")
  flows: {
    filename: "weekly_volume_pressure_template.csv",
    headers: ["Week", "Producer", "Avg Volume (MMscf/d)", "Pressure (barg)", "Contractual Pressure Range", "Remarks"],
    sample: [
      ["Week 1 (01/07 - 07/07)", "CNL- Escravos", "330.089", "82.099", "80 - 85", "Volume dropped with slight improved pressure"],
      ["Week 1 (01/07 - 07/07)", "NEPL/NDW Utorogu", "183.731", "54.076", "72 - 76.9", "Volume dropped with slight improved pressure"],
      ["Week 1 (01/07 - 07/07)", "Seplat Oben", "300.587", "56.314", "57 - 75", "Volume and pressure improved"],
    ],
  },
  // DEFERMENT (Simplified - focus on volume impact)
  deferment: {
    filename: "deferment_upload_template.csv",
    headers: ["Date", "Facility", "Planned (MMscf/d)", "Actual (MMscf/d)", "Deferred (MMscf/d)", "Reason", "Remarks"],
    sample: [
      ["2026-07-15", "Trans-Niger Pipeline", "350.0", "285.2", "64.8", "Pipeline vandalism", "Hot tap at KP 125"],
      ["2026-07-15", "Bonny Plant", "2500.0", "2450.0", "50.0", "Compressor failure", "CS-02 bearing replacement"],
      ["2026-07-15", "Escravos", "330.0", "310.0", "20.0", "Planned maintenance", ""],
    ],
  },
  // VOLUME BALANCE - Keep this as-is, it's already aligned with needs
  volumes: {
    filename: "volumes_upload_template.csv",
    headers: ["Date", "Produced (MMscf/d)", "NGL Extracted (MMscf/d)", "Into Transmission (MMscf/d)", "Fuel Gas (MMscf/d)", "Line Pack Δ (MMscf/d)", "Delivered (MMscf/d)", "UFG (MMscf/d)", "UFG %", "Remarks"],
    sample: [
      ["2026-07-15", "2850.5", "320.3", "2530.2", "85.5", "12.3", "2420.5", "11.9", "0.47", "Normal operations"],
      ["2026-07-14", "2780.2", "315.8", "2464.4", "82.8", "-8.5", "2380.1", "10.0", "0.41", ""],
    ],
  },
  // INCIDENTS (Simplified - focus on operational impact)
  incidents: {
    filename: "incidents_upload_template.csv",
    headers: ["Date", "Facility", "Category", "Severity", "Description", "Deferment (MMscf/d)", "Status", "Remarks"],
    sample: [
      ["2026-07-15", "Trans-Niger Pipeline", "Pipeline Leak", "Critical", "Hot tap vandalism at KP 125", "64.8", "Under Investigation", "Security team dispatched"],
      ["2026-07-14", "Obite Station", "Equipment Failure", "High", "Compressor CS-02 bearing failure", "50.0", "Open", "Spare parts ordered"],
      ["2026-07-15", "Escravos", "Planned Maintenance", "Low", "Routine maintenance shutdown", "20.0", "Scheduled", ""],
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

// Get template instructions - ALIGNED WITH NNPC EXCEL REPORTS
export const getTemplateInstructions = (templateType: keyof typeof CSV_TEMPLATES) => {
  const instructions: Record<keyof typeof CSV_TEMPLATES, string[]> = {
    production: [
      "Week format: 'Week 1 (DD/MM/YYYY - DD/MM/YYYY)'",
      "Producer names: CNL-Escravos, NEPL/NDW Utorogu, Seplat Oben, AHL, Pan Ocean, etc.",
      "Volume in MMscf (not MMscf/d for weekly totals)",
      "Source of Allocation: List contributing sources separated by commas",
      "Leave Remarks blank if no issues to report",
    ],
    nominations: [
      "Date must be in YYYY-MM-DD format",
      "Offtaker name: Power station or industrial customer",
      "Source: Gas producer(s) supplying this offtaker",
      "Allocation and Offtake in MMscf",
      "All volumes should be positive numbers",
    ],
    flows: [
      "Week format: 'Week 1 (DD/MM - DD/MM)'",
      "Producer names must match supply data",
      "Average Volume in MMscf/d (daily average for the week)",
      "Pressure in barg (bar gauge)",
      "Contractual range format: 'XX - YY' (e.g., '80 - 85')",
      "Remarks should note volume or pressure trends",
    ],
    deliveries: [
      "Date must be in YYYY-MM-DD format",
      "Region: Western, Eastern, Northern, Lagos",
      "Customer Type: NPDC Power, NIPP, Independent Power, Industrial",
      "Station: Full power station or industrial facility name",
      "Pressure can be single value or range (e.g., '24' or '33/31')",
      "Remarks: STATION ON STREAM, STATION ON STANDBY, or specific notes",
      "MW (Megawatts): Leave blank for industrial customers",
    ],
    deferment: [
      "Date must be in YYYY-MM-DD format",
      "Facility: Station or pipeline name",
      "Deferred = Planned - Actual (in MMscf/d)",
      "Reason: Pipeline vandalism, Compressor failure, Planned maintenance, etc.",
      "All volumes in MMscf/d",
    ],
    volumes: [
      "Date must be in YYYY-MM-DD format (e.g., 2026-07-15)",
      "All volumes in MMscf/d (Million Standard Cubic Feet per Day)",
      "Into Transmission = Produced - NGL Extracted",
      "Delivered = Into Transmission - Fuel Gas - UFG ± Line Pack",
      "UFG % will be calculated automatically",
      "Line Pack Δ: Use + for increase, - for decrease",
    ],
    incidents: [
      "Date must be in YYYY-MM-DD format",
      "Category: Pipeline Leak, Equipment Failure, Planned Maintenance, etc.",
      "Severity: Critical, High, Medium, Low",
      "Deferment: Volume impact in MMscf/d",
      "Status: Open, Under Investigation, Scheduled, Resolved",
      "Description should be concise but specific",
    ],
  };

  return instructions[templateType];
};
