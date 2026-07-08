import { View, Text } from "@react-pdf/renderer";
import styles from "./styles";

export default function ScopePage({ proposal }) {
  const scope    = proposal.scopeItems?.filter(s => s.checked) || [];
  const pages    = proposal.pages?.filter(p => p.name) || [];
  const features = proposal.features || [];
  const tech     = proposal.techStack;

  const hasScope    = scope.length > 0;
  const hasPages    = pages.length > 0;
  const hasFeatures = features.length > 0;
  const hasTech     = tech && (tech.frontend || tech.backend || tech.database || tech.hosting);

  if (!hasScope && !hasPages && !hasFeatures && !hasTech) return null;

  return (
    <View style={styles.twoColSection} wrap={false}>
      {/* ── LEFT: Section heading ── */}
      <View style={styles.twoColLeft}>
        <Text style={styles.sectionHeadingLarge}>Scope</Text>
      </View>

      {/* ── RIGHT: Content ── */}
      <View style={styles.twoColRight}>
        {/* Scope of Work */}
        {hasScope && (
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.colLabel, { marginBottom: 8 }]}>Scope of Work</Text>
            {scope.map((item, i) => (
              <View key={item.id || i} style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" }}>
                <Text style={{ width: 10, fontSize: 9.5, color: "#7C3AED", marginTop: 1 }}>•</Text>
                <Text style={styles.paragraph}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Website Pages */}
        {hasPages && (
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.colLabel, { marginBottom: 8 }]}>Pages</Text>
            <View style={styles.refTable}>
              <View style={styles.refTableHeader}>
                <Text style={[styles.refTableHeaderItem, { width: "35%" }]}>Page</Text>
                <Text style={[styles.refTableHeaderItem, { flex: 1 }]}>Description</Text>
              </View>
              {pages.map((p, i) => (
                <View key={p.id || i} style={styles.refTableRow}>
                  <Text style={[styles.refTableRowItemName, { width: "35%" }]}>{p.name}</Text>
                  <Text style={[styles.refTableRowItemDesc, { flex: 1 }]}>{p.description}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Features */}
        {hasFeatures && (
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.colLabel, { marginBottom: 8 }]}>Features</Text>
            <View style={styles.chipsContainer}>
              {features.map((f, i) => (
                <View key={i} style={styles.chip}>
                  <Text>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tech Stack */}
        {hasTech && (
          <View>
            <Text style={[styles.colLabel, { marginBottom: 8 }]}>Technology Stack</Text>
            <View style={styles.techGrid}>
              {[
                { label: "Frontend", value: tech.frontend },
                { label: "Backend",  value: tech.backend  },
                { label: "Database", value: tech.database },
                { label: "Hosting",  value: tech.hosting  },
              ].filter(t => t.value).map((t, i) => (
                <View key={i} style={styles.techCard}>
                  <Text style={styles.colLabel}>{t.label}</Text>
                  <Text style={{ fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#111827" }}>{t.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}