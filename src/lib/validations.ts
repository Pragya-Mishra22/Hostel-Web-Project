import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a 10 digit phone number."),
  rollNumber: z.string().min(3, "Enter your roll number."),
  course: z.string().min(2, "Enter your course, e.g. B.Tech CSE."),
  // Delivered as a real number by the <select>'s `valueAsNumber` option
  // (see register-form.tsx), so no coercion is needed here — z.coerce's
  // input type is `unknown`, which doesn't play well with react-hook-form's
  // generic inference.
  year: z.number().int().min(1).max(5),
  guardianName: z.string().min(2, "Enter a guardian's name."),
  guardianPhone: z.string().regex(/^[0-9]{10}$/, "Enter a 10 digit guardian phone number."),
  address: z.string().min(5, "Enter a home address."),
  preferredHostelId: z.string().min(1, "Choose a hostel."),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const complaintSchema = z.object({
  category: z.enum(["ELECTRICAL", "PLUMBING", "WIFI", "CLEANLINESS", "MESS", "OTHER"]),
  title: z.string().min(4, "Give the complaint a short title.").max(80),
  description: z.string().min(10, "Describe the issue in a bit more detail."),
});
export type ComplaintInput = z.infer<typeof complaintSchema>;

export const leaveSchema = z
  .object({
    fromDate: z.string().min(1, "Choose a start date."),
    toDate: z.string().min(1, "Choose a return date."),
    reason: z.string().min(5, "Tell the warden why you're going."),
    destination: z.string().min(2, "Where are you going?"),
  })
  .refine((data) => new Date(data.toDate) >= new Date(data.fromDate), {
    message: "Return date must be on or after the start date.",
    path: ["toDate"],
  });
export type LeaveInput = z.infer<typeof leaveSchema>;

export const roomBookingSchema = z.object({
  bedId: z.string().min(1, "Choose an available bed."),
});
export type RoomBookingInput = z.infer<typeof roomBookingSchema>;
