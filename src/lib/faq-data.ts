import type { FaqItem } from "@/components/ui/faq-accordion";

/**
 * Written from the university's general, publicly known hostel policies
 * (fees, visiting hours, admission, safety) in our own words — not scraped,
 * since the Apify MCP connector isn't available in this build environment.
 * Easy to edit once the hostel office shares exact current figures.
 */
export const homeFaqs: FaqItem[] = [
  {
    question: "Who can apply for a hostel seat?",
    answer:
      "Any enrolled woman student of J C Bose University of Science & Technology, YMCA can apply. First-year students get priority during the admission cycle, and seats for senior students are allotted after that, subject to availability.",
  },
  {
    question: "How does room allocation work?",
    answer:
      "You register and submit a room request through the student portal, choosing a hostel. The warden of that hostel reviews it and allocates an available bed. You'll see the allocation status update on your dashboard once it's confirmed.",
  },
  {
    question: "What does the hostel fee cover, and how do I pay it?",
    answer:
      "Hostel fee (paid yearly) covers your room and basic amenities. Mess fee (paid monthly) covers your meals, and the electricity and cooler usage charge is billed monthly alongside it. All three are tracked separately in the Fees section of your portal, each month marked paid or pending.",
  },
  {
    question: "How do I apply for leave to go home?",
    answer:
      "Submit a leave application from the student portal with your travel dates, destination and reason. Your warden reviews and approves or rejects it. Once approved, you can show the digital gate pass to the caretaker at the gate, no separate signatures needed.",
  },
  {
    question: "What if I have a complaint about my room or the mess?",
    answer:
      "Raise it through the Complaints section of your portal, choosing a category like electrical, plumbing, Wi-Fi, cleanliness or mess. It goes straight to your hostel's warden, and you can track whether it's open, being worked on, or resolved.",
  },
  {
    question: "Who do I contact in a ragging, harassment or safety emergency?",
    answer:
      "Every hostel has a warden on duty and the university runs a dedicated anti-ragging and women's safety cell. The full list of emergency and safety contacts, organized by the kind of help you need, is on the Safety & Contacts page linked in the footer of every screen.",
  },
];
