import { View, Text } from "@react-pdf/renderer";
import styles, { BRAND } from "./styles";

const PHASE_ACCENTS = [
  BRAND.teal,
  BRAND.orange,
  BRAND.gold,
  BRAND.tealMid,
  BRAND.tealLight,
];

export default function TimelinePage({ proposal }) {
  const timeline = proposal.timeline || [];

  if (timeline.length === 0) return null;

  return (
    <View style={styles.twoColSection} wrap={false}>
      {/* ── LEFT: Section heading ── */}
      <View style={styles.twoColLeft}>
        <Text style={styles.sectionHeadingLarge}>Timeline</Text>
      </View>

      {/* ── RIGHT: Content ── */}
      <View style={styles.twoColRight}>
        <Text style={[styles.paragraph, { marginBottom: 14 }]}>
          During the pre-production phase, our team will work closely with you to
          conceptualize and develop a solution that effectively communicates your
          message. We will be brainstorming ideas, outline the strategy, and
          create a compelling plan that highlights the key features.
        </Text>

        {/* Phase boxes */}
        {timeline.map((item, index) => (
          <View key={item.id || index} style={styles.refPhaseBox} wrap={false}>
            {/* Coloured left-accent bar */}
            <View
              style={[
                styles.refPhaseAccent,
                {
                  backgroundColor: PHASE_ACCENTS[index % PHASE_ACCENTS.length],
                },
              ]}
            />

            {/* Phase content */}
            <View style={styles.refPhaseContent}>
              <Text style={styles.refPhaseTitle}>
                Phase {String(index + 1).padStart(2, "0")} — {item.week || `Phase ${index + 1}`}
              </Text>
              <Text style={styles.refPhaseDesc}>
                {item.task || "Pending details"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
