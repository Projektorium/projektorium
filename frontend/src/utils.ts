import type {ApiError, ProjectStatus} from "./client"
import useCustomToast from "./hooks/useCustomToast"



export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Niewłaściwy adres e-mail",
}

export const namePattern = {
  value: /^[A-Za-z\s\u00C0-\u017F]{1,30}$/,
  message: "Niewłaściwe imię lub nazwisko",
}

export const passwordRules = (isRequired = true) => {
  const rules: any = {
    minLength: {
      value: 8,
      message: "Hasło musi zawierać co najmniej 8 znaków",
    },
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
      message: "Hasło musi zawierać przynajmniej jedną literę i jedną cyfrę",
    },
  }

  if (isRequired) {
    rules.required = "Hasło jest wymagane"
  }
  

  return rules
}

export const confirmPasswordRules = (
  getValues: () => any,
  isRequired = true,
) => {
  const rules: any = {
    validate: (value: string) => {
      const password = getValues().password || getValues().new_password
      return value === password ? true : "Hasła muszą być takie same"
    },
  }

  if (isRequired) {
    rules.required = "Hasło jest wymagane"
  }

  return rules
}

export const handleError = (err: ApiError) => {
  const { showErrorToast } = useCustomToast()
  const errDetail = (err.body as any)?.detail
  let errorMessage = errDetail || "Wystąpił błąd. Spróbuj ponownie później."
  if (Array.isArray(errDetail) && errDetail.length > 0) {
    errorMessage = errDetail[0].msg
  }
  showErrorToast(errorMessage)
}


export const BACKEND_URL = 'http://localhost:8000'; // Change this based on your environment

export function getAbsoluteUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;

  // If it's already an absolute URL, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Make sure URL doesn't start with double slash
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  // Return URL with backend prefix
  return `${BACKEND_URL}${cleanUrl}`;
}

/**
 * Transforms an API-provided image URL to a fully qualified URL
 * Specifically handles profile images and other media from the backend
 * @param imageUrl The image URL from the API
 * @returns A properly formatted image URL
 */
export function getImageUrl(imageUrl: string | null | undefined): string | undefined {
  return getAbsoluteUrl(imageUrl);
}

export function formatDateToPolish(inputDate: string): string {
  const date = new Date(inputDate);

  const polishMonths = [
    "sty", "lut", "mar", "kwi", "maj", "cze",
    "lip", "sie", "wrz", "paź", "lis", "gru"
  ];

  const day = date.getDate();
  const month = polishMonths[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}

export function translateStatusToPolish(status: ProjectStatus): string {
  const translations: Record<typeof status, string> = {
    Active: "Aktywny",
    Recruitment: "Rekrutacja",
    Inactive: "Zakończony",
    Private: "Prywatny"
  };

  return translations[status];
}
