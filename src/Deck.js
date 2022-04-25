import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import Card from './Card';
import './Deck.css';

const Deck = () => {
    const [deckId, setDeckId] = useState('');
    const [cards, setCards] = useState([]);
    const timerId = useRef();
    const [autoDraw, setAutoDraw] = useState(false);
    

    
    
    // get a new shuffled deck
    useEffect(() => {
        try {
            async function getNewDeck() {
                const res = await axios.get(`http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
                setDeckId(res.data.deck_id)
            }
            getNewDeck();
        } catch (e) {
            console.log(e)
        }
      }, []);
    
    async function drawOneCard() {
        try {
            // draw card from deck
            const cardRes = await axios.get(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            
            const newCardObj = {
                image: cardRes.data.cards[0].image,
                code: cardRes.data.cards[0].code, 
                key: cardRes.data.cards[0].code, 
                rotate: Math.floor(Math.random() * 4)
            }
            setCards(cards => [...cards, newCardObj]);
        } catch (e) {
            console.log(e)
            alert("no more cards")
        }
    }


   useEffect(() => {
       //draw a card
       async function drawCard() {
        try {
            // draw card from deck
            const cardRes = await axios.get(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);

            const newCardObj = {
                image: cardRes.data.cards[0].image,
                code: cardRes.data.cards[0].code, 
                key: cardRes.data.cards[0].code, 
                rotate: Math.floor(Math.random() * 4)
            }
            setCards(cards => [...cards, newCardObj]);
        } catch (e) {
            // no more cards to draw 
            setAutoDraw(false);
            alert("no more cards")
        }
    }

    if (autoDraw && !timerId.current) {
        timerId.current = setInterval(async () => {
          await drawCard();
        }, 1000);
      }

      return () => {
        clearInterval(timerId.current);
        timerId.current = null;
      };
    }, [autoDraw, setAutoDraw, deckId]);
   
    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
      };
    
      const picked = cards.map(c => (
        <Card key={c.key} code={c.code} image={c.image} rotate={c.rotate}/>
      ));


 
    
    return (
        <>
            <h2>Deck Of Cards</h2>
            <h3>Remaining Cards: {52 - cards.length}</h3>
            
            <button onClick={drawOneCard}>Draw One Card</button>
            <button onClick={toggleAutoDraw}>{autoDraw ? "Stop" : "Start" } Auto Draw</button>

            <div id="card-container">
                {picked}
            </div>
            
        </>
    )
}

export default Deck;