import { View, Image } from "@react-pdf/renderer";
import styles from "./styles";
import brandStripImg from "./assets/brand-strip.png";
import manzioLogoImg from "./assets/manziologo.png";

/**
 * Shared page header — decorative band strip at the top of every content page.
 * Displays Manzio logo on the left and the colorful brand strip on the top-right,
 * matching the letterhead reference exactly.
 */
export default function PdfHeader() {
  return (
    <View style={styles.headerContainer} fixed>

      {/* Brand strip — top-right, spans from logo width to right edge */}
      <Image
        src={brandStripImg}
        style={{
          position: "absolute",
          top: 0,
          left: 160,
          right: 0,
          height: 52,
          objectFit: "fill",
        }}
      />

      {/* Logo — bottom-left of header, white background behind it */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 160,
          height: 52,
          backgroundColor: "#FFFFFF",
          paddingLeft: 36,
          justifyContent: "center",
        }}
      >
        <Image
          src={manzioLogoImg}
          style={{
            width: 100,
            height: 36,
            objectFit: "contain",
          }}
        />
      </View>

    </View>
  );
}
