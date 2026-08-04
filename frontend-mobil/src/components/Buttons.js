import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles, { getVariantStyles, AI_GRADIENT_COLORS } from "../../styles/ButtonsStyles";

export default function Button({
  title,
  onPress,
  variant = "primary", // "primary" | "text" | "link" | "icon" | "ai" | "success" | "danger"
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  const variantStyles = getVariantStyles(variant);

  const content = loading ? (
    <ActivityIndicator size="small" color={variantStyles.loadingColor} />
  ) : icon ? (
    icon
  ) : (
    <Text style={[styles.text, variantStyles.text, textStyle]}>
      {title}
    </Text>
  );

  // AI varyantı gradyanlı dolgu kullanıyor, diğerleri düz TouchableOpacity
  if (variant === "ai") {
    return (
      <TouchableOpacity
        style={[styles.base, styles.aiOuter, disabled && styles.disabled, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={AI_GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiGradient}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles.container,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {content}
    </TouchableOpacity>
  );
}