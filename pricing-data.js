// pricing-data.js
// ─────────────────────────────────────────────────────────────
// Single source of truth for Learners Academy school pricing.
// pricing.html, course-detail.html, courses.html and dashboard.html
// all import this — so a discount change only ever happens here.
//
// Model: each course row in Supabase (`courses.price_now`) stores the
// SINGLE-SUBJECT sticker price for that grade band (₹4,500 for
// Grade 6–10, ₹7,000 for Grade 11–12 — set by staff in admin.html,
// same as any other course). The multi-subject discount below is
// layered on top automatically, based on how many DISTINCT subjects
// from the same grade band are sitting in the student's cart.
// ─────────────────────────────────────────────────────────────

export const GRADE_BANDS = {
  lower: { label: "Grade 6–10", min: 6, max: 10, single: 4500 },
  upper: { label: "Grade 11–12", min: 11, max: 12, single: 7000 },
};

// key = number of distinct subjects in the same band; 3 covers "3+"
export const MULTI_SUBJECT_DISCOUNT = { 1: 0, 2: 0.25, 3: 0.30 };

/**
 * Parses a course id like "math-grade-8" → { subject: "math", grade: 8, band: "lower" }.
 * Returns null for ids that don't follow the school "<subject>-grade-<n>"
 * convention (professional-track courses like "sql-mastery" are left alone —
 * they're always priced at face value, never bundled).
 */
export function parseCourseId(courseId) {
  const m = /^(.+)-grade-(\d+)$/.exec(courseId || "");
  if (!m) return null;
  const grade = Number(m[2]);
  const band = grade <= GRADE_BANDS.lower.max ? "lower" : "upper";
  return { subject: m[1], grade, band };
}

function discountForCount(count) {
  if (count >= 3) return MULTI_SUBJECT_DISCOUNT[3];
  return MULTI_SUBJECT_DISCOUNT[count] ?? 0;
}

/**
 * Prices a full cart. Each item needs { course_id, quantity, price_now, is_free }.
 *
 * Returns:
 *   items       — same items, each with unitPrice / lineTotal / band / discount added
 *   total       — grand total across the whole cart
 *   bandDiscount— { lower: 0|0.25|0.30, upper: 0|0.25|0.30 } — the discount currently applied
 *   bandCount   — { lower: n, upper: n } — distinct subjects per band, for showing a
 *                 "add one more subject to unlock 30% off" style nudge in the UI
 */
export function priceCart(items) {
  const bandSubjects = { lower: new Set(), upper: new Set() };
  items.forEach(item => {
    if (item.is_free) return;
    const parsed = parseCourseId(item.course_id);
    if (!parsed) return;
    bandSubjects[parsed.band].add(parsed.subject);
  });

  const bandDiscount = {
    lower: discountForCount(bandSubjects.lower.size),
    upper: discountForCount(bandSubjects.upper.size),
  };

  let total = 0;
  const priced = items.map(item => {
    const qty = item.quantity || 1;

    if (item.is_free) {
      return { ...item, unitPrice: 0, lineTotal: 0, band: null, discount: 0 };
    }

    const parsed = parseCourseId(item.course_id);
    if (!parsed) {
      // Professional / non-school course — flat price, no bundling
      const unitPrice = Number(item.price_now || 0);
      const lineTotal = unitPrice * qty;
      total += lineTotal;
      return { ...item, unitPrice, lineTotal, band: null, discount: 0 };
    }

    const discount = bandDiscount[parsed.band];
    const base = Number(item.price_now || GRADE_BANDS[parsed.band].single);
    const unitPrice = Math.round(base * (1 - discount));
    const lineTotal = unitPrice * qty;
    total += lineTotal;
    return { ...item, unitPrice, lineTotal, band: parsed.band, discount, bandLabel: GRADE_BANDS[parsed.band].label };
  });

  return {
    items: priced,
    total,
    bandDiscount,
    bandCount: { lower: bandSubjects.lower.size, upper: bandSubjects.upper.size },
  };
}
