import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import styles from "./stylesV2";

// Assets from /assets/new as specified
import ManzioLogo from "./assets/new/gg.png";
import BrandStrip from "./assets/new/bandstrip.png";

// Components
import OverviewPage from "./OverviewPageV2";
import ScopePage from "./ScopePageV2";
import PricingPage from "./PricingPageV2";
import TimelinePage from "./TimelinePageV2";
import TermsPage from "./TermsPageV2";
import SignaturePage from "./SignaturePageV2";

export default function ProposalV2({
  proposal,
  client,
  totals,
  settings,
}) {
  const companyName =
    settings?.companyName ||
    proposal.signature?.preparedBy ||
    "Manzio Creative Studio";

  const companyEmail = settings?.email || "info@manziostudio.com";
  const companyPhone = settings?.phone || "+91 9495929458";
  const companyWebsite = settings?.website || "www.manziostudio.com";

  const clientName = client?.name || "—";
  const clientEmail = client?.email || "—";

  const category = client?.industry || proposal.category || "Creative Services";

  return (
    <Document
      title={proposal.title || "Business Proposal"}
      author={companyName}
      subject="Business Proposal"
    >
      <Page
        size="A4"
        style={styles.page}
      >


        {/* ── FOOTER: fixed at the bottom of all pages ── */}
        <View
          style={styles.footer}
          fixed
        >
          <View style={styles.footerDivider} />
          <View style={styles.footerContentRow}>
            <Text style={styles.footerText}>
              <Text style={styles.footerAccentLabel}>TEL </Text>{companyPhone}   •   <Text style={styles.footerAccentLabel}>WEB </Text>{companyWebsite}   •   <Text style={styles.footerAccentLabel}>EMAIL </Text>{companyEmail}
            </Text>
            <Text
              style={styles.footerText}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          </View>
        </View>

        {/* ── HEADER: 68px, white background, flat ── */}
        {/*
          Layout (absolute positioning):
          - BandStrip: top: 0, left: 155 (logo 24+107+12gap), right: 0, natural height ~32px
          - Logo: left: 24, vertically centered in 68px, height: 34px
        */}
        <View
          style={{
            position: "absolute",
            top:      0,
            left:     0,
            right:    0,
            height:   68,
            backgroundColor: "#FFFFFF",
          }}
          fixed
        >
          {/* Bandstrip: top edge flush with page top, starts after logo area + 12px gap, natural height */}
          <Image
            src={BrandStrip}
            style={{
              position: "absolute",
              top: 0,
              left: 155,   /* 24px margin + ~119px logo zone + 12px gap */
              right: 0,
              height: 32,  /* natural height of strip — do NOT scale vertically */
              objectFit: "fill", /* fill only horizontally, height is fixed */
            }}
          />

          {/* Logo: 24px from left edge, vertically centered in 68px header, 34px height */}
          <View
            style={{
              position: "absolute",
              left: 24,
              top: 0,
              width: 119,  /* ~20% of A4 595pt width */
              height: 68,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Image
              src={ManzioLogo}
              style={{
                height: 34,
                objectFit: "contain",
              }}
            />
          </View>
        </View>


        {/* ── HERO SECTION: Information Box (three columns) ── */}
        <View style={styles.heroBox}>
          {/* Column 1: Project Details */}
          <View style={styles.heroCol}>
            <Text style={styles.heroLabel}>Project</Text>
            <Text style={styles.heroTitle}>{proposal.title || "Business Proposal"}</Text>
            <Text style={styles.heroSubtitle}>{category}</Text>
          </View>

          {/* Column 2: Prepared By Details */}
          <View style={styles.heroCol}>
            <Text style={styles.heroLabel}>Prepared By</Text>
            <Text style={styles.heroValueBold}>{companyName}</Text>
            <Text style={styles.heroValueMuted}>{companyEmail}</Text>
          </View>

          {/* Column 3: Prepared For Details */}
          <View style={styles.heroCol}>
            <Text style={styles.heroLabel}>Prepared For</Text>
            <Text style={styles.heroValueBold}>{clientName}</Text>
            <Text style={styles.heroValueMuted}>{clientEmail}</Text>
          </View>
        </View>

        {/* ── SECTION FLOW (generously spaced two-column layouts) ── */}

        {/* Overview Section */}
        <OverviewPage
          proposal={proposal}
          settings={settings}
        />

        {/* Price Section */}
        <PricingPage
          proposal={proposal}
          totals={totals}
        />

        {/* Timeline Section */}
        <TimelinePage
          proposal={proposal}
        />

        {/* Extras Section (combining Scope, Pages, Features, and Tech Stack) */}
        <ScopePage
          proposal={proposal}
          title="Extras"
        />

        {/* Terms & Conditions Section */}
        <TermsPage
          proposal={proposal}
          settings={settings}
        />

        {/* Signature Section */}
        <SignaturePage
          proposal={proposal}
          client={client}
          settings={settings}
        />
      </Page>
    </Document>
  );
}
