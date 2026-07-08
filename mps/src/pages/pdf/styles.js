import { StyleSheet } from "@react-pdf/renderer";

export const BRAND = {
  purple:  "#4F46E5", // Premium Indigo
  teal:    "#0D9488",
  green:   "#10B981",
  yellow:  "#F59E0B",
  orange:  "#F97316",
  red:     "#EF4444",
  pink:    "#EC4899",
  ink:     "#1F2937", // Deep grey-black
  muted:   "#6B7280", // Muted grey
  line:    "#E5E7EB", // Border line grey
  bg:      "#F9FAFB", // Light grey background
  white:   "#FFFFFF",
  gold:    "#D97706",
  tealMid: "#14B8A6",
  tealLight: "#2DD4BF",
};

export const BAND_COLORS = [
  BRAND.purple, BRAND.teal, BRAND.green,
  BRAND.yellow, BRAND.orange, BRAND.red, BRAND.pink,
];

export default StyleSheet.create({
  /* ── Page ── */
  page: {
    paddingTop: 0,
    paddingBottom: 80,
    paddingHorizontal: 0,
    backgroundColor: BRAND.white,
    fontFamily: "Helvetica",
    color: BRAND.ink,
    lineHeight: 1.6,
  },
  coverPage: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: "#F5F4FF", /* lavender — CoverPage fills edge-to-edge */
    fontFamily: "Helvetica",
    color: BRAND.ink,
    lineHeight: 1.6,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 52,
    backgroundColor: BRAND.white,
  },
  headerLabelRow: {
    position: "absolute",
    top: 52,
    left: 48,
    right: 48,
    height: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: BRAND.line,
    paddingBottom: 4,
  },

  /* ── Brand Header (Fixed top of every page) ── */
  band: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 420,
    height: 40,
  },
  bandImage: {
    width: 420,
    height: 40,
    objectFit: "fill",
  },
  bandTile: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bandText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: BRAND.white,
    letterSpacing: 0.5,
  },
  logoBlock: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "40%",
    height: 52,
    backgroundColor: BRAND.white,
    paddingLeft: 48,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: BRAND.line,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoMark: {
    width: 24,
    height: 24,
    backgroundColor: BRAND.purple,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  logoMarkText: {
    color: BRAND.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  logoName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: BRAND.ink,
    lineHeight: 1.1,
  },
  logoSub: {
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: BRAND.muted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 2,
  },

  /* ── Cover Page Layout ── */
  coverBlock: {
    paddingVertical: 36,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.line,
  },
  header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 40,
},

headerLogo: {
  width: 120,
  height: 42,
  objectFit: "contain",
},

headerStrip: {
  width: 290,
  height: 30,
  objectFit: "contain",
},
  coverTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 26,
    color: BRAND.purple,
    lineHeight: 1.2,
    marginBottom: 8,
  },
  coverSub: {
    fontFamily: "Helvetica",
    fontSize: 13,
    color: BRAND.muted,
    marginTop: 4,
    marginBottom: 24,
  },
  coverParties: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.line,
    marginTop: 10,
  },
  partyCol: {
    width: "48%",
  },

  /* ── Column Labels & Values ── */
  colLabel: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: BRAND.muted,
    marginBottom: 4,
  },
  colName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
  },
  colSub: {
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: BRAND.muted,
    marginTop: 2,
    lineHeight: 1.4,
  },

  /* ── Metadata Details Grid (Grey Box) ── */
  infoGrid: {
    flexDirection: "row",
    backgroundColor: BRAND.bg,
    borderRadius: 8,
    padding: 16,
    marginTop: 32,
    borderWidth: 1,
    borderColor: BRAND.line,
  },
  infoCell: {
    flex: 1,
  },
  infoValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
    marginTop: 2,
  },

  /* ── Two-Column Row Structure ── */
  sectionRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 22,
  },
  sectionLeft: {
    width: "30%",
    paddingRight: 20,
  },
  sectionRight: {
    width: "70%",
    justifyContent: "flex-start",
  },
  sectionHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: BRAND.purple,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  /* ── General Text ── */
  bulletText: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: BRAND.ink,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  dimText: {
    fontFamily: "Helvetica",
    color: BRAND.muted,
    fontSize: 9.5,
  },

  /* ── Scope Checklist ── */
  scopeContainer: {
    flexDirection: "column",
    gap: 6,
  },
  scopeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  checkMark: {
    fontFamily: "Helvetica-Bold",
    color: BRAND.purple,
    fontSize: 11,
  },

  /* ── Tables ── */
  table: {
    width: "100%",
    marginTop: 8,
    borderWidth: 1,
    borderColor: BRAND.line,
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: BRAND.line,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: BRAND.muted,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cell1: { width: "50%", fontSize: 9.5, fontFamily: "Helvetica", color: BRAND.ink },
  cell2: { width: "20%", fontSize: 9.5, fontFamily: "Helvetica", color: BRAND.ink, textAlign: "center" },
  cell3: { width: "30%", fontSize: 9.5, fontFamily: "Helvetica", color: BRAND.ink, textAlign: "right" },
  cellAmt: { width: "30%", fontSize: 9.5, fontFamily: "Helvetica-Bold", color: BRAND.ink, textAlign: "right" },

  /* ── Totals ── */
  totalsBox: {
    alignSelf: "flex-end",
    width: "50%",
    marginTop: 14,
    paddingRight: 10,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: BRAND.muted,
  },
  totalsFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingTop: 6,
    borderTopWidth: 1.5,
    borderTopColor: BRAND.purple,
    marginTop: 4,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: BRAND.purple,
  },

  /* ── Feature Chips ── */
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    backgroundColor: BRAND.bg,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: BRAND.purple,
    borderWidth: 1,
    borderColor: BRAND.line,
  },

  /* ── Tech Stack Grid ── */
  techGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  techCard: {
    width: "47%",
    backgroundColor: BRAND.bg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BRAND.line,
    padding: 10,
  },

  /* ── Payment Cards ── */
  paymentRow: {
    flexDirection: "row",
    gap: 10,
  },
  paymentCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: BRAND.line,
    borderRadius: 6,
    padding: 10,
    backgroundColor: BRAND.bg,
  },
  paymentPct: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: BRAND.purple,
    marginBottom: 2,
  },

  /* ── Timeline ── */
  timelineList: {
    flexDirection: "column",
    gap: 8,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 6,
  },
  timelineNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: BRAND.purple,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  timelineNumText: {
    color: BRAND.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
  },
  timelineInfo: {
    flexDirection: "column",
    flex: 1,
  },
  timelineWeek: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
  },

  /* ── Signatures ── */
  sigRow: {
    flexDirection: "row",
    gap: 40,
    marginTop: 20,
  },
  sigBlock: {
    width: "45%",
  },
  sigLine: {
    borderBottomWidth: 1,
    borderBottomColor: BRAND.muted,
    height: 36,
    marginBottom: 6,
  },
  sigName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
  },
  sigRole: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: BRAND.muted,
    marginTop: 2,
  },

  /* ── Note Box ── */
  noteBox: {
    marginTop: 14,
    backgroundColor: BRAND.bg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BRAND.line,
    padding: 10,
  },
  noteText: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: BRAND.ink,
    lineHeight: 1.5,
    marginBottom: 4,
  },

  /* ── Footer ── */
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: BRAND.line,
    paddingTop: 8,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: BRAND.muted,
  },

  // Uniform Paragraph style
  paragraph: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: BRAND.ink,
    lineHeight: 1.55,
  },
  coverLogoImage: {
    height: 40,
    maxWidth: 150,
    objectFit: "contain",
    marginBottom: 20,
  },
  coverLogoMark: {
    width: 32,
    height: 32,
    backgroundColor: BRAND.purple,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  coverLogoMarkText: {
    color: BRAND.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
  },
  headerLogoImage: {
    height: 24,
    maxWidth: 120,
    objectFit: "contain",
  },
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

  /* ── Missing Section Layouts ── */
  sectionBlock: {
    marginBottom: 20,
  },
  sectionCard: {
    backgroundColor: BRAND.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND.line,
    padding: 16,
    marginBottom: 16,
  },
  sectionCardTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: BRAND.purple,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  /* ── Overview Profile Card ── */
  profileCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BRAND.bg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND.line,
    padding: 12,
    marginBottom: 16,
  },
  profileAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BRAND.purple,
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarText: {
    color: BRAND.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  profileDetails: {
    flexDirection: "column",
  },
  profileName: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
  },
  profileSub: {
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: BRAND.muted,
    marginTop: 2,
  },
  profileBadge: {
    backgroundColor: "#EEF2F6",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  profileBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: BRAND.purple,
    textTransform: "uppercase",
  },

  /* ── Equation Row ── */
  eqRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BRAND.line,
  },
  eqBox: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  eqLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica",
    color: BRAND.muted,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  eqValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
  },
  eqOperator: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: BRAND.muted,
    marginHorizontal: 4,
  },
  eqFinalBox: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: BRAND.purple,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flex: 1.2,
  },
  eqFinalLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: BRAND.white,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  eqFinalValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: BRAND.white,
  },

  /* ── Phase & Timeline Cards ── */
  phaseContainer: {
    flexDirection: "column",
    gap: 12,
    marginTop: 8,
  },
  phaseCard: {
    flexDirection: "row",
    backgroundColor: BRAND.bg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BRAND.line,
    overflow: "hidden",
  },
  phaseContent: {
    flexDirection: "column",
    padding: 12,
    flex: 1,
  },
  phaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  phaseNumber: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  phaseName: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
  },
  phaseDescription: {
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: BRAND.muted,
    lineHeight: 1.4,
  },

  /* ── Two-Column Section Layout (Reference Design) ── */
  twoColSection: {
    flexDirection: "row",
    paddingVertical: 28,
    paddingHorizontal: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  twoColLeft: {
    width: "32%",
    paddingRight: 16,
  },
  twoColRight: {
    width: "68%",
  },
  sectionHeadingLarge: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
    lineHeight: 1.1,
  },

  /* ── Reference Pricing Table ── */
  refTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 10,
  },
  refTableHeader: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  refTableHeaderItem: {
    flex: 1,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: BRAND.muted,
  },
  refTableHeaderPrice: {
    width: 80,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: BRAND.muted,
    textAlign: "right",
  },
  refTableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems: "flex-start",
  },
  refTableRowItem: { flex: 1 },
  refTableRowItemName: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
    marginBottom: 2,
  },
  refTableRowItemDesc: {
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: BRAND.muted,
    lineHeight: 1.4,
  },
  refTableRowPrice: {
    width: 80,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: BRAND.ink,
    textAlign: "right",
    paddingTop: 1,
  },
  refTableTotalRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 10,
    backgroundColor: "#F9FAFB",
  },
  refTableTotalLabel: {
    flex: 1,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
  },
  refTableTotalValue: {
    width: 80,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
    textAlign: "right",
  },
  refTableNoteText: {
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: BRAND.muted,
    lineHeight: 1.4,
    marginTop: 8,
  },

  /* ── Reference Phase Boxes (Timeline) ── */
  refPhaseBox: {
    flexDirection: "row",
    marginBottom: 10,
  },
  refPhaseAccent: {
    width: 3,
    borderRadius: 2,
    marginRight: 10,
  },
  refPhaseContent: {
    flex: 1,
    paddingBottom: 2,
  },
  refPhaseTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
    marginBottom: 3,
  },
  refPhaseDesc: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: BRAND.muted,
    lineHeight: 1.45,
  },

  /* ── Cover Page (Reference Style) ── */
  coverRefContainer: {
    flex: 1,
    backgroundColor: BRAND.white,
    paddingHorizontal: 48,
    paddingTop: 48,
    paddingBottom: 60,
    flexDirection: "column",
  },
  coverRefLogoArea: {
    marginBottom: 48,
  },
  coverRefLogoImage: {
    height: 32,
    maxWidth: 130,
    objectFit: "contain",
  },
  coverRefCompanyText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
  },
  coverRefTitle: {
    fontSize: 38,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
    lineHeight: 1.1,
    marginBottom: 36,
  },
  coverRefBand: {
    flexDirection: "row",
    backgroundColor: "#F5F0E8",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  coverRefBandCol: {
    flex: 1,
  },
  coverRefBandLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: BRAND.muted,
    marginBottom: 6,
  },
  coverRefBandName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
    marginBottom: 2,
  },
  coverRefBandEmail: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: BRAND.muted,
  },
});