export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "url"
  | "hidden";

export interface FormField {
  id: string;
  type: FieldType;
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  options: string[]; // for select, radio, checkbox
  width: "full" | "half"; // col-12 or col-6
  icon: string; // FontAwesome icon class e.g. "fal fa-user"
  validation: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface FormSettings {
  submitText: string;
  successMessage: string;
  emailNotification: {
    enabled: boolean;
    to: string; // comma-separated emails
    subject: string;
  };
  whatsappNotification: {
    enabled: boolean;
    phone: string; // e.g. "6281234567890"
    message: string; // template with {{field_name}} placeholders
  };
}

export const defaultFormSettings: FormSettings = {
  submitText: "Kirim Pesan",
  successMessage: "Pesan berhasil dikirim! Terima kasih telah menghubungi kami.",
  emailNotification: {
    enabled: false,
    to: "",
    subject: "Pesan Baru dari Form Kontak",
  },
  whatsappNotification: {
    enabled: false,
    phone: "",
    message: "Pesan baru dari {{name}} ({{email}}): {{message}}",
  },
};

export function createDefaultField(): FormField {
  return {
    id: crypto.randomUUID(),
    type: "text",
    name: "",
    label: "",
    placeholder: "",
    required: false,
    options: [],
    width: "full",
    icon: "",
    validation: {},
  };
}
