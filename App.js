import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import FlipCard from "react-native-flip-card";
import { getCharacters } from "./marvelApi";

const generateCards = (characters) => {
  const cards = characters.map((character, index) => ({
    id: index * 2,
    pairId: index,
    isFlipped: false,
    character,
  }));

  return shuffle([...cards, ...cards]);
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);
  const [flippedCount, setFlippedCount] = useState(0);

  useEffect(() => {
    const loadCharacters = async () => {
      const characters = await getCharacters(8);
      setCards(generateCards(characters));
    };
    loadCharacters();
  }, []);

  useEffect(() => {
    if (isChecking && firstCard) {
      checkForMatch();
    }
  }, [isChecking]);

  const checkForMatch = () => {
    const secondCard = cards.find(
      (card) => card.isFlipped && card.id !== firstCard.id
    );
    if (!secondCard) {
      setIsChecking(false);
      return;
    }

    if (firstCard.pairId === secondCard.pairId) {
      const newCards = cards.map((card) => {
        if (card.id === firstCard.id || card.id === secondCard.id) {
          return { ...card, isMatched: true };
        }
        return card;
      });
      setCards(newCards);
      setMatchedCount((prevMatchedCount) => prevMatchedCount + 1);
    } else {
      setTimeout(() => {
        const newCards = cards.map((card) => {
          if (card.id === firstCard.id || card.id === secondCard.id) {
            return { ...card, isFlipped: false };
          }
          return card;
        });
        setCards(newCards);
      }, 1000);
    }

    setFirstCard(null);
    setIsChecking(false);
  };

  const handleCardPress = (cardIndex) => {
    if (isChecking) return;

    const newCards = cards.map((card, index) => {
      if (index === cardIndex) {
        return { ...card, isFlipped: true };
      }
      return card;
    });
    setCards(newCards);

    const card = newCards[cardIndex];

    if (!card.isFlipped) {
      setFlippedCount((prevFlippedCount) => prevFlippedCount + 1);
    }

    if (!firstCard) {
      setFirstCard(card);
    } else {
      setIsChecking(true);
    }
  };

  const renderCard = (card, index) => {
    const { thumbnail } = card.character;
    const imageUrl = `${thumbnail.path}.${thumbnail.extension}`;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleCardPress(index)}
        activeOpacity={card.isFlipped || card.isMatched ? 1 : 0.6}
        style={styles.card}
      >
        <FlipCard
          flip={card.isFlipped || card.isMatched}
          clickable={false}
          style={styles.flipCard}
          friction={6}
          perspective={1000}
          flipHorizontal
          flipVertical={false}
        >
          <View style={[styles.cardContent, styles.cardBack]} />
          <View style={[styles.cardContent, styles.cardFront]}>
            <Image
              style={styles.cardImage}
              source={{ uri: imageUrl }}
              resizeMode="cover"
            />
          </View>
        </FlipCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Memória Marvel</Text>
      <ScrollView contentContainerStyle={styles.appContent}>
        <Text style={styles.stats}>
          Acertos: {matchedCount} | Cartas viradas: {flippedCount}
        </Text>
        <View style={styles.cardsContainer}>
          {cards.map((card, index) => renderCard(card, index))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  appContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    alignSelf: "stretch",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stats: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  card: {
    margin: 8,
  },
  flipCard: {
    borderWidth: 0,
  },
  cardContent: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  cardBack: {
    backgroundColor: "#2980b9",
  },
  cardFront: {
    backgroundColor: "#2c3e50",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
});

export default App;
