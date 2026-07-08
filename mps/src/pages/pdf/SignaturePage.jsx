import { View, Text } from "@react-pdf/renderer";
import styles from "./styles";

export default function SignaturePage({ proposal, client }) {
  const signature = proposal.signature || {};

  return (
    <View style={styles.twoColSection} wrap={false}>

      {/* ── LEFT: Section heading ── */}
      <View style={styles.twoColLeft}>
        <Text style={styles.sectionHeadingLarge}>Signature</Text>
      </View>

      {/* ── RIGHT: Content ── */}
      <View style={styles.twoColRight}>

        <Text style={[styles.paragraph, { marginBottom: 14 }]}>
          Thank you for considering Manzio Creative Studio for your upcoming
          project needs. We are confident that our expertise and creativity
          will bring your vision to life and make a lasting impression on
          your audience.
        </Text>

        <View style={styles.sigRow}>
          {/* Company */}
          <View style={styles.sigBlock}>
            <Text style={styles.colLabel}>Authorized Signature</Text>
            <View style={styles.sigLine} />
            <Text style={styles.sigName}>
              {signature.preparedBy || "Manzio Creative Studio"}
            </Text>
            <Text style={styles.sigRole}>Project Manager</Text>
          </View>

          {/* Client */}
          {signature.clientSigRequired && (
            <View style={styles.sigBlock}>
              <Text style={styles.colLabel}>Client Signature</Text>
              <View style={styles.sigLine} />
              <Text style={styles.sigName}>Authorized Signatory</Text>
              <Text style={styles.sigRole}>Date: ____________</Text>
            </View>
          )}
        </View>

        {signature.companySeal && (
          <View style={{ marginTop: 20, alignItems: "flex-start" }}>
            <View style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              borderWidth: 1.5,
              borderColor: "#1A1A1A",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Text style={{ fontSize: 9, color: "#1A1A1A", fontFamily: "Helvetica-Bold", textAlign: "center" }}>
                COMPANY{"\n"}SEAL
              </Text>
            </View>
          </View>
        )}

      </View>
    </View>
  );
}