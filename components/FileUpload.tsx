"use client";

import { useState, useRef } from "react";
import { Upload, File, X, AlertCircle, CheckCircle, Download } from "lucide-react";
import {
  parseCSVFile,
  detectDuplicates,
  validateData,
  downloadTemplate,
  CSV_TEMPLATES,
  type DuplicateRecord,
  type ValidationError,
} from "@/lib/csv-utils";

interface FileUploadProps {
  templateType: keyof typeof CSV_TEMPLATES;
  existingData: any[];
  identifierFields: string[]; // Fields to check for duplicates (e.g., ["date", "station"])
  requiredFields: string[];
  onUploadSuccess: (data: any[], overwriteDuplicates: boolean) => void;
  onUploadError?: (errors: ValidationError[]) => void;
}

export default function FileUpload({
  templateType,
  existingData,
  identifierFields,
  requiredFields,
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "validating" | "duplicates" | "error" | "success"
  >("idle");
  const [duplicates, setDuplicates] = useState<DuplicateRecord[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Check file type
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file");
      return;
    }

    setFile(file);
    setUploading(true);
    setUploadStatus("validating");

    try {
      // Parse CSV
      const { data, errors: parseErrors } = await parseCSVFile(file);

      if (parseErrors.length > 0) {
        setUploadStatus("error");
        setValidationErrors(
          parseErrors.map((err, idx) => ({
            row: err.row || idx + 1,
            field: "parsing",
            message: err.message || "Failed to parse row",
            value: null,
          }))
        );
        setUploading(false);
        return;
      }

      // Validate required fields
      const errors = validateData(data, requiredFields);
      if (errors.length > 0) {
        setUploadStatus("error");
        setValidationErrors(errors);
        onUploadError?.(errors);
        setUploading(false);
        return;
      }

      // Check for duplicates
      const foundDuplicates = detectDuplicates(data, existingData, identifierFields);

      setParsedData(data);

      if (foundDuplicates.length > 0) {
        setDuplicates(foundDuplicates);
        setUploadStatus("duplicates");
        setUploading(false);
      } else {
        // No duplicates, proceed with upload
        handleConfirmUpload(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setValidationErrors([
        {
          row: 0,
          field: "file",
          message: "Failed to process file. Please check the format.",
          value: null,
        },
      ]);
      setUploading(false);
    }
  };

  const handleConfirmUpload = (overwriteDuplicates: boolean) => {
    setUploadStatus("success");
    onUploadSuccess(parsedData, overwriteDuplicates);

    // Reset after short delay
    setTimeout(() => {
      setFile(null);
      setUploadStatus("idle");
      setDuplicates([]);
      setParsedData([]);
      setUploading(false);
    }, 2000);
  };

  const handleCancelUpload = () => {
    setFile(null);
    setUploadStatus("idle");
    setDuplicates([]);
    setParsedData([]);
    setValidationErrors([]);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplate(templateType);
  };

  return (
    <div className="space-y-4">
      {/* Download Template Button */}
      <button
        onClick={handleDownloadTemplate}
        className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors text-sm"
      >
        <Download className="w-4 h-4" />
        Download Template
      </button>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : uploadStatus === "error"
            ? "border-alert bg-alert/5"
            : uploadStatus === "success"
            ? "border-primary bg-primary/5"
            : "border-line hover:border-primary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
          id="file-upload"
        />

        {!file ? (
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-ink/40" />
            <p className="text-ink/70 mb-2">
              <span className="text-primary font-medium">Click to upload</span> or
              drag and drop
            </p>
            <p className="text-ink/50 text-sm">CSV files only</p>
          </label>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <File className="w-8 h-8 text-primary" />
              <div className="text-left">
                <p className="font-medium text-ink">{file.name}</p>
                <p className="text-sm text-ink/60">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              {uploadStatus !== "success" && (
                <button
                  onClick={handleCancelUpload}
                  className="ml-4 text-ink/40 hover:text-alert transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Status Messages */}
            {uploadStatus === "validating" && (
              <div className="flex items-center justify-center gap-2 text-accent">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm">Validating data...</p>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="flex items-center justify-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <p className="text-sm font-medium">Upload successful!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {uploadStatus === "error" && validationErrors.length > 0 && (
        <div className="bg-alert/10 border border-alert/20 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-alert mt-0.5" />
            <div>
              <h3 className="font-bold text-alert">Validation Errors</h3>
              <p className="text-sm text-ink/60">
                Please fix the following errors and try again:
              </p>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-alert/20">
                <tr>
                  <th className="text-left py-2 px-2">Row</th>
                  <th className="text-left py-2 px-2">Field</th>
                  <th className="text-left py-2 px-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {validationErrors.slice(0, 20).map((error, idx) => (
                  <tr key={idx} className="border-b border-alert/10">
                    <td className="py-2 px-2 tabular-nums">{error.row}</td>
                    <td className="py-2 px-2 font-medium">{error.field}</td>
                    <td className="py-2 px-2 text-ink/70">{error.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {validationErrors.length > 20 && (
              <p className="text-xs text-ink/60 mt-2 text-center">
                ... and {validationErrors.length - 20} more errors
              </p>
            )}
          </div>
        </div>
      )}

      {/* Duplicate Detection Modal */}
      {uploadStatus === "duplicates" && duplicates.length > 0 && (
        <div className="bg-flare/10 border border-flare/20 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-flare mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-flare">Duplicate Records Found</h3>
              <p className="text-sm text-ink/60">
                {duplicates.length} record(s) already exist in the system. How would
                you like to proceed?
              </p>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto mb-4">
            <table className="w-full text-sm">
              <thead className="border-b border-flare/20">
                <tr>
                  <th className="text-left py-2 px-2">Row</th>
                  {identifierFields.map((field) => (
                    <th key={field} className="text-left py-2 px-2 capitalize">
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {duplicates.slice(0, 10).map((dup, idx) => (
                  <tr key={idx} className="border-b border-flare/10">
                    <td className="py-2 px-2 tabular-nums">{dup.row}</td>
                    {identifierFields.map((field) => (
                      <td key={field} className="py-2 px-2">
                        {dup[field]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {duplicates.length > 10 && (
              <p className="text-xs text-ink/60 mt-2 text-center">
                ... and {duplicates.length - 10} more duplicates
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleConfirmUpload(true)}
              className="flex-1 px-4 py-2 bg-flare text-white rounded-lg hover:bg-flare/90 transition-colors text-sm font-medium"
            >
              Overwrite Duplicates
            </button>
            <button
              onClick={() => handleConfirmUpload(false)}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Skip Duplicates
            </button>
            <button
              onClick={handleCancelUpload}
              className="px-4 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload Stats */}
      {parsedData.length > 0 && uploadStatus !== "error" && (
        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink/60">Total Records:</span>
            <span className="font-bold text-ink tabular-nums">
              {parsedData.length}
            </span>
          </div>
          {duplicates.length > 0 && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-ink/60">Duplicates:</span>
              <span className="font-bold text-flare tabular-nums">
                {duplicates.length}
              </span>
            </div>
          )}
          {parsedData.length > duplicates.length && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-ink/60">New Records:</span>
              <span className="font-bold text-primary tabular-nums">
                {parsedData.length - duplicates.length}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
