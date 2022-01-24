
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Card from "./Card";

const CardDeck = () => {
    const [cards, setCards] = useState([]);
    const [cardsRemaining, setCardsRemaining] = useState(null)
    const [deckId, setDeckId] = useState(null)

    useEffect(() => {
        async function shuffleDeck (){
            const res = await axios.get(`http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
            setDeckId(res.data.deck_id);
            setCardsRemaining(res.data.remaining)

        }

        shuffleDeck()
    }, []);

    async function drawNextCard(){
        if(cardsRemaining < 1) {
            alert('“Error: no cards remaining!”.')
            return
        }
        const res = await axios.get(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        setCards([...cards, res.data.cards[0]])
        setCardsRemaining(res.data.remaining)
    }

    return (
        <>       
        <div>
            <button onClick={drawNextCard}>Draw Card</button>
        </div>
        <div>
            {cards.map(card => <Card img={card.image}/>)}
        </div>
        </>
 
    )

}

export default CardDeck