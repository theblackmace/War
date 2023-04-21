let deckId = null;
let compScore = 0;
let userScore = 0;

const valueHierarchy = ["2", "3", "4", "5", "6", "7", "8", "9",
"10", "JACK", "QUEEN", "KING", "ACE"];

async function handleShuffle() {
    const response = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    const data = await response.json();

    deckId = data.deck_id;
    console.log(deckId);
    document.getElementById('remaining-cards').textContent = `Remaining cards: ${data.remaining}`;
    compScore = 0;
    userScore = 0;
    document.getElementById('result').textContent = 'Game of War!';
    document.getElementById('img-container').innerHTML = `
        <p id="computer-score">Computer's Score: ${compScore}</p>
        <div class="placeholder"></div>
        <div class="placeholder bottom"></div>
        <p id="user-score">Your Score: ${userScore}</p>
    `;
    document.getElementById('draw-card').disabled = false;
}

async function handleDraw() {
    const response = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`);
    const data = await response.json();
    
    console.log(data);
    document.getElementById('result').textContent = determineWin(data.cards[0], data.cards[1]);
    document.getElementById('img-container').innerHTML = `
        <p id="computer-score">Computer's Score: ${compScore}</p>
        <div class="placeholder"><img src="${data.cards[0].image}"></div>
        <div class="placeholder bottom"><img src="${data.cards[1].image}"></div>
        <p id="user-score">Your Score: ${userScore}</p>
    `;
    document.getElementById('remaining-cards').textContent = `Remaining cards: ${data.remaining}`;
    if(data.remaining===0) {
        document.getElementById('draw-card').disabled = true;
        if(compScore>userScore) {
            document.getElementById('result').textContent = 'Sadge! Computer won this Deck.';
        } else if(compScore<userScore) {
            document.getElementById('result').textContent = 'Congrats! You won this Deck.';
        } else {
            document.getElementById('result').textContent = 'No winners or losers in this Deck.';
        }
    }
}

function determineWin(card1, card2) {
    if(valueHierarchy.indexOf(card1.value)>valueHierarchy.indexOf(card2.value)) {
        compScore++;
        return 'Computer wins';
    } else if(valueHierarchy.indexOf(card1.value)<valueHierarchy.indexOf(card2.value)) {
        userScore++;
        return 'You win';
    } else {
        return `It's a tie!`;
    }
}

document.getElementById('new-deck').addEventListener('click', handleShuffle);
document.getElementById('draw-card').addEventListener('click', handleDraw);
