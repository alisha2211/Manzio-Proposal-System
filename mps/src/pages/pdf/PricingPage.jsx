import { View, Text } from "@react-pdf/renderer";
import styles from "./styles";

export default function PricingPage({ proposal, totals }) {
  const items = proposal.items || [];
  const currency = proposal.currency || "$";
  const paySchedule = proposal.paymentSchedule || [];

  const subtotal = totals?.subtotal || 0;
  const discount = totals?.discountAmt || 0;
  const tax = totals?.taxAmt || 0;
  const total = totals?.total || 0;

  return (
    <View style={styles.twoColSection} wrap={false}>
      {/* ── LEFT: Section heading ── */}
      <View style={styles.twoColLeft}>
        <Text style={styles.sectionHeadingLarge}>Price</Text>
      </View>

      {/* ── RIGHT: Content ── */}
      <View style={styles.twoColRight}>
        <Text style={[styles.paragraph, { marginBottom: 10 }]}>
          The price breakdown of the total project cost:
        </Text>

        {/* Pricing table */}
        <View style={styles.refTable}>
          <View style={styles.refTableHeader}>
            <Text style={[styles.refTableHeaderItem, { width: "50%" }]}>Item</Text>
            <Text style={[styles.refTableHeaderPrice, { width: "25%", textAlign: "center" }]}>Cost ({currency})</Text>
            <Text style={[styles.refTableHeaderPrice, { width: "25%", textAlign: "right" }]}>% of Total</Text>
          </View>
          {items.map((item, i) => {
            const lineTotal = (item.qty || 0) * (item.rate || 0);
            const pctOfTotal = totals?.total > 0 ? ((lineTotal / totals.total) * 100).toFixed(0) : "—";
            return (
              <View key={i} style={styles.refTableRow} wrap={false}>
                <View style={[styles.refTableRowItem, { width: "50%" }]}>
                  <Text style={styles.refTableRowItemName}>{item.desc}</Text>
                </View>
                <Text style={{ width: "25%", fontSize: 9.5, fontFamily: "Helvetica", color: "#1F2937", textAlign: "center" }}>
                  {currency} {lineTotal.toLocaleString()}
                </Text>
                <Text style={{ width: "25%", fontSize: 9.5, fontFamily: "Helvetica", color: "#1F2937", textAlign: "right" }}>
                  {pctOfTotal}%
                </Text>
              </View>
            );
          })}
        </View>

        {/* Visual Equation Row */}
        <View style={styles.eqRow}>
          <View style={styles.eqBox}>
            <Text style={styles.eqLabel}>Subtotal</Text>
            <Text style={styles.eqValue}>{currency} {subtotal.toLocaleString()}</Text>
          </View>
          <Text style={styles.eqOperator}>-</Text>
          <View style={styles.eqBox}>
            <Text style={styles.eqLabel}>Discount</Text>
            <Text style={styles.eqValue}>{currency} {discount.toLocaleString()}</Text>
          </View>
          <Text style={styles.eqOperator}>+</Text>
          <View style={styles.eqBox}>
            <Text style={styles.eqLabel}>Taxes</Text>
            <Text style={styles.eqValue}>{currency} {tax.toLocaleString()}</Text>
          </View>
          <Text style={styles.eqOperator}>=</Text>
          <View style={styles.eqFinalBox}>
            <Text style={styles.eqFinalLabel}>Total Investment</Text>
            <Text style={styles.eqFinalValue}>{currency} {total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Pricing Notes */}
        <View style={[styles.noteBox, { marginTop: 12 }]}>
          <Text style={[styles.colLabel, { color: "#1A1A1A" }]}>Pricing Notes</Text>
          <Text style={styles.noteText}>• Prices are exclusive of any additional third-party licensing unless specified.</Text>
          <Text style={styles.noteText}>• Additional features requested after approval will be quoted separately.</Text>
          <Text style={styles.noteText}>• Hosting, domain renewal, and maintenance are billed separately unless included.</Text>
        </View>

        {/* Payment Schedule (if provided) */}
        {paySchedule.length > 0 && (
          <View style={{ marginTop: 18, width: "100%" }}>
            <Text style={[styles.colLabel, { marginBottom: 8 }]}>Payment Schedule</Text>
            <View style={styles.paymentRow}>
              {paySchedule.map((p, i) => (
                <View key={p.id || i} style={styles.paymentCard}>
                  <Text style={styles.paymentPct}>{p.percent}%</Text>
                  <Text style={styles.colLabel}>{p.label}</Text>
                  <Text style={{ fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#111827", marginTop: 2 }}>
                    {currency} {Number(((total * p.percent) / 100).toFixed(0)).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}