import { View, Text } from "@react-pdf/renderer";
import styles, { BRAND } from "./stylesV2";

export default function SignaturePageV2({ proposal, client }) {
  const signature = proposal.signature || {};

  return (
    <View style={styles.twoColSection} wrap={false}>
      {/* LEFT */}
      <View style={styles.twoColLeft}>
        <Text style={styles.sectionHeadingLarge}>Agreement</Text>
      </View>

      {/* RIGHT */}
      <View style={styles.twoColRight}>
        <Text style={[styles.paragraph, { marginBottom: 18 }]}>
          Thank you for considering our team for your project needs. We are
          confident that our expertise and structure will deliver
          high-quality, professional results.
        </Text>

        {/* Signature Row */}
        <View style={styles.sigRow}>

          {/* Company */}
          <View style={styles.sigBlock}>

            {/* Signature Line */}
            <View style={styles.sigLine} />

            {/* Label */}
            <Text style={[styles.colLabel, { marginTop: 8 }]}>
              AUTHORIZED REPRESENTATIVE
            </Text>

            {/* Company Name */}
            <Text style={styles.sigName}>
              {signature.preparedBy || "Manzio Creative Studio"}
            </Text>

            {/* Role */}
            <Text style={styles.sigRole}>
              Project Manager
            </Text>

          </View>

          {/* Client */}
          {signature.clientSigRequired && (
            <View style={styles.sigBlock}>

              {/* Signature Line */}
              <View style={styles.sigLine} />

              {/* Label */}
              <Text style={[styles.colLabel, { marginTop: 8 }]}>
                CLIENT ACCEPTANCE
              </Text>

              {/* Name */}
              <Text style={styles.sigName}>
                Authorized Signatory
              </Text>

              {/* Date */}
              <Text style={styles.sigRole}>
                Date: ______________________
              </Text>

            </View>
          )}

        </View>

        {/* Company Seal */}
        {signature.companySeal && (
          <View
            style={{
              marginTop: 28,
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: BRAND.muted,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 7.5,
                  color: BRAND.muted,
                  fontFamily: "Helvetica-Bold",
                  textAlign: "center",
                  letterSpacing: 0.5,
                  lineHeight: 1.3,
                }}
              >
                OFFICIAL{"\n"}SEAL
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}