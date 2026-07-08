import { View, Text } from "@react-pdf/renderer";
import styles, { BRAND } from "./styles";

export default function OverviewPage({ proposal, settings }) {
  const { projectOverview, proposedSolution, createdAt, status } = proposal;
  const senderName = proposal.signature?.preparedBy || settings?.companyName || "Manzio Creative Studio";
  const senderEmail = settings?.email || "hello@manzio.studio";
  const avatarInitials = senderName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || "M";
  const displayStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Draft";

  return (
    <View style={styles.twoColSection} wrap={false}>
      {/* ── LEFT: Section heading ── */}
      <View style={styles.twoColLeft}>
        <Text style={styles.sectionHeadingLarge}>Overview</Text>
      </View>

      {/* ── RIGHT: Content ── */}
      <View style={styles.twoColRight}>
        {/* Sender Profile */}
        <View style={[styles.profileCard, { marginBottom: 12 }]}>
          <View style={styles.profileAvatarRow}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>{avatarInitials}</Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{senderName}</Text>
              <Text style={styles.profileSub}>
                {createdAt || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {senderEmail}
              </Text>
            </View>
          </View>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>{displayStatus} Proposal</Text>
          </View>
        </View>

        {projectOverview ? (
          <Text style={[styles.paragraph, { marginBottom: 10 }]}>
            {projectOverview}
          </Text>
        ) : null}

        {proposedSolution ? (
          <Text style={[styles.paragraph, { marginBottom: 10 }]}>
            {proposedSolution}
          </Text>
        ) : null}

        {/* Objectives */}
        <View style={{ marginTop: 10 }}>
          <Text style={[styles.colLabel, { marginBottom: 6 }]}>Objectives</Text>
          <View style={{ flexDirection: "column" }}>
            {[
              "Build a professional, modern website",
              "Improve online visibility & SEO ranking",
              "Increase customer engagement and conversions",
              "Mobile-responsive design across all devices",
              "Fast loading performance & optimised UX",
              "Easy content management for the client",
            ].map((o, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" }}>
                <Text style={{ width: 10, fontSize: 9.5, color: "#7C3AED", marginTop: 1 }}>•</Text>
                <Text style={{ fontSize: 9.5, color: "#374151", flex: 1 }}>{o}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}