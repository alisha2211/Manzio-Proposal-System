import { StyleSheet } from "@react-pdf/renderer";

/* ─────────────────────────────────────────────────────────────────────────────
   BRAND TOKENS
   ───────────────────────────────────────────────────────────────────────────── */
export const BRAND = {
  purple:     "#4F46E5",
  teal:       "#0D9488",
  green:      "#10B981",
  yellow:     "#F59E0B",
  orange:     "#F97316",
  red:        "#EF4444",
  pink:       "#EC4899",
  ink:        "#111827",
  inkSoft:    "#1F2937",
  muted:      "#6B7280",
  mutedLight: "#9CA3AF",
  line:       "#E5E7EB",
  lineSoft:   "#F3F4F6",
  bg:         "#F9FAFB",
  white:      "#FFFFFF",
  gold:       "#D97706",
  tealMid:    "#14B8A6",
  tealLight:  "#2DD4BF",
};

export const BAND_COLORS = [
  BRAND.purple, BRAND.teal, BRAND.green,
  BRAND.yellow, BRAND.orange, BRAND.red, BRAND.pink,
];

/* ─────────────────────────────────────────────────────────────────────────────
   A4 GEOMETRY
   595pt wide × 842pt tall
   Header  : 68pt  absolute at top
   Footer  : 36pt  absolute at bottom
   paddingTop = 84pt  (68 header + 16 breathing room)
   paddingBottom = 60pt (clears the footer)
   paddingHorizontal = 0pt (sections control their own margins at 48pt each)
   Content columns at 48pt inset:
     Left  col  30% of (595 - 96) = ~149pt
     Right col  70% of (595 - 96) = ~348pt
   ───────────────────────────────────────────────────────────────────────────── */
export default StyleSheet.create({

  /* ══════════════════════ PAGE ══════════════════════ */
  page: {
    paddingTop:        84,   // ← CRITICAL: clears the 68pt fixed header + 16pt gap
    paddingBottom:     80,   // ← clears the fixed footer
    paddingHorizontal: 0,
    backgroundColor:   BRAND.white,
    fontFamily:        "Helvetica",
    color:             BRAND.ink,
    lineHeight:        1.65,
  },

  /* ══════════════════════ WATERMARK ══════════════════════ */
  watermarkContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  watermarkImage: {
    width: 357,   /* exactly 60% of A4 width 595pt */
    height: 357,   /* maintain square aspect ratio */
    opacity: 0.05,
    objectFit: "contain",
  },

  /* ══════════════════════ HERO INFO BOX ══════════════════════ */
  heroBox: {
    marginHorizontal:  24,
    marginBottom:      36,
    backgroundColor:   "#F6F3FC",
    borderRadius:      18,
    borderWidth:       1,
    borderColor:       "#EEEAFB",
    paddingVertical:   36,
    paddingHorizontal: 40,
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "flex-start",
  },
  heroCol: {
    flex:         1,
    paddingRight: 16,
  },
  heroLabel: {
    fontSize:      7.5,
    fontFamily:    "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.8,
    color:         "#9CA3AF",
    marginBottom:  10,
  },
  heroTitle: {
    fontSize:   15,
    fontFamily: "Helvetica-Bold",
    color:      "#111827",
    lineHeight: 1.25,
  },
  heroSubtitle: {
    fontSize:   9,
    fontFamily: "Helvetica",
    color:      "#6B7280",
    marginTop:  5,
  },
  heroValueBold: {
    fontSize:     10.5,
    fontFamily:   "Helvetica-Bold",
    color:        "#111827",
    marginBottom: 4,
  },
  heroValueMuted: {
    fontSize:   9,
    fontFamily: "Helvetica",
    color:      "#6B7280",
  },

  /* ══════════════════════ EDITORIAL TWO-COLUMN LAYOUT ══════════════════════
     Every content section uses this exact grid.
     Left  column: section title  (30%)
     Right column: all content    (70%)
     Horizontal margins: 48pt both sides
     ────────────────────────────────────────────────────────────────────────── */
  twoColSection: {
    flexDirection:     "row",
    paddingVertical:   14,
    paddingHorizontal: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    /* NO wrap={false} here — sections must be allowed to flow across pages */
  },
  twoColLeft: {
    width:        "30%",
    paddingRight:  28,
    paddingTop:    2,
    flexShrink:    0,
  },
  twoColRight: {
    width:      "70%",
    flexShrink: 0,
  },

  /* ══════════════════════ TYPOGRAPHY SYSTEM ══════════════════════ */

  /* Section heading — serif, left column */
  sectionHeadingLarge: {
    fontSize:      24,
    fontFamily:    "Times-Bold",
    color:         "#111827",
    lineHeight:    1.15,
    letterSpacing: -0.2,
  },

  /* Small meta text below section heading (date, status) */
  sectionMeta: {
    fontSize:   8,
    fontFamily: "Helvetica",
    color:      "#9CA3AF",
    marginTop:  10,
    lineHeight: 1.7,
  },

  /* Body paragraph */
  paragraph: {
    fontFamily: "Helvetica",
    fontSize:   10,
    color:      "#374151",
    lineHeight: 1.72,
  },

  /* Uppercase label above sub-sections */
  colLabel: {
    fontSize:      7.5,
    fontFamily:    "Helvetica-Bold",
    letterSpacing: 1.3,
    textTransform: "uppercase",
    color:         "#9CA3AF",
    marginBottom:  8,
  },

  /* ══════════════════════ UNIVERSAL TABLE ══════════════════════
     One consistent table used everywhere.
     ────────────────────────────────────────────────────────────── */
  refTable: {
    width:        "100%",
    borderWidth:  1,
    borderColor:  "#E5E7EB",
    borderRadius: 6,
    overflow:     "hidden",
    marginTop:    10,
  },
  refTableHeader: {
    flexDirection:     "row",
    paddingVertical:   10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor:   "#FAFAFA",
  },
  refTableHeaderItem: {
    flex:          1,
    fontSize:      7.5,
    fontFamily:    "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    color:         "#9CA3AF",
  },
  refTableHeaderPrice: {
    width:         80,
    fontSize:      7.5,
    fontFamily:    "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    color:         "#9CA3AF",
    textAlign:     "right",
  },
  refTableRow: {
    flexDirection:     "row",
    paddingVertical:   12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems:        "flex-start",
  },
  refTableRowItem: {
    flex: 1,
  },
  refTableRowItemName: {
    fontSize:     10,
    fontFamily:   "Helvetica-Bold",
    color:        "#111827",
    marginBottom: 2,
  },
  refTableRowItemDesc: {
    fontSize:   9,
    fontFamily: "Helvetica",
    color:      "#6B7280",
    lineHeight: 1.5,
  },
  refTableRowPrice: {
    width:      80,
    fontSize:   10,
    fontFamily: "Helvetica",
    color:      "#111827",
    textAlign:  "right",
    paddingTop: 1,
  },

  /* ══════════════════════ PRICING SUMMARY ══════════════════════ */
  priceSummaryRow: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingVertical:   6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  priceSummaryLabel: {
    fontSize:   9.5,
    fontFamily: "Helvetica",
    color:      "#6B7280",
  },
  priceSummaryValue: {
    fontSize:   9.5,
    fontFamily: "Helvetica",
    color:      "#374151",
  },
  priceTotalRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
    paddingTop:     10,
    paddingBottom:  4,
  },
  priceTotalLabel: {
    fontSize:   11,
    fontFamily: "Helvetica-Bold",
    color:      "#111827",
  },
  priceTotalValue: {
    fontSize:   12,
    fontFamily: "Helvetica-Bold",
    color:      BRAND.purple,
  },

  /* ══════════════════════ PAYMENT SCHEDULE TABLE ══════════════════════ */
  payTableRow: {
    flexDirection:     "row",
    paddingVertical:   11,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems:        "center",
  },
  payTableMilestone: {
    flex:       1,
    fontSize:   10,
    fontFamily: "Helvetica-Bold",
    color:      "#111827",
  },
  payTablePct: {
    width:      52,
    fontSize:   9.5,
    fontFamily: "Helvetica",
    color:      "#6B7280",
    textAlign:  "center",
  },
  payTableAmt: {
    width:      80,
    fontSize:   10,
    fontFamily: "Helvetica-Bold",
    color:      "#111827",
    textAlign:  "right",
  },

  /* ══════════════════════ NOTE / CAVEAT BOX ══════════════════════ */
  noteBox: {
    marginTop:      12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop:     8,
  },
  noteText: {
    fontFamily:   "Helvetica",
    fontSize:     8.5,
    color:        "#9CA3AF",
    lineHeight:   1.6,
    marginBottom: 4,
  },

  /* ══════════════════════ BULLET LIST (scope / features / terms) ══════════════════════ */
  scopeItem: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    paddingVertical:   6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  bulletPoint: {
    width:      16,
    fontSize:   10,
    color:      "#9CA3AF",
    flexShrink: 0,
  },

  /* ══════════════════════ TECH STACK ROWS ══════════════════════ */
  techRow: {
    flexDirection:     "row",
    paddingVertical:   9,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems:        "center",
  },
  techLabel: {
    width:         "36%",
    fontSize:      7.5,
    fontFamily:    "Helvetica-Bold",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    color:         "#9CA3AF",
    flexShrink:    0,
  },
  techValue: {
    flex:       1,
    fontSize:   10,
    fontFamily: "Helvetica-Bold",
    color:      "#111827",
  },

  /* ══════════════════════ VERTICAL TIMELINE ══════════════════════
     Each item: number | content (title + duration + description)
     Wrapped in <View> to fix react-pdf flex height collapse bug.
     ────────────────────────────────────────────────────────────── */
  timelineItem: {
    flexDirection:     "row",
    paddingVertical:   16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems:        "flex-start",
  },
  timelineNumber: {
    width:         32,
    flexShrink:    0,
    fontSize:      8,
    fontFamily:    "Helvetica-Bold",
    color:         "#C4C4D4",
    letterSpacing: 0.6,
    paddingTop:    2,
  },
  timelineContent: {
    flex:       1,
    flexShrink: 0,
  },
  /* ── Title row: flex row with explicit View wrappers ── */
  timelineTitleRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    marginBottom:   5,
  },
  /* Applied on the wrapping View, not directly on Text */
  timelineTitleWrap: {
    flex:       1,
    flexShrink: 0,
    paddingRight: 12,
  },
  timelineTitle: {
    fontSize:   10.5,
    fontFamily: "Helvetica-Bold",
    color:      "#111827",
    lineHeight: 1.35,
  },
  timelineDurationWrap: {
    flexShrink: 0,
    width:      64,
    alignItems: "flex-end",
  },
  timelineDuration: {
    fontSize:   8.5,
    fontFamily: "Helvetica",
    color:      "#9CA3AF",
    textAlign:  "right",
  },
  timelineDesc: {
    fontSize:   9.5,
    fontFamily: "Helvetica",
    color:      "#6B7280",
    lineHeight: 1.65,
  },

   /* ══════════════════════ SIGNATURE ══════════════════════ */
sigRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 24,
  gap: 32,
},

sigBlock: {
  flex: 1,
},

sigLine: {
  height: 35,                  // Space for signing
  borderBottomWidth: 1,
  borderBottomColor: "#D1D5DB",
  marginBottom: 8,
},

colLabel: {
  fontSize: 7.5,
  fontFamily: "Helvetica-Bold",
  letterSpacing: 1.3,
  textTransform: "uppercase",
  color: "#9CA3AF",
  textAlign: "left",
  marginBottom: 6,
},

sigName: {
  fontSize: 10.5,
  fontFamily: "Helvetica-Bold",
  color: "#111827",
  marginBottom: 3,
},

sigRole: {
  fontSize: 8.5,
  fontFamily: "Helvetica",
  color: "#6B7280",
},

  /* ══════════════════════ FOOTER ══════════════════════ */
  footer: {
    position:      "absolute",
    bottom:        24,
    left:          48,
    right:         48,
    flexDirection: "column",
  },
  footerDivider: {
    height:          1,
    backgroundColor: "#E5E7EB",
    marginBottom:    7,
  },
  footerContentRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
  },
  footerText: {
    fontSize:   7.5,
    color:      "#9CA3AF",
    fontFamily: "Helvetica",
  },
  footerAccentLabel: {
    color:      BRAND.purple,
    fontFamily: "Helvetica-Bold",
  },
});
