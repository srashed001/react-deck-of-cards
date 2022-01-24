import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Card from "./Card";

const TimerCardDeck = () => {
  const [timerDraw, setTimerDraw] = useState(false);
  const [cards, setCards] = useState([]);
  const [deckId, setDeckId] = useState(null);
  const timerId = useRef();

  useEffect(() => {
    async function shuffleDeck() {
      const res = await axios.get(
        `http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
      );
      setDeckId(res.data.deck_id);
    }

    shuffleDeck();
  }, []);

  useEffect(() => {
    async function drawNextCard() {
      try {
        const res = await axios.get(
          `http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
        );

        if (res.data.remaining < 1) {
          alert("“Error: no cards remaining!”.");
          setTimerDraw(false);
          throw new Error("Error: no cards remaining!");
        }

        setCards((cards) => [...cards, res.data.cards[0]]);
      } catch (e) {
        alert(e);
      }
    }

    if (timerDraw && !timerId.current) {
      console.log("drawing");
      timerId.current = setInterval(async () => {
        await drawNextCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerId.current);
      timerId.current = null;
    };
  }, [timerDraw]);

  const toggleTimer = () => {
    setTimerDraw((timerDraw) => !timerDraw);
  };

  return (
    <>
      <div>
        <button onClick={toggleTimer}>
          {timerDraw ? "STOP DRAWING" : "START DRAWING"}
        </button>
      </div>
      <div>
        {cards.map((card) => (
          <Card img={card.image} />
        ))}
      </div>
    </>
  );
};

export default TimerCardDeck;
