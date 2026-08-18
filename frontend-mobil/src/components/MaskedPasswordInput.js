import { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";

const REVEAL_LAST_CHAR_MS = 1200;

export default function MaskedPasswordInput({ value, onChangeText, style, placeholder, ...props }) {
  const [displayValue, setDisplayValue] = useState("");
  const revealTimeoutRef = useRef(null);

  useEffect(() => {
    if (!value) {
      setDisplayValue("");
      return;
    }

    const maskedValue = value
      .split("")
      .map((char, index) => (index === value.length - 1 ? char : "•"))
      .join("");

    setDisplayValue(maskedValue);

    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
    }

    revealTimeoutRef.current = setTimeout(() => {
      setDisplayValue("•".repeat(value.length));
    }, REVEAL_LAST_CHAR_MS);

    return () => {
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, [value]);

  return (
    <TextInput
      {...props}
      style={style}
      value={displayValue}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={false}
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="password"
      importantForAutofill="yes"
    />
  );
}
