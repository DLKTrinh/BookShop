export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ApiError extends Error {
  status?: number;
  fieldErrors?: ValidationErrorDetail[];
}