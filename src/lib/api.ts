import type {
  About,
  AboutSection,
  AppointmentBookingResult,
  AppointmentTimeSlot,
  Article,
  BookableDoctor,
  BookableService,
  CreateAppointmentPayload,
  Doctor,
  Faq,
  FooterSettings,
  HeroSection,
  HelpSection,
  LabTest,
  NavbarColumn,
  Service,
  SiteSettings,
  Testimonial,
  WhyChooseUsItem,
} from "../types/api";

const apiBaseUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!apiBaseUrl) {
  throw new Error(
    "VITE_API_URL is not defined. Please add it to your frontend .env file.",
  );
}

const normalizeApiBase = () => apiBaseUrl.replace(/\/+$/, "");

const buildUrl = (path: string) => {
  const cleanedPath = path.replace(/^\/+/, "");
  return `${normalizeApiBase()}/${cleanedPath}`;
};

async function request<T>(path: string): Promise<T | null> {
  const url = buildUrl(path);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      success?: boolean;
      data?: T;
    };

    if (payload.success === false) {
      return null;
    }

    return (payload.data ?? null) as T | null;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    return null;
  }
}

async function postRequest<T, B>(path: string, body: B): Promise<T | null> {
  const url = buildUrl(path);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      success?: boolean;
      data?: T;
    };

    if (payload.success === false) {
      return null;
    }

    return (payload.data ?? null) as T | null;
  } catch (error) {
    console.error(`POST API request failed for ${url}:`, error);
    return null;
  }
}

export const getApiOrigin = () => {
  return new URL(normalizeApiBase()).origin;
};

export const getImageUrl = (path?: string | null): string => {
  if (!path) {
    return "";
  }

  const value = path.trim();

  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  const baseOrigin = getApiOrigin();

  return new URL(value, `${baseOrigin}/`).toString();
};

export const getSiteSettings = () => request<SiteSettings>("/site-settings");

export const getHero = () => request<HeroSection>("/hero");

export const getHelpSection = () => request<HelpSection>("/help");

export const getAboutSection = () => request<AboutSection>("/about");

export const getAbout = () => request<About>("/about");

export const getServices = () => request<Service[]>("/services");

export const getServiceBySlug = (slug: string) =>
  request<Service>(`/services/${encodeURIComponent(slug)}`);

export const getTestimonials = () => request<Testimonial[]>("/testimonials");

export const getWhyChooseUs = () =>
  request<WhyChooseUsItem[]>("/why-choose-us");

export const getLabTests = () => request<LabTest[]>("/lab-tests");

export const getDoctors = () => request<Doctor[]>("/doctors");

export const getDoctorBySlug = (slug: string) =>
  request<Doctor>(`/doctors/${encodeURIComponent(slug)}`);

export const getArticles = () => request<Article[]>("/articles");

export const getArticleBySlug = (slug: string) =>
  request<Article>(`/articles/${encodeURIComponent(slug)}`);

export const getFaqs = () => request<Faq[]>("/faqs");

export const getFooter = () => request<FooterSettings>("/footer");

export const getNavbar = () => request<NavbarColumn[]>("/navbar");

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  message: string;
}

async function postRequestWithError<T, B>(
  path: string,
  body: B,
): Promise<{ data: T | null; message?: string; ok: boolean }> {
  const url = buildUrl(path);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = (await response.json()) as {
      success?: boolean;
      data?: T;
      message?: string;
    };

    if (!response.ok || payload.success === false) {
      return {
        data: null,
        message: payload.message || "Request failed.",
        ok: false,
      };
    }

    return { data: (payload.data ?? null) as T | null, ok: true };
  } catch (error) {
    console.error(`POST API request failed for ${url}:`, error);
    return {
      data: null,
      message: "Network error. Please try again.",
      ok: false,
    };
  }
}

export const submitContactMessage = (payload: ContactSubmissionPayload) =>
  postRequest<{ id: string }, ContactSubmissionPayload>("/contact", payload);

export const getBookableDoctors = () =>
  request<BookableDoctor[]>("/appointments/doctors");

export const getBookableServices = () =>
  request<BookableService[]>("/appointments/services");

export const getDoctorAvailableDates = (doctorId: string) =>
  request<{ doctor: BookableDoctor; availableDates: string[] }>(
    `/appointments/availability/${encodeURIComponent(doctorId)}`,
  );

export const getDoctorAvailableSlots = (doctorId: string, date: string) =>
  request<{
    doctor: BookableDoctor;
    date: string;
    slots: AppointmentTimeSlot[];
  }>(
    `/appointments/availability/${encodeURIComponent(doctorId)}?date=${encodeURIComponent(date)}`,
  );

export const bookAppointment = (payload: CreateAppointmentPayload) =>
  postRequestWithError<AppointmentBookingResult, CreateAppointmentPayload>(
    "/appointments",
    payload,
  );

export const lookupAppointment = (reference: string) =>
  request<{
    reference: string;
    status: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    patientName: string;
    doctor: BookableDoctor;
    service?: BookableService | null;
  }>(`/appointments/${encodeURIComponent(reference)}`);
