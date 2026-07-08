import { View, Text } from "@react-pdf/renderer";
import styles from "./stylesV2";

export default function OverviewPageV2({ proposal, settings }) {
  const { projectOverview, proposedSolution, createdAt, status } = proposal;
  const senderName = proposal.signature?.preparedBy || settings?.companyName || "Manzio Creative Studio";
  const displayStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Draft";
  const formattedDate = createdAt || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <View style={styles.twoColSection}>
      {/* ── LEFT: Section heading ── */}
      <View style={styles.twoColLeft}>
        <Text style={styles.sectionHeadingLarge}>Overview</Text>
        <Text style={styles.sectionMeta}>
          Status: {displayStatus}{"\n"}
          Date: {formattedDate}
        </Text>
      </View>

      {/* ── RIGHT: Content ── */}
      <View style={styles.twoColRight}>
        {projectOverview ? (
          <Text style={[styles.paragraph, { marginBottom: 12 }]}>
            {projectOverview}
          </Text>
        ) : null}

        {proposedSolution ? (
          <Text style={[styles.paragraph, { marginBottom: 14 }]}>
            {proposedSolution}
          </Text>
        ) : null}

        {/* Objectives */}
        <View style={{ marginTop: 10 }}>
          <Text style={[styles.colLabel, { marginBottom: 8 }]}>Objectives</Text>
          <View style={{ flexDirection: "column" }}>
            {[
              "Build a professional, modern website",
              "Improve online visibility & SEO ranking",
              "Increase customer engagement and conversions",
              "Mobile-responsive design across all devices",
              "Fast loading performance & optimised UX",
              "Easy content management for the client",
            ].map((o, i) => (
              <View key={i} style={styles.scopeItem} wrap={false}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.paragraph}>{o}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
