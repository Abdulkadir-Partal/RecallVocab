import React, { useState, useRef, useEffect } from "react";
import {Modal,View,Text,TextInput,TouchableOpacity,Animated,PanResponder,Dimensions,Easing,} from "react-native";
import styles from "../../styles/AddWordModalStyles";
import api from "../services/api";
import { Ionicons } from "@expo/vector-icons";
import Button from "./Buttons";
import AILevelWordsModal from "./AILevelWordsModal";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const CLOSE_THRESHOLD = 120; // bu kadar px aşağı çekilince kapanır
const CLOSE_VELOCITY = 0.8; // hızlı bir çekiş de kapatır

export default function AddWordModal({
  visible,
  onClose,
  onWordAdded,
}) {
  const [showLevelWords, setShowLevelWords] = useState(false);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [direction, setDirection] = useState("en_to_tr");

  const timeoutRef = useRef(null);

  // Kart başlangıçta ekranın altında, overlay tamamen şeffaf.
  // Modal'ın kendi animasyonunu kapattığımız için açılışı da biz yönetiyoruz.
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(SCREEN_HEIGHT);
      overlayOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const resetFormState = () => {
    setWord("");
    setMeaning("");
    setDirection("en_to_tr");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animasyon tamamen bittikten sonra state'i temizle ve modal'ı kapat.
      // translateY'yi burada tekrar 0'a çekmiyoruz -- bir sonraki açılışta
      // useEffect zaten SCREEN_HEIGHT'ten başlatıp yeniden animasyonla açacak.
      resetFormState();
      onClose();
    });
  };

  const snapBack = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dy) > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx);
      },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > CLOSE_THRESHOLD || gesture.vy > CLOSE_VELOCITY) {
          closeWithAnimation();
        } else {
          snapBack();
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        snapBack();
      },
    })
  ).current;

  const translateWord = async (text) => {
    if (!text.trim()) {
      setMeaning("");
      return;
    }

    try {
      setIsTranslating(true);

      const response = await api.post("translate/", {
        word: text,
        direction,
      });

      setMeaning(response.data.meaning || "");
    } catch (error) {
      console.log("Translation Error:", error);
      setMeaning("");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleWordChange = (text) => {
    setWord(text);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!text.trim()) {
      setMeaning("");
      return;
    }

    timeoutRef.current = setTimeout(() => {
      translateWord(text);
    }, 1000);
  };

  const toggleDirection = () => {
    setWord("");
    setMeaning("");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setDirection((prev) => (prev === "en_to_tr" ? "tr_to_en" : "en_to_tr"));
  };

  const saveWord = async () => {
    if (!word.trim()) return;

    try {
      await api.post("words/add/", {
        word,
        direction,
      });

      onWordAdded?.();
      closeWithAnimation();
    } catch (error) {
      console.log("Save Error:", error);
    }
  };

  const handleClose = () => {
    closeWithAnimation();
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={closeWithAnimation}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>

        <Animated.View
          style={[
            styles.container,
            { transform: [{ translateY }] },
          ]}
        >

          <View {...panResponder.panHandlers} style={styles.dragArea}>
            <View style={styles.handle} />
          </View>

          <Text style={styles.title}>
            Add New Word
          </Text>

          <Button
            title="✨ AI ile Üret"
            onPress={() => setShowLevelWords(true)}
            variant="ai"
          />

          <View style={styles.switchRow}>
            <Text style={styles.label}>
              {direction === "en_to_tr" ? "English Word" : "Turkish Word"}
            </Text>

            <Button
              variant="icon"
              onPress={toggleDirection}
              icon={<Ionicons name="swap-horizontal" size={24} color="#111827" />}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder={
              direction === "en_to_tr"
                ? "Type an English word..."
                : "Type a Turkish word..."
            }
            value={word}
            onChangeText={handleWordChange}
          />

          <Text style={styles.label}>
            {direction === "en_to_tr" ? "Turkish Meaning" : "English Meaning"}
          </Text>

          <View style={styles.meaningBox}>

            {isTranslating ? (
              <Text style={styles.meaning}>
                Translating...
              </Text>
            ) : (
              <Text style={styles.meaning}>
                {meaning || "Translation will appear here"}
              </Text>
            )}

          </View>

          <Button title="Save" onPress={saveWord} />

          <Button title="Cancel" onPress={handleClose} variant="text" />

          <AILevelWordsModal
            visible={showLevelWords}
            onClose={() => setShowLevelWords(false)}
            onWordsAdded={onWordAdded}
          />

        </Animated.View>

      </Animated.View>
    </Modal>
  );
}