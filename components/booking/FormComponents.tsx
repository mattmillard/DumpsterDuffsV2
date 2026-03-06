"use client";

import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
}

export function FormInput({
  label,
  error,
  helpText,
  id,
  className,
  ...props
}: FormInputProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mb-6">
      <label
        htmlFor={fieldId}
        className="block text-sm font-semibold text-white mb-2"
      >
        {label}
        {props.required && <span className="text-primary ml-1">*</span>}
      </label>
      <input
        id={fieldId}
        className={`input-field w-full ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""} ${className || ""}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.172l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l8-8z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-xs text-[#999999] mt-1">{helpText}</p>
      )}
    </div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function FormSelect({
  label,
  error,
  options,
  id,
  className,
  ...props
}: FormSelectProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mb-6">
      <label
        htmlFor={fieldId}
        className="block text-sm font-semibold text-white mb-2"
      >
        {label}
        {props.required && <span className="text-primary ml-1">*</span>}
      </label>
      <select
        id={fieldId}
        className={`input-field w-full ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""} ${className || ""}`}
        {...props}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
}

export function FormTextarea({
  label,
  error,
  helpText,
  id,
  className,
  ...props
}: FormTextareaProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mb-6">
      <label
        htmlFor={fieldId}
        className="block text-sm font-semibold text-white mb-2"
      >
        {label}
        {props.required && <span className="text-primary ml-1">*</span>}
      </label>
      <textarea
        id={fieldId}
        className={`input-field w-full resize-none ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""} ${className || ""}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      {helpText && !error && (
        <p className="text-xs text-[#999999] mt-1">{helpText}</p>
      )}
    </div>
  );
}

interface FormActionsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isLoading?: boolean;
  nextDisabled?: boolean;
}

export function FormActions({
  onBack,
  onNext,
  nextLabel = "Continue",
  backLabel = "Back",
  isLoading = false,
  nextDisabled = false,
}: FormActionsProps) {
  return (
    <div className="flex gap-4 pt-6 border-t border-[#404040]">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary flex-1"
          disabled={isLoading}
        >
          {backLabel}
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          className="btn-primary flex-1"
          disabled={isLoading || nextDisabled}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            nextLabel
          )}
        </button>
      )}
    </div>
  );
}
