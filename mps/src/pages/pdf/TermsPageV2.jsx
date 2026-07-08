import { View, Text } from "@react-pdf/renderer";
import styles from "./stylesV2";

export default function TermsPageV2({ proposal, settings, ...props }) {
  const terms = proposal.terms || "";
  const companyName = settings?.companyName || proposal.signature?.preparedBy || "Manzio Creative Studio";

  const termLines = terms.split("\n").filter(Boolean);

  const sections = [];

  // Add all terms bullet points
  termLines.forEach((line, idx) => {
    sections.push({
      type: `term-${idx}`,
      isTermsHeader: idx === 0,
      render: () => (
        <View style={styles.scopeItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.paragraph}>{line}</Text>
        </View>
      )
    });
  });

  // Add confidentiality block
  sections.push({
    type: "confidentiality",
    isConfidentialityHeader: true,
    render: () => (
      <View>
        <Text style={styles.paragraph}>
          This proposal and all related information are confidential and
          intended solely for the client. It may not be copied, shared, or
          distributed without prior written consent from {companyName}.
        </Text>
      </View>
    )
  });

  return (
    <View {...props}>
      {sections.map((sect, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === sections.length - 1;

        let leftContent = null;
        if (sect.isTermsHeader) {
          leftContent = <Text style={styles.sectionHeadingLarge}>Terms</Text>;
        } else if (sect.isConfidentialityHeader) {
          leftContent = <Text style={styles.sectionHeadingLarge}>Privacy</Text>;
        }

        let rightHeader = null;
        if (sect.isTermsHeader) {
          rightHeader = (
            <Text style={[styles.colLabel, { marginBottom: 8 }]}>
              Terms & Conditions
            </Text>
          );
        } else if (sect.isConfidentialityHeader) {
          rightHeader = (
            <Text style={[styles.colLabel, { marginBottom: 8 }]}>
              Confidentiality
            </Text>
          );
        }

        return (
          <View
            key={sect.type}
            style={[
              styles.twoColSection,
              !isFirst && !sect.isConfidentialityHeader && { paddingVertical: 4 },
              sect.isConfidentialityHeader && { paddingVertical: 12 },
              !isLast && { borderBottomWidth: 0 }
            ]}
            wrap={false}
          >
            {/* ── LEFT: Section heading ── */}
            <View style={styles.twoColLeft}>
              {leftContent}
            </View>

            {/* ── RIGHT: Content ── */}
            <View style={styles.twoColRight}>
              {rightHeader}
              {sect.render()}
            </View>
          </View>
        );
      })}
    </View>
  );
}
