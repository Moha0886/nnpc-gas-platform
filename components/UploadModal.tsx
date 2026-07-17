"use client";

import { XCircle } from "lucide-react";
import FileUpload from "./FileUpload";
import { CSV_TEMPLATES, getTemplateInstructions } from "@/lib/csv-utils";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateType: keyof typeof CSV_TEMPLATES;
  title: string;
  existingData: any[];
  identifierFields: string[];
  requiredFields: string[];
  onUploadSuccess: (data: any[], overwriteDuplicates: boolean) => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  templateType,
  title,
  existingData,
  identifierFields,
  requiredFields,
  onUploadSuccess,
}: UploadModalProps) {
  if (!isOpen) return null;

  const instructions = getTemplateInstructions(templateType);

  const handleUploadSuccess = (data: any[], overwriteDuplicates: boolean) => {
    onUploadSuccess(data, overwriteDuplicates);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-line p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">{title}</h2>
            <p className="text-sm text-ink/60 mt-1">
              Upload CSV file with production data
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-ink/40 hover:text-ink transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
            <h3 className="font-bold text-ink mb-3">Upload Instructions</h3>
            <ul className="space-y-2 text-sm text-ink/70">
              {instructions.map((instruction, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* File Upload Component */}
          <FileUpload
            templateType={templateType}
            existingData={existingData}
            identifierFields={identifierFields}
            requiredFields={requiredFields}
            onUploadSuccess={handleUploadSuccess}
          />

          {/* Help Text */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 text-sm">
            <p className="text-ink/70">
              <span className="font-medium text-accent">Need help?</span> Download the
              template, fill it with your data, and upload it here. The system will
              automatically validate the data and detect any duplicates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
