import { View, Text } from "@react-pdf/renderer";
import styles from "./stylesV2";

export default function ScopePageV2({ proposal, title = "Scope", ...props }) {
  const scope    = proposal.scopeItems?.filter(s => s.checked) || [];
  const pages    = proposal.pages?.filter(p => p.name) || [];
  const features = proposal.features || [];
  const tech     = proposal.techStack;

  const hasScope    = scope.length > 0;
  const hasPages    = pages.length > 0;
  const hasFeatures = features.length > 0;
  const hasTech     = tech && (tech.frontend || tech.backend || tech.database || tech.hosting);

  if (!hasScope && !hasPages && !hasFeatures && !hasTech) return null;

  const sections = [];

  if (hasScope) {
    sections.push({
      type: "scope",
      render: () => (
        <View>
          <Text style={[styles.colLabel, { marginBottom: 6 }]}>Scope of Work</Text>
          {scope.map((item, i) => (
            <View key={item.id || i} style={styles.scopeItem} wrap={false}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.paragraph}>{item.label}</Text>
            </View>
          ))}
        </View>
      )
    });
  }

  if (hasPages) {
    sections.push({
      type: "pages",
      render: () => (
        <View>
          <Text style={[styles.colLabel, { marginBottom: 6 }]}>Sitemap & Pages</Text>
          <View style={styles.refTable}>
            <View style={styles.refTableHeader}>
              <Text style={[styles.refTableHeaderItem, { width: "35%" }]}>Page Name</Text>
              <Text style={[styles.refTableHeaderItem, { flex: 1 }]}>Scope & Functional Description</Text>
            </View>
            {pages.map((p, i) => (
              <View key={p.id || i} style={styles.refTableRow} wrap={false}>
                <Text style={[styles.refTableRowItemName, { width: "35%", fontSize: 9, fontFamily: "Helvetica-Bold" }]}>
                  {p.name}
                </Text>
                <Text style={[styles.refTableRowItemDesc, { flex: 1, fontSize: 8.5 }]}>
                  {p.description}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )
    });
  }

  if (hasFeatures) {
    sections.push({
      type: "features",
      render: () => (
        <View>
          <Text style={[styles.colLabel, { marginBottom: 6 }]}>Key Features</Text>
          <View style={{ flexDirection: "column" }}>
            {features.map((f, i) => {
              if (f === 'Admin Panel') {
                return (
                  <View key={i} style={[styles.scopeItem, { paddingLeft: 12 }]} wrap={false}>
                    <Text style={[styles.bulletPoint, { color: '#9CA3AF' }]}>◦</Text>
                    <Text style={styles.paragraph}>{f}</Text>
                  </View>
                );
              }
              return (
                <View key={i} style={styles.scopeItem} wrap={false}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.paragraph}>{f}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )
    });
  }

  if (hasTech) {
    sections.push({
      type: "tech",
      render: () => (
        <View>
          <Text style={[styles.colLabel, { marginBottom: 6 }]}>Technology Stack</Text>
          <View style={{ flexDirection: "column", borderTopWidth: 1, borderTopColor: "#E5E7EB" }}>
            {[
              { label: "Frontend", value: tech.frontend },
              { label: "Backend",  value: tech.backend  },
              { label: "Database", value: tech.database },
              { label: "Hosting",  value: tech.hosting  },
            ].filter(t => t.value).map((t, i) => (
              <View key={i} style={styles.techRow} wrap={false}>
                <Text style={styles.techLabel}>{t.label}</Text>
                <Text style={styles.techValue}>{t.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )
    });
  }

  return (
    <View {...props}>
      {sections.map((sect, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === sections.length - 1;
        return (
          <View
            key={sect.type}
            style={[
              styles.twoColSection,
              !isFirst && { paddingVertical: 10 },
            ]}
          >
            {/* ── LEFT: Section heading ── */}
            <View style={styles.twoColLeft}>
              {isFirst ? (
                <Text style={styles.sectionHeadingLarge}>{title}</Text>
              ) : null}
            </View>

            {/* ── RIGHT: Content ── */}
            <View style={styles.twoColRight}>
              {sect.render()}
            </View>
          </View>
        );
      })}
    </View>
  );
}
