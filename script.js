document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#game-board');
    const startButton = document.getElementById('start-game');
    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];
    const movesEl  = document.getElementById('stat-moves');
    const pairsEl  = document.getElementById('stat-pairs');
    const timeEl   = document.getElementById('stat-time');
    let moves = 0;
    let timerInterval = null;
    let seconds = 0;
    let gameStarted = false;

    const cardArray = [
        { name: 'card1', img: 'images/distracted.png' },
        { name: 'card1', img: 'images/distracted.png' },
        { name: 'card2', img: 'images/drake.png' },
        { name: 'card2', img: 'images/drake.png' },
        { name: 'card3', img: 'images/fine.png' },
        { name: 'card3', img: 'images/fine.png' },
        { name: 'card4', img: 'images/rollsafe.png' },
        { name: 'card4', img: 'images/rollsafe.png' },
        { name: 'card5', img: 'images/success.png' },
        { name: 'card5', img: 'images/success.png' },
        // ...add more pairs as needed
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
        shuffle(cardArray);
        grid.innerHTML = '';
        cardsWon = [];
        cardsChosen = [];
        cardsChosenId = [];
        moves = 0;
        gameStarted = false;
        movesEl.textContent = '0';
        pairsEl.textContent = '0 / ' + (cardArray.length / 2);
        resetTimer();

        for (let i = 0; i < cardArray.length; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-id', i);

            const inner = document.createElement('div');
            inner.classList.add('card-inner');

            const front = document.createElement('div');
            front.classList.add('card-front');
            const img = document.createElement('img');
            img.setAttribute('src', cardArray[i].img);
            img.setAttribute('alt', cardArray[i].name);
            front.appendChild(img);

            const back = document.createElement('div');
            back.classList.add('card-back');

            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        }
    }

    function resetTimer() {
        stopTimer();
        seconds = 0;
        timeEl.textContent = '0:00';
    }

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            seconds++;
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            timeEl.textContent = m + ':' + String(s).padStart(2, '0');
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function showWinModal() {
        document.getElementById('modal-moves').textContent = moves;
        document.getElementById('modal-time').textContent = timeEl.textContent;
        document.getElementById('win-modal').classList.add('visible');
        document.getElementById('play-again').focus();
    }

    function flipCard() {
        const cardId = this.getAttribute('data-id');
        if (
            cardsChosenId.includes(cardId) ||
            this.classList.contains('matched') ||
            this.classList.contains('flipped') ||
            cardsChosen.length === 2
        ) return;

        if (!gameStarted) {
            gameStarted = true;
            startTimer();
        }

        this.classList.add('flipped');
        cardsChosen.push(cardArray[cardId].name);
        cardsChosenId.push(cardId);

        if (cardsChosen.length === 2) {
            moves++;
            movesEl.textContent = moves;
            setTimeout(checkForMatch, 600);
        }
    }

    function checkForMatch() {
        const cards = document.querySelectorAll('#game-board .card');
        const firstCard  = cards[cardsChosenId[0]];
        const secondCard = cards[cardsChosenId[1]];

        if (cardsChosen[0] === cardsChosen[1] && cardsChosenId[0] !== cardsChosenId[1]) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            cardsWon.push([...cardsChosen]);
            pairsEl.textContent = cardsWon.length + ' / ' + (cardArray.length / 2);
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
            }, 300);
        }

        cardsChosen = [];
        cardsChosenId = [];

        if (cardsWon.length === cardArray.length / 2) {
            stopTimer();
            showWinModal();
        }
    }

    document.getElementById('play-again').addEventListener('click', () => {
        document.getElementById('win-modal').classList.remove('visible');
        createBoard();
    });

    startButton.addEventListener('click', createBoard);
});
