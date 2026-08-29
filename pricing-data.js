/**
 * pricing-data.js — Single source of truth for all Learners Academy prices.
 *
 * Imported by: course-detail.html, courses.html, cart, checkout.
 * Mirrors the tables on pricing.html exactly — edit here and every page
 * that imports this file will automatically stay in sync.
 */

// ─── SCHOOL: Grade-band monthly base prices (1 subject, monthly billing) ─────
// These are the "single subject / monthly" figures from pricing.html.
export const GRADE_BANDS = {
  "6-10": {
    label: "Grade 6–10",
    single: 4500,        // ₹4,500 / month / 1 subject
    trial: 500,          // ₹500 one-time trial (4 classes)
    perClass: 225,
  },
  "11-12": {
    label: "Grade 11–12",
    single: 7000,        // ₹7,000 / month / 1 subject
    trial: 999,          // ₹999 one-time trial (4 classes)
    perClass: 350,
  },
};

// Subjects that belong to the school track (Grade 6–12)
export const SCHOOL_SUBJECTS = [
  "math", "science", "english", "social-studies", "computers", "vedic-maths",
];

// ─── SCHOOL: Multi-subject discounts ─────────────────────────────────────────
// Key = number of subjects enrolled simultaneously
export const MULTI_SUBJECT_DISCOUNT = {
  1: 0,      // 0% off
  2: 0.25,   // 25% off per subject
  3: 0.30,   // 30% off per subject (3 or more)
};

// ─── SCHOOL: Billing-period multipliers ──────────────────────────────────────
// Applied on top of the monthly single-subject base price.
export const SCHOOL_BILLING = {
  monthly:    { months: 1,  discount: 0    },
  quarterly:  { months: 3,  discount: 0.05 },   // 5% off
  halfyearly: { months: 6,  discount: 0.10 },   // 10% off
  yearly:     { months: 10, discount: 0    },   // pay 10 months, get 12 (2 free)
};

// ─── PROFESSIONAL: Monthly base prices (group batch) ─────────────────────────
// Tier 1 courses: ₹3,000 / month
// Tier 2 courses: ₹4,000 / month
export const PRO_COURSES = {
  "tableau":         { label: "Tableau",         tier: 1, monthly: 3000 },
  "power-bi":        { label: "Power BI",        tier: 1, monthly: 3000 },
  "python":          { label: "Python",          tier: 1, monthly: 3000 },
  "sql":             { label: "SQL",             tier: 1, monthly: 3000 },
  "data-analytics":  { label: "Data Analytics",  tier: 2, monthly: 4000 },
  "machine-learning":{ label: "Machine Learning",tier: 2, monthly: 4000 },
  "generative-ai":   { label: "Generative AI",   tier: 2, monthly: 4000 },
  "data-science":    { label: "Data Science",    tier: 2, monthly: 4000 },
};

// ─── PROFESSIONAL: Billing-period multipliers ─────────────────────────────────
export const PRO_BILLING = {
  monthly:    { months: 1,  discount: 0    },
  quarterly:  { months: 3,  discount: 0.05 },
  halfyearly: { months: 6,  discount: 0.10 },
  yearly:     { months: 12, discount: 0.15 },
};

// ─── PROFESSIONAL: Bundle discounts ──────────────────────────────────────────
export const PRO_BUNDLES = {
  bi:           { courses: ["tableau","power-bi"],                      discount: 0.10 },
  data:         { courses: ["python","data-analytics"],                  discount: 0.10 },
  fullAnalytics:{ courses: ["tableau","power-bi","python","data-analytics"], discount: 0.15 },
  aiml:         { courses: ["machine-learning","generative-ai"],         discount: 0.15 },
};

// 1-on-1 premium for professional courses
export const PRO_1ON1_PREMIUM = 0.50;

// ─── UTILITY FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Format a number as Indian-locale rupees: ₹4,500
 */
export function fmtINR(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

/**
 * Parse a course-detail page courseId (e.g. "math-grade-8" or "power-bi")
 * and return a structured object with band, subject, grade, monthly price, etc.
 *
 * Returns null if courseId is unrecognised.
 *
 * @param {string} courseId
 * @returns {{ type: "school"|"pro", subject: string, grade?: string, band?: string, monthlyPrice: number }|null}
 */
export function parseCourseId(courseId) {
  if (!courseId) return null;

  // School pattern: "<subject>-grade-<grade>"
  const schoolMatch = courseId.match(/^(.+)-grade-(\d+)$/);
  if (schoolMatch) {
    const subject = schoolMatch[1];
    const grade   = parseInt(schoolMatch[2], 10);
    const band    = grade >= 11 ? "11-12" : "6-10";
    if (!SCHOOL_SUBJECTS.includes(subject)) return null;
    return {
      type:         "school",
      subject,
      grade:        String(grade),
      band,
      monthlyPrice: GRADE_BANDS[band].single,
      label:        `Class ${grade} · ${GRADE_BANDS[band].label}`,
    };
  }

  // Professional pattern: match slug directly in PRO_COURSES
  if (PRO_COURSES[courseId]) {
    const c = PRO_COURSES[courseId];
    return {
      type:         "pro",
      subject:      courseId,
      monthlyPrice: c.monthly,
      label:        c.label,
    };
  }

  return null;
}

/**
 * Calculate the actual price for a school course given billing period and
 * number of subjects enrolled.
 *
 * @param {string} band       - "6-10" or "11-12"
 * @param {string} billing    - "monthly" | "quarterly" | "halfyearly" | "yearly"
 * @param {number} subjects   - number of subjects (1, 2, or 3+)
 * @returns {{ total: number, perMonth: number, saving: number }}
 */
export function schoolPrice(band, billing = "monthly", subjects = 1) {
  const base   = GRADE_BANDS[band].single;
  const disc   = MULTI_SUBJECT_DISCOUNT[Math.min(subjects, 3)] || 0;
  const bill   = SCHOOL_BILLING[billing] || SCHOOL_BILLING.monthly;
  const perSubPerMonth = base * (1 - disc);
  const subtotal = perSubPerMonth * subjects * bill.months;
  const total    = Math.round(subtotal * (1 - bill.discount));
  const fullPay  = base * subjects * bill.months;
  return { total, perMonth: Math.round(total / bill.months), saving: fullPay - total };
}

/**
 * Calculate the total price for a professional course given billing period.
 *
 * @param {string} slug    - key in PRO_COURSES
 * @param {string} billing - "monthly" | "quarterly" | "halfyearly" | "yearly"
 * @returns {{ total: number, perMonth: number, saving: number }|null}
 */
export function proPrice(slug, billing = "monthly") {
  const c    = PRO_COURSES[slug];
  if (!c) return null;
  const bill = PRO_BILLING[billing] || PRO_BILLING.monthly;
  const subtotal = c.monthly * bill.months;
  const total    = Math.round(subtotal * (1 - bill.discount));
  return { total, perMonth: Math.round(total / bill.months), saving: subtotal - total };
}
