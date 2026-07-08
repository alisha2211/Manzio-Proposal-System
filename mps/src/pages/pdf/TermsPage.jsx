import { View, Text } from "@react-pdf/renderer";
import styles from "./styles";

export default function TermsPage({ proposal, settings }) {
  const terms = proposal.terms || "";
  const companyName = settings?.companyName || proposal.signature?.preparedBy || "Manzio Creative Studio";

  return (
    <View style={styles.twoColSection}>

      {/* ── LEFT: Section heading ── */}
      <View style={styles.twoColLeft}>
        <Text style={styles.sectionHeadingLarge}>Terms</Text>
      </View>

      {/* ── RIGHT: Content ── */}
      <View style={styles.twoColRight}>

        {/* Terms & Conditions */}
        <Text style={[styles.colLabel, { marginBottom: 8 }]}>
          Terms & Conditions
        </Text>

        <View style={{ flexDirection: "column", gap: 4, marginBottom: 16 }}>
          {terms
            .split("\n")
            .filter(Boolean)
            .map((line, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <Text style={{ width: 10, fontSize: 9.5, color: "#7C3AED", marginTop: 1 }}>•</Text>
                <Text style={styles.paragraph}>{line}</Text>
              </View>
            ))}
        </View>

        {/* Confidentiality */}
        <Text style={[styles.colLabel, { marginBottom: 8 }]}>
          Confidentiality
        </Text>

        <Text style={styles.paragraph}>
          This proposal and all related information are confidential and
          intended solely for the client. It may not be copied, shared, or
          distributed without prior written consent from {companyName}.
        </Text>

      </View>
    </View>
  );
}