let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0, 
  losses: 0, 
  ties: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0
};

let soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // Default to true

updateScoreElement();
updateStatsElement();
updateSoundButton();

/*
if (score === null) {
  score = {
    wins: 0, 
    losses: 0, 
    ties: 0
  };
}
*/

document.querySelector('.js-auto-play-button').addEventListener('click', () => {
  playSound('buttonClick');
  autoPlay();
});

document.querySelector('.js-sound-toggle').addEventListener('click', () => {
  toggleSound();
});

let autoPlayInterval;

function autoPlay() {
  const autoPlayButton = document.querySelector('.js-auto-play-button');

  if (autoPlayButton.innerText === 'Auto Play') {
    autoPlayButton.innerHTML = 'Stop Play';
    autoPlayButton.classList.add('is-Toggled');
    autoPlayInterval = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);
  } else {
    autoPlayButton.innerHTML = 'Auto Play';
    autoPlayButton.classList.remove('is-Toggled');
    clearInterval(autoPlayInterval);
  }
}

document.querySelector('.js-rock-button').addEventListener('click', () => {
  playSound('buttonClick');
  playGame('Rock');
});

document.querySelector('.js-paper-button').addEventListener('click', () => {
  playSound('buttonClick');
  playGame('Paper');
});

document.querySelector('.js-scissor-button').addEventListener('click', () => {
  playSound('buttonClick');
  playGame('Scissors');
});


document.body.addEventListener('keydown', (event) => {
  if (event.key === 'r') {
    playSound('buttonClick');
    playGame('Rock');
  } else if (event.key === 'p') {
    playSound('buttonClick');
    playGame('Paper');
  } else if (event.key === 's') {
    playSound('buttonClick');
    playGame('Scissors');
  } else if (event.key === 'a') {
    playSound('buttonClick');
    autoPlay();
  } else if (event.key === 'Backspace') {
    resetScore();
    localStorage.removeItem('score');
    updateScoreElement();
  }
})

function playGame (playerMove) {
  const computerMove = pickComputerMove();
  let result = '';

  if (playerMove === 'Rock') {
    if (computerMove === 'Rock') {
      result = 'Tie';
    } else if (computerMove === 'Paper') {
      result = 'You lose';
    } else if (computerMove === 'Scissors') {
      result = 'You win';
    }

  } else if (playerMove === 'Paper') {
    if (computerMove === 'Rock') {
      result = 'You win';
    } else if (computerMove === 'Paper') {
      result = 'Tie';
    } else if (computerMove === 'Scissors') {
      result = 'You lose';
    }
    
  } else if (playerMove === 'Scissors') {
    if (computerMove === 'Rock') {
      result = 'You lose';
    } else if (computerMove === 'Paper') {
      result = 'You win';
    } else if (computerMove === 'Scissors') {
      result = 'Tie';
    }
  }
  
  if (result === 'You win') {
    score.wins += 1;
    score.currentStreak += 1;
    if (score.currentStreak > score.bestStreak) {
      score.bestStreak = score.currentStreak;
    }
  } else if (result === 'You lose') {
    score.losses += 1;
    score.currentStreak = 0;
  } else if (result === 'Tie') {
    score.ties += 1;
    score.currentStreak = 0;
  }

  score.totalGames = score.wins + score.losses + score.ties;

  localStorage.setItem('score', JSON.stringify(score));
  updateScoreElement();
  updateStatsElement();

  // Play result sound and add animation
  if (result === 'You win') {
    playSound('winSound');
    addResultAnimation('win-animation');
  } else if (result === 'You lose') {
    playSound('loseSound');
    addResultAnimation('lose-animation');
  } else if (result === 'Tie') {
    playSound('tieSound');
    addResultAnimation('tie-animation');
  }

  document.querySelector('.js-result').innerHTML = result;

  document.querySelector('.js-moves').innerHTML = `You
  <img src="assets/${playerMove.toLowerCase()}-emoji.png" alt="${playerMove}" style="height: 50px;">
  <img src="assets/${computerMove.toLowerCase()}-emoji.png" alt="${computerMove}" style="height: 50px;">
  Computer`;

  
}

function updateScoreElement() {
  document.querySelector('.js-score')
    .innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function pickComputerMove () {
  const randomNumber = Math.random();
  let computerMove;
  
  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = 'Rock';
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'Paper';
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = 'Scissors';
  }

  return computerMove;
}



function resetScore () {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  score.currentStreak = 0;
  score.bestStreak = 0;
  score.totalGames = 0;
  localStorage.removeItem('score');
  updateScoreElement();
  updateStatsElement();
}

document.querySelector('.js-reset-button').addEventListener('click', () => {
  displayResetConfirmation();
});

function displayResetConfirmation() {
  document.querySelector('.js-reset-confirmation')
  .innerHTML = `
    Are you sure you want to reset the score?
    <button class="js-yes-button reset-confirm-button">Yes</button>
    <button class="js-no-button reset-confirm-button">No</button>
  `;

  document.querySelector('.js-yes-button').addEventListener('click', () => {
    resetScore();
    hideResetConfirmation();
  });

  document.querySelector('.js-no-button').addEventListener('click', () => {
    hideResetConfirmation();
  });
}

function hideResetConfirmation() {
  document.querySelector('.js-reset-confirmation').innerHTML = '';
}

// Sound Functions
function playSound(soundId) {
  if (!soundEnabled) return;
  
  // Create audio context for generating sounds
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Set different sounds based on soundId
  switch(soundId) {
    case 'buttonClick':
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      break;
    case 'winSound':
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      break;
    case 'loseSound':
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      break;
    case 'tieSound':
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.type = 'triangle';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      break;
  }
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.4);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled);
  updateSoundButton();
  playSound('buttonClick');
}

function updateSoundButton() {
  const soundButton = document.querySelector('.js-sound-toggle');
  if (soundEnabled) {
    soundButton.textContent = '🔊 Sound On';
    soundButton.classList.remove('muted');
  } else {
    soundButton.textContent = '🔇 Sound Off';
    soundButton.classList.add('muted');
  }
}

// Animation Functions
function addResultAnimation(animationClass) {
  const resultElement = document.querySelector('.js-result');
  const movesElement = document.querySelector('.js-moves');
  
  // Remove any existing animation classes
  resultElement.classList.remove('win-animation', 'lose-animation', 'tie-animation');
  movesElement.classList.remove('win-animation', 'lose-animation', 'tie-animation');
  
  // Add animation class
  resultElement.classList.add(animationClass);
  movesElement.classList.add(animationClass);
  
  // Remove animation class after animation completes
  setTimeout(() => {
    resultElement.classList.remove(animationClass);
    movesElement.classList.remove(animationClass);
  }, 1000);
}

// Add button press animation
function addButtonPressAnimation(button) {
  button.classList.add('pulse');
  setTimeout(() => {
    button.classList.remove('pulse');
  }, 500);
}

function updateStatsElement() {
  const winPercentage = score.totalGames > 0 ? Math.round((score.wins / score.totalGames) * 100) : 0;
  
  document.querySelector('.js-stats').innerHTML = `
    <div class="stats-container">
      <div class="stat-item">
        <span class="stat-label">Win Rate:</span>
        <span class="stat-value">${winPercentage}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Current Streak:</span>
        <span class="stat-value">${score.currentStreak}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Best Streak:</span>
        <span class="stat-value">${score.bestStreak}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total Games:</span>
        <span class="stat-value">${score.totalGames}</span>
      </div>
    </div>
  `;
}