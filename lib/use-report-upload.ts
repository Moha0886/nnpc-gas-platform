// Reusable hook for report upload/export functionality

import { useState } from "react";
import { exportToCSV, formatDateForCSV, CSV_TEMPLATES } from "./csv-utils";

interface UseReportUploadConfig<T> {
  templateType: keyof typeof CSV_TEMPLATES;
  identifierFields: string[];
  requiredFields: string[];
  transformUploadData: (row: any, index: number) => T;
  transformExportData: (record: T) => any;
}

export function useReportUpload<T extends { id: string }>(
  initialData: T[],
  config: UseReportUploadConfig<T>
) {
  const [data, setData] = useState<T[]>(initialData);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleUpload = (uploadedData: any[], overwriteDuplicates: boolean) => {
    // Transform uploaded data
    const newRecords = uploadedData.map(config.transformUploadData);

    if (overwriteDuplicates) {
      // Remove existing records that match identifiers and add new ones
      const existingWithoutDuplicates = data.filter((existing) =>
        !newRecords.some((newRec) =>
          config.identifierFields.every((field) =>
            (existing as any)[field] === (newRec as any)[field]
          )
        )
      );
      setData([...existingWithoutDuplicates, ...newRecords]);
    } else {
      // Add only new records (skip duplicates)
      const trulyNewRecords = newRecords.filter((newRec) =>
        !data.some((existing) =>
          config.identifierFields.every((field) =>
            (existing as any)[field] === (newRec as any)[field]
          )
        )
      );
      setData([...data, ...trulyNewRecords]);
    }
  };

  const handleExport = (filteredData: T[], filename: string) => {
    const exportData = filteredData.map(config.transformExportData);
    exportToCSV(exportData, filename);
  };

  return {
    data,
    setData,
    uploadModalOpen,
    setUploadModalOpen,
    handleUpload,
    handleExport,
  };
}
