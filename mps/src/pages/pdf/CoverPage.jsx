import { View, Text, Image } from "@react-pdf/renderer";
import styles, { BRAND } from "./styles";

// ── Design tokens for Template 1 ───────────────────────────────
const C = {
  purple:  "#4F46E5",
  navy:    "#0F172A",
  muted:   "#6B7280",
  white:   "#FFFFFF",
  bg:      "#F5F4FF",   // soft lavender page background
  blob1:   "#C7D2FE",   // indigo-200  (decorative circles)
  card:    "#FFFFFF",
  border:  "#E5E7EB",
  iconBg:  "#EEF2FF",
};

// Reusable tiny divider
function Divider({ width = 28 }) {
  return (
    <View
      style={{
        width,
        height: 2.5,
        backgroundColor: C.purple,
        borderRadius: 2,
        marginVertical: 10,
      }}
    />
  );
}

// Info column inside the bottom card
function InfoCol({ label, value }) {
  return (
    <View style={{ flex: 1 }}>
      {/* Icon circle */}
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: C.iconBg,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 2,
            borderWidth: 1.5,
            borderColor: C.purple,
          }}
        />
      </View>

      {/* Label */}
      <Text
        style={{
          fontSize: 7.5,
          fontFamily: "Helvetica-Bold",
          color: C.muted,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </Text>

      {/* Short purple underline */}
      <View
        style={{
          width: 20,
          height: 2,
          backgroundColor: C.purple,
          borderRadius: 1,
          marginBottom: 6,
        }}
      />

      {/* Value */}
      <Text
        style={{
          fontSize: 10.5,
          fontFamily: "Helvetica-Bold",
          color: C.navy,
          lineHeight: 1.4,
        }}
      >
        {value || "—"}
      </Text>
    </View>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function CoverPage({
  proposal,
  client,
  settings,
  logo,
  brandStrip,
}) {
  const companyName =
    settings?.companyName ||
    proposal.signature?.preparedBy ||
    "Manzio Creative Studio";

  const companyEmail = settings?.email || "";
  const clientName   = client?.name  || "—";
  const clientEmail  = client?.email || "";
  const pdfTemplate  = proposal.signature?.pdfTemplate || 'template1';

  // Render Template 2 (Beige header block at top of continuous page)
  if (pdfTemplate === 'template2') {
    return (
      <View
        style={{
          backgroundColor: "#F5F0E8", // warm beige
          paddingHorizontal: 48,
          paddingTop: 56,
          paddingBottom: 48,
          flexDirection: "column",
        }}
      >
        {/* Company Logo or Text Name */}
        <View style={{ marginBottom: 40 }}>
          {logo ? (
            <Image src={logo} style={{ height: 32, maxWidth: 130, objectFit: "contain" }} />
          ) : (
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Helvetica-Bold",
                color: BRAND.ink,
              }}
            >
              {companyName}
            </Text>
          )}
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 36,
            fontFamily: "Helvetica-Bold",
            color: BRAND.ink,
            lineHeight: 1.15,
            marginBottom: 36,
          }}
        >
          {proposal.title || "Business Proposal"}
        </Text>

        {/* Company · Client Columns */}
        <View style={{ flexDirection: "row", gap: 60 }}>
          {/* Company Column */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: BRAND.muted,
                marginBottom: 6,
              }}
            >
              Company
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Helvetica-Bold",
                color: BRAND.ink,
                marginBottom: 2,
              }}
            >
              {companyName}
            </Text>
            {companyEmail ? (
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Helvetica",
                  color: BRAND.muted,
                }}
              >
                {companyEmail}
              </Text>
            ) : null}
          </View>

          {/* Client Column */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: BRAND.muted,
                marginBottom: 6,
              }}
            >
              Client
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Helvetica-Bold",
                color: BRAND.ink,
                marginBottom: 2,
              }}
            >
              {clientName}
            </Text>
            {clientEmail ? (
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Helvetica",
                  color: BRAND.muted,
                }}
              >
                {clientEmail}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  // Render Template 1 (Classic colorful lavender design with blobs)
  const category    = client?.industry || proposal.category || "Creative Services";
  const description = proposal.description || `This proposal explains the scope of work,\ntimeline, and pricing for ${client?.name ? client.name : "your organisation"}.`;

  return (
    <View
      style={{
        backgroundColor: C.bg,
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* ── HEADER: Logo left · Brand strip right (flush to very top) ── */}
      <View style={{ flexDirection: "row", height: 52 }}>
        {/* Logo on white background */}
        <View
          style={{
            width: 172,
            height: 52,
            backgroundColor: C.white,
            paddingLeft: 36,
            justifyContent: "center",
          }}
        >
          <Image
            src={logo}
            style={{ width: 110, height: 38, objectFit: "contain" }}
          />
        </View>

        {/* Colorful brand strip fills the rest */}
        <Image
          src={brandStrip}
          style={{ flex: 1, height: 52, objectFit: "fill" }}
        />
      </View>

      {/* ── DECORATIVE BLOBS ── */}
      <View
        style={{
          position: "absolute",
          bottom: 120,
          left: -30,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: C.blob1,
          opacity: 0.35,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 60,
          right: -30,
          width: 170,
          height: 170,
          borderRadius: 85,
          backgroundColor: C.blob1,
          opacity: 0.25,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 140,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: C.blob1,
          opacity: 0.18,
        }}
      />

      {/* ── CENTER CONTENT ── */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 56,
          paddingTop: 40,
          paddingBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Helvetica-Bold",
            color: C.purple,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 0,
          }}
        >
          PROPOSAL
        </Text>

        <Divider width={32} />

        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 40,
            color: C.navy,
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: 14,
          }}
        >
          {proposal.title || "Business Proposal"}
        </Text>

        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 15,
            color: C.purple,
            textAlign: "center",
            marginBottom: 0,
          }}
        >
          {category}
        </Text>

        <Divider width={32} />

        <Text
          style={{
            fontFamily: "Helvetica",
            fontSize: 11,
            color: C.muted,
            textAlign: "center",
            lineHeight: 1.65,
            maxWidth: 320,
          }}
        >
          {description}
        </Text>
      </View>

      {/* ── BOTTOM INFO CARD ── */}
      <View
        style={{
          marginHorizontal: 36,
          marginBottom: 52,
          backgroundColor: C.card,
          borderRadius: 14,
          paddingVertical: 22,
          paddingHorizontal: 28,
          flexDirection: "row",
          borderWidth: 1,
          borderColor: C.border,
        }}
      >
        <InfoCol
          label="PREPARED FOR"
          value={client?.name}
        />
        <View style={{ width: 1, backgroundColor: C.border, marginHorizontal: 18 }} />
        <InfoCol
          label="PREPARED BY"
          value={companyName}
        />
        <View style={{ width: 1, backgroundColor: C.border, marginHorizontal: 18 }} />
        <InfoCol
          label="DATE"
          value={proposal.createdAt}
        />
      </View>
    </View>
  );
}