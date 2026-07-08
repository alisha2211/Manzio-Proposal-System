import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import styles from "./styles";

// Assets
import ManzioLogo from "./assets/manziologo.png";
import BrandStrip from "./assets/brand-strip.png";

// Components
import PdfHeader from "./PdfHeader";
import CoverPage from "./CoverPage";
import OverviewPage from "./OverviewPage";
import ScopePage from "./ScopePage";
import PricingPage from "./PricingPage";
import TimelinePage from "./TimelinePage";
import TermsPage from "./TermsPage";
import SignaturePage from "./SignaturePage";

export default function ProposalPDF({
  proposal,
  client,
  totals,
  settings,
}) {
  const authorName =
    settings?.companyName || "Manzio Technologies";

  const websiteUrl =
    settings?.website || "www.manzio.com";

  const pdfTemplate = proposal.signature?.pdfTemplate || 'template1';

  // --- TEMPLATE 2: Layout Continuity Design ---
  if (pdfTemplate === 'template2') {
    return (
      <Document
        title={proposal.title || "Business Proposal"}
        author={authorName}
        subject="Business Proposal"
      >
        <Page
          size="A4"
          style={styles.page}
        >


          {/* Footer */}
          <View
            style={styles.footer}
            fixed
          >
            <Text style={{ fontSize: 8, color: "#6B7280" }}>
              <Text style={{ color: "#7C3AED", fontFamily: "Helvetica-Bold" }}>TEL </Text>{settings?.phone || "+91 9495929458"}   •   <Text style={{ color: "#7C3AED", fontFamily: "Helvetica-Bold" }}>WEB </Text>{settings?.website || "www.manziostudio.com"}   •   <Text style={{ color: "#7C3AED", fontFamily: "Helvetica-Bold" }}>EMAIL </Text>{settings?.email || "info@manziostudio.com"}
            </Text>

            <Text
              style={{ fontSize: 8, color: "#6B7280" }}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>

          {/* Cover Header */}
          <CoverPage
            proposal={proposal}
            client={client}
            settings={settings}
            logo={ManzioLogo}
            brandStrip={BrandStrip}
          />

          {/* Overview */}
          <OverviewPage
            proposal={proposal}
          />

          {/* Scope */}
          <ScopePage
            proposal={proposal}
          />

          {/* Pricing */}
          <PricingPage
            proposal={proposal}
            totals={totals}
          />

          {/* Timeline */}
          <TimelinePage
            proposal={proposal}
          />

          {/* Terms */}
          <TermsPage
            proposal={proposal}
            settings={settings}
          />

          {/* Signature */}
          <SignaturePage
            proposal={proposal}
            client={client}
            settings={settings}
          />

        </Page>
      </Document>
    );
  }

  // --- TEMPLATE 1: Classic Letterhead Design (Matches WhatsApp Image) ---
  return (
    <Document
      title={proposal.title || "Business Proposal"}
      author={authorName}
      subject="Business Proposal"
    >
      {/* Cover Page */}
      <Page
        size="A4"
        style={styles.coverPage}
      >


        {/* Footer */}
        <View
          style={styles.footer}
          fixed
        >
          <Text>
            <Text style={{ color: "#7C3AED", fontFamily: "Helvetica-Bold" }}>TEL </Text>{settings?.phone || "+91 9495929458"}   •   <Text style={{ color: "#7C3AED", fontFamily: "Helvetica-Bold" }}>WEB </Text>{settings?.website || "www.manziostudio.com"}   •   <Text style={{ color: "#7C3AED", fontFamily: "Helvetica-Bold" }}>EMAIL </Text>{settings?.email || "info@manziostudio.com"}
          </Text>

          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>

        <CoverPage
          proposal={proposal}
          client={client}
          settings={settings}
          logo={ManzioLogo}
          brandStrip={BrandStrip}
        />
      </Page>

      {/* Content Pages */}
      <Page
        size="A4"
        style={[styles.page, { paddingTop: 80, paddingHorizontal: 48 }]}
      >


        {/* Contact Footer matching WhatsApp image */}
        <View
          style={{
            position: "absolute",
            bottom: 24,
            left: 48,
            right: 48,
            flexDirection: "column",
          }}
          fixed
        >
          {/* Subtle line above the info */}
          <View style={{ height: 1, backgroundColor: "#E5E7EB", marginBottom: 6 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 8, color: "#6B7280" }}>
              <Text style={{ color: "#7C3AED", fontFamily: "Helvetica-Bold" }}>TEL </Text>{settings?.phone || "+91 9495929458"}   •   <Text style={{ color: "#7C3AED", fontFamily: "Helvetica-Bold" }}>WEB </Text>{settings?.website || "www.manziostudio.com"}   •   <Text style={{ color: "#7C3AED", fontFamily: "Helvetica-Bold" }}>EMAIL </Text>{settings?.email || "info@manziostudio.com"}
            </Text>
            <Text
              style={{ fontSize: 8, color: "#6B7280" }}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          </View>
        </View>

        {/* PdfHeader fixed at top */}
        <PdfHeader />

        {/* Overview */}
        <OverviewPage
          proposal={proposal}
        />

        {/* Scope */}
        <ScopePage
          proposal={proposal}
        />

        {/* Pricing */}
        <PricingPage
          proposal={proposal}
          totals={totals}
        />

        {/* Timeline */}
        <TimelinePage
          proposal={proposal}
        />

        {/* Terms */}
        <TermsPage
          proposal={proposal}
          settings={settings}
        />

        {/* Signature */}
        <SignaturePage
          proposal={proposal}
          client={client}
          settings={settings}
        />

      </Page>
    </Document>
  );
}