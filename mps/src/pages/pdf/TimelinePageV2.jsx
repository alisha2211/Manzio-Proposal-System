import { View, Text } from "@react-pdf/renderer";
import styles from "./stylesV2";

export default function TimelinePageV2({ proposal }) {
  const timeline = proposal.timeline || [];

  if (timeline.length === 0) return null;

  return (
    // Allow the timeline section to break across pages dynamically
    <View style={styles.twoColSection}>
      {/* ── LEFT: Section heading ── */}
      <View style={styles.twoColLeft}>
        <Text style={styles.sectionHeadingLarge}>Timeline</Text>
        <Text style={styles.sectionMeta}>
          {timeline.length} phase{timeline.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* ── RIGHT: Numbered phases ── */}
      <View style={styles.twoColRight}>
        <Text style={[styles.paragraph, { marginBottom: 14 }]}>
          Our proposed execution schedule structured by key milestones to ensure high quality and timely delivery:
        </Text>

        <View>
          {timeline.map((item, index) => {
            const isLast = index === timeline.length - 1;
            return (
              // Each phase is kept together (wrap={false}) but the section can break between phases
              <View
                key={item.id || index}
                style={[
                  styles.timelineItem,
                  isLast && { borderBottomWidth: 0 }
                ]}
                wrap={false}
              >

                {/* Phase number: 01, 02… */}
                <View style={{ width: 32, flexShrink: 0, paddingTop: 2 }}>
                  <Text style={styles.timelineNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </View>

                {/* Phase content: title + week + description */}
                <View style={{ flex: 1, flexShrink: 0 }}>

                  {/* Title row — explicit View wrappers to prevent react-pdf height collapse */}
                  <View style={styles.timelineTitleRow}>
                    <View style={styles.timelineTitleWrap}>
                      <Text style={styles.timelineTitle}>
                        {item.title || item.week || `Phase ${index + 1}`}
                      </Text>
                    </View>
                    {item.week && !item.title && (
                      // Only show week as duration if we used the title fallback above
                      null
                    )}
                    {item.week && item.title && (
                      <View style={styles.timelineDurationWrap}>
                        <Text style={styles.timelineDuration}>{item.week}</Text>
                      </View>
                    )}
                    {!item.title && item.week && (
                      // week used as title, so no separate duration to show
                      null
                    )}
                  </View>

                  {/* Description */}
                  {item.task ? (
                    <Text style={styles.timelineDesc}>{item.task}</Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
