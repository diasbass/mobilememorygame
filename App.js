import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import FlipCard from "react-native-flip-card";

const generateCards = (numPairs) => {
  const cards = [];
  for (let i = 0; i < numPairs * 2; i++) {
    cards.push({
      id: i,
      pairId: Math.floor(i / 2),
      isFlipped: false,
    });
  }
  return shuffle(cards);
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const App = () => {
  const [cards, setCards] = useState(generateCards(8));
  const [firstCard, setFirstCard] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

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

    if (!firstCard) {
      setFirstCard(card);
    } else {
      setIsChecking(true);
    }
  };

  const renderCard = (card, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleCardPress(index)}
        activeOpacity={card.isFlipped || card.isMatched ? 1 : 0.5}
        style={styles.card}
      >
        <FlipCard
          flip={card.isFlipped}
          clickable={false}
          flipHorizontal={true}
          flipVertical={false}
        >
          <View style={[styles.cardContent, styles.cardBack]} />
          <View style={[styles.cardContent, styles.cardFront]}>
            <Text style={styles.cardText}>{card.pairId + 1}</Text>
          </View>
        </FlipCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Memória</Text>
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => renderCard(card, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    margin: 5,
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
  cardText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default App;
