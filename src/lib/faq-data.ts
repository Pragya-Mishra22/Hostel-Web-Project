import type { FaqItem } from "@/components/ui/faq-accordion";

/**
 * Answers are paraphrased from the university's own hostel pages
 * (jcboseust.ac.in/Hostel-Facilities-and-Rules and
 * jcboseust.ac.in/Boarding-Lodging-Charges-of-girls-Hostel), retrieved through
 * Apify. Rules do change, so the home page links to the source pages. The two
 * answers about this portal describe how this app works, not university policy.
 */
export const OFFICIAL_RULES_URL = "https://jcboseust.ac.in/Hostel-Facilities-and-Rules";
export const OFFICIAL_CHARGES_URL = "https://jcboseust.ac.in/Boarding-Lodging-Charges-of-girls-Hostel";

export const homeFaqs: FaqItem[] = [
  {
    question: "Who can get a hostel seat?",
    answer:
      "The girls' hostel is open to girls studying at the university, subject to availability and on a first come, first served basis, as long as their home is not within 60 km of the university. The allotment form must be submitted together with the hostel and mess fees and the required affidavits. Incomplete forms, or forms without fees, are not allotted.",
  },
  {
    question: "What facilities do the girls' hostels have?",
    answer:
      "A mess run on contract and supervised by mess committees, a reading room with desktops, a common room with an LED TV, visitor and guest rooms, a gym, 24x7 RO drinking water, first aid and a 24x7 ambulance, badminton and basketball courts, Wi-Fi in all wings, backup power during exams, hot water geysers, and CCTV with male and female guards in every wing.",
  },
  {
    question: "What are the mess timings and how are mess bills paid?",
    answer:
      "Breakfast is from 7:30 to 9:30 am, lunch from 12:30 to 2:15 pm and dinner from 8:00 to 9:30 pm, and these can change with the warden's consent. Carry your hostel I-card to every meal. Monthly mess bills must be paid by the 12th, after which a fine of Rs 10 per day applies, and every resident pays for a minimum of 25 days a month. Cooking in rooms is not allowed.",
  },
  {
    question: "How are hostel and mess fees paid, and what does this portal do?",
    answer:
      "The university collects the hostel and mess charges through the Chief Warden's office at the start of the session. This portal does not take payments. It keeps your records: your hostel fee, mess fee and electricity and cooler charges are listed month by month as paid or pending, and a printable receipt is available once an entry is marked paid.",
  },
  {
    question: "How do I apply for leave to go home?",
    answer:
      "Residents are expected to follow the hostel entry and exit timings. In this portal you send a leave application with your dates, destination and reason. Your warden approves or rejects it, and an approved leave becomes a gate pass you can show to the caretaker at the gate. Departures and returns are logged in the gate register.",
  },
  {
    question: "What if I have a complaint about my room or the mess?",
    answer:
      "The hostels keep complaint and feedback registers and a suggestion box. In this portal, pick a category such as electrical, plumbing, Wi-Fi, cleanliness or mess, and the complaint goes straight to your hostel's warden. You can follow it from open, to in progress, to resolved, and read the warden's note.",
  },
  {
    question: "What happens when I leave the hostel for good?",
    answer:
      "A No Dues certificate is issued only to students who have cleared every hostel due. Before you leave, hand your hostel I-card and a photocopy of the No Dues slip, signed by the hostel attendant, to your warden. The slip is checked before a seat is allotted for the next session.",
  },
  {
    question: "Who do I contact in a ragging, harassment or safety emergency?",
    answer:
      "Ragging in any form is illegal and banned by law. For disciplinary matters the university requires a parent to be present. The Safety and Contacts page lists the university Proctor, the Chief Warden (Girls), the national anti-ragging helpline and the emergency numbers, grouped by the kind of help you need.",
  },
];
