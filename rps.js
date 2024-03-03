document.addEventListener("DOMContentLoaded", () => {
  let points = window.totalPoints || 100;
  const pointsDisplay = document.getElementById("points");
  const resultDisplay = document.getElementById("result");
  const choices = ["rock", "paper", "scissors"];

  function playGame(playerChoice) {
    // Use confirm instead of prompt for a simple OK/Cancel confirmation
    const isConfirmed = confirm("Confirm to wager 10 points?\nPress OK to confirm");

    if (!isConfirmed) {
      // User pressed Cancel, exit the function early
      return;
    }

    const computerChoice = choices[Math.floor(Math.random() * 3)];
    let wager = 10; // Since you're confirming, not entering a wager amount, set it directly

    let result;
    if (playerChoice === computerChoice) {
      result = "It's a draw!";
    } else if (
      (playerChoice === "rock" && computerChoice === "scissors") ||
      (playerChoice === "scissors" && computerChoice === "paper") ||
      (playerChoice === "paper" && computerChoice === "rock")
    ) {
      points += wager; // Double the wagered points logic here
      result = `You win! Computer chose ${computerChoice}.`;
    } else {
      points -= wager; // Subtract the wagered points logic here
      result = `You lose! Computer chose ${computerChoice}.`;
    }

    pointsDisplay.textContent = `Points: ${points}`;
    resultDisplay.innerHTML = result;

    updateMatchupIcon(playerChoice, computerChoice);
  }

  function updateMatchupIcon(playerChoice, computerChoice) {
    const icons = {
      'rock': '🪨',
      'paper': '📃',
      'scissors': '✂️'
    };
    const playerIcon = icons[playerChoice];
    const computerIcon = icons[computerChoice];
    document.getElementById("matchupIcon").innerHTML = `${playerIcon} vs ${computerIcon}`;
  }

  document.getElementById("rock").addEventListener("click", () => playGame("rock"));
  document.getElementById("paper").addEventListener("click", () => playGame("paper"));
  document.getElementById("scissors").addEventListener("click", () => playGame("scissors"));
});
