import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import styles, { getTrustCardStyles, getTrustColor } from "../../styles/ReviewCardStyles";
import Button from "./Buttons";

export default function ReviewCard({
  word,
  showMeaning,
  onKnow,
  onDontKnow,
  onNext,
  onExample,
}) {
  const [showInfo, setShowInfo] = useState(false);

  const trustStyle = getTrustColor(word?.trust_point ?? 0);
  const trustCardStyles = getTrustCardStyles(trustStyle);

  return (
    <View style={[styles.card, trustCardStyles.card]}>

      <Text style={styles.word}>
        {word.english_word}
      </Text>

      <View style={styles.trustRow}>
        <Text style={styles.trustTitle}>Trust Point</Text>
        <Text style={[styles.trustValue, trustCardStyles.trustText]}>{word?.trust_point ?? 0.0}</Text>

        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setShowInfo((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text style={styles.infoButtonText}>i</Text>
        </TouchableOpacity>
      </View>

      {showInfo && (
        <View style={styles.infoBubble}>
          <Text style={styles.infoBubbleText}>
            Trust Point shows how confidently you remember this word.
          </Text>
        </View>
      )}

      {showMeaning && (
        <Text style={styles.meaning}>
          {word.turkish_meaning}
        </Text>
      )}

      {!showMeaning ? (
        <>
          <Button title="I Know" onPress={onKnow} />
          <Button title="I Don't Know" onPress={onDontKnow} />
        </>
      ) : (
        <Button title="Next" onPress={onNext} />
      )}

      <Button title="Example (AI)" onPress={onExample} variant="link" />

    </View>
  );
}