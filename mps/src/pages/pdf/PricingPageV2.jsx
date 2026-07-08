import { View, Text } from "@react-pdf/renderer";
import styles from "./stylesV2";

export default function PricingPageV2({ proposal, totals }) {
  const items = proposal.items || [];
  const currency = proposal.currency || "$";
  const paySchedule = proposal.paymentSchedule || [];

  const subtotal = totals?.subtotal || 0;
  const discount = totals?.discountAmt || 0;
  const tax = totals?.taxAmt || 0;
  const total = totals?.total || 0;

  return (
    // No wrap={false} — allow this section to break across pages
    <View style={styles.twoColSection}>
      {/* ── LEFT: Section heading ── */}
      <View style={styles.twoColLeft}>
        <Text style={styles.sectionHeadingLarge}>Investment</Text>
      </View>

      {/* ── RIGHT: Content ── */}
      <View style={styles.twoColRight}>
        <Text style={[styles.paragraph, { marginBottom: 12 }]}>
          The investment details and payment terms for the proposed project:
        </Text>

        {/* Pricing table */}
        <View style={styles.refTable}>
          <View style={styles.refTableHeader}>
            <Text style={[styles.refTableHeaderItem, { width: "65%" }]}>Description</Text>
            <Text style={[styles.refTableHeaderPrice, { width: "35%" }]}>Amount ({currency})</Text>
          </View>
          {items.map((item, i) => {
            const lineTotal = (item.qty || 0) * (item.rate || 0);
            return (
              <View key={i} style={styles.refTableRow} wrap={false}>
                <View style={[styles.refTableRowItem, { width: "65%" }]}>
                  <Text style={styles.refTableRowItemName}>{item.desc}</Text>
                  {item.longDesc ? (
                    <Text style={styles.refTableRowItemDesc}>{item.longDesc}</Text>
                  ) : null}
                </View>
                <Text style={[styles.refTableRowPrice, { width: "35%" }]}>
                  {lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Minimal Pricing Summary Block */}
        <View style={{ marginTop: 12, width: "100%", alignSelf: "flex-end" }} wrap={false}>
          <View style={styles.priceSummaryRow}>
            <Text style={styles.priceSummaryLabel}>Subtotal</Text>
            <Text style={styles.priceSummaryValue}>
              {currency} {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          {discount > 0 && (
            <View style={styles.priceSummaryRow}>
              <Text style={styles.priceSummaryLabel}>Discount</Text>
              <Text style={styles.priceSummaryValue}>
                -{currency} {discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          )}
          {tax > 0 && (
            <View style={styles.priceSummaryRow}>
              <Text style={styles.priceSummaryLabel}>Estimated Tax</Text>
              <Text style={styles.priceSummaryValue}>
                {currency} {tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          )}
          <View style={styles.priceTotalRow}>
            <Text style={styles.priceTotalLabel}>Total Investment</Text>
            <Text style={styles.priceTotalValue}>
              {currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Payment Schedule Table (if provided) */}
        {paySchedule.length > 0 && (
          <View style={{ marginTop: 20, width: "100%" }}>
            <Text style={[styles.colLabel, { marginBottom: 6 }]}>Payment Schedule</Text>
            <View style={styles.refTable}>
              <View style={styles.refTableHeader}>
                <Text style={[styles.refTableHeaderItem, { flex: 1 }]}>Milestone</Text>
                <Text style={[styles.refTableHeaderPrice, { width: 60, textAlign: "center" }]}>Split</Text>
                <Text style={[styles.refTableHeaderPrice, { width: 80 }]}>Due ({currency})</Text>
              </View>
              {paySchedule.map((p, i) => {
                const milestoneAmount = (total * p.percent) / 100;
                return (
                  <View key={p.id || i} style={styles.payTableRow} wrap={false}>
                    <Text style={styles.payTableMilestone}>{p.label}</Text>
                    <Text style={styles.payTablePct}>{p.percent}%</Text>
                    <Text style={styles.payTableAmt}>
                      {milestoneAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Pricing Notes */}
        <View style={styles.noteBox} wrap={false}>
          <Text style={styles.noteText}>• Prices are exclusive of any additional third-party licensing unless specified.</Text>
          <Text style={styles.noteText}>• Additional features requested after approval will be quoted separately.</Text>
          <Text style={styles.noteText}>• Hosting, domain renewal, and maintenance are billed separately unless included.</Text>
        </View>
      </View>
    </View>
  );
}
