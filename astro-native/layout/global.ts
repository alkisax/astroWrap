import { StyleSheet } from "react-native";
import { colors } from "../constants/constants";

export const globalStyles = StyleSheet.create({
  // 🧱 layout
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  fullWidth: {
    width: "100%",
  },

  // 📝 text
  title: {
    fontSize: 22,
    color: colors.text,
    marginBottom: 12,
    fontWeight: "600",
  },

  text: {
    color: colors.dim,
  },

  label: {
    color: colors.dim,
    fontSize: 12,
    marginBottom: 6,
  },

  // 🧩 cards / panels
  card: {
    width: "100%",
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  glassCard: {
    width: "100%",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  section: {
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  // 🔘 buttons
  button: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: colors.primary,
  },

  buttonOutline: {
    borderWidth: 1,
    borderColor: colors.text,
  },

  buttonText: {
    color: "#1a1a1a",
    fontWeight: "700",
    fontSize: 13,
  },

  // 📦 rows
  row: {
    flexDirection: "row",
    gap: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  // 🧾 inputs
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.06)",
    color: colors.text,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },

  // 🌐 webview
  webviewWrap: {
    width: "100%",
    height: 400,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "transparent",
  },

  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },

  webFallback: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },

  webFallbackText: {
    color: colors.text,
    textAlign: "center",
    fontSize: 13,
    marginBottom: 10,
  },

  webFallbackUrl: {
    color: "#9ecbff",
    fontSize: 11,
  },

  // 📅 header
  header: {
    width: "100%",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    marginBottom: 8,
  },

  dateText: {
    color: "#1a1a1a",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  coordsText: {
    color: "#333",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },

  sectionLabel: {
    color: colors.text,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },

  subLabel: {
    color: colors.dim,
    fontSize: 12,
    marginBottom: 4,
  },

  // 🔮 llm
  llmButton: {
    alignSelf: "center",
    width: 280,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  llmButtonText: {
    color: colors.text,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "600",
  },

  llmResultBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
});
