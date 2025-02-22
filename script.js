/* eslint-disable no-unused-vars */
window.onload = function () {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const gameState = {
    ironman: {
      width: 130,
      height: 100,
      x: canvas.width / 8,
      y: canvas.height / 2,
      velocityY: 0,
      speedX: 0,
      gravity: 0.1,
      img: new Image(),
    },
    attackers: [],
    attackersWidth: 120,
    attackersHeight: 90,
    score: 0,
    gameOver: false,
    attackerImages: [],
    lastTime: 0,
  };

  gameState.ironman.img.src = "e03df86191edf06.png";
  
  const imageUrls = [
    "aliens-clipart-purple-4.png",
    "apache-attack-helicopter-transparent-background-png-7550.png",
    "jet_fighter_PNG46.png",
    "robots-ready-to-attack-free-png.png",
    "Spaceship-PNG-Photo.png"
  ];

  gameState.attackerImages = imageUrls.map((url) => {
    const img = new Image();
    img.src = url;
    return img;
  });

  function moveIronman(e) {
    if (gameState.gameOver) return;

    switch (e.code) {
      case "Space":
      case "ArrowUp":
        gameState.ironman.velocityY = -3;
        break;
      case "ArrowRight":
        gameState.ironman.speedX = 2;
        break;
      case "ArrowLeft":
        gameState.ironman.speedX = -2;
        break;
    }
  }

  function attackOn() {
    const randomImg = gameState.attackerImages[Math.floor(Math.random() * gameState.attackerImages.length)];
    const newAttacker = {
      img: randomImg,
      x: canvas.width,
      y: Math.random() * (canvas.height - gameState.attackersHeight),
      width: gameState.attackersWidth,
      height: gameState.attackersHeight,
    };
    gameState.attackers.push(newAttacker);
  }

  function detectCollision(ironman, attacker) {
    return (
      ironman.x + ironman.width > attacker.x &&
      ironman.x < attacker.x + attacker.width &&
      ironman.y + ironman.height > attacker.y &&
      ironman.y < attacker.y + attacker.height
    );
  }

  function drawGameOver() {
    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = "#FF3333";
    context.font = "bold 80px Arial";
    context.textAlign = "center";
    context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);
    
    context.fillStyle = "#FFFFFF";
    context.font = "40px Arial";
    context.fillText(`Final Score: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 40);
    context.font = "24px Arial";
    context.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 100);
  }

  function update(currentTime) {
    if (gameState.gameOver) {
      drawGameOver();
      return;
    }
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    gameState.ironman.velocityY += gameState.ironman.gravity;
    gameState.ironman.y += gameState.ironman.velocityY;
    gameState.ironman.x += gameState.ironman.speedX;
    
    if (gameState.ironman.y + gameState.ironman.height > canvas.height) {
      gameState.ironman.y = canvas.height - gameState.ironman.height;
    }
    if (gameState.ironman.y < 0) {
      gameState.ironman.y = 0;
    }
    if (gameState.ironman.x < 0) {
      gameState.ironman.x = 0;
    }
    if (gameState.ironman.x + gameState.ironman.width > canvas.width) {
      gameState.ironman.x = canvas.width - gameState.ironman.width;
    }
    
    context.drawImage(
      gameState.ironman.img,
      gameState.ironman.x,
      gameState.ironman.y,
      gameState.ironman.width,
      gameState.ironman.height
    );
    
    gameState.attackers = gameState.attackers.filter((attacker) => {
      attacker.x -= 3;
      context.drawImage(attacker.img, attacker.x, attacker.y, attacker.width, attacker.height);
      
      if (detectCollision(gameState.ironman, attacker)) {
        gameState.gameOver = true;
        return false;
      }
      if (attacker.x + attacker.width < 0) {
        gameState.score += 10;
        return false;
      }
      return true;
    });
    
    context.fillStyle = "white";
    context.font = "bold 30px Arial";
    context.fillText(` ${gameState.score}`, 20, 40);
    
    requestAnimationFrame(update);
  }

  function resetGame() {
    gameState.gameOver = false;
    gameState.score = 0;
    gameState.attackers = [];
    gameState.ironman.x = canvas.width / 8;
    gameState.ironman.y = canvas.height / 2;
    gameState.ironman.velocityY = 0;
    gameState.ironman.speedX = 0;
    requestAnimationFrame(update);
  }

  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && gameState.gameOver) {
      resetGame();
    } else {
      moveIronman(e);
    }
  });
  
  setInterval(attackOn, 2500);
  requestAnimationFrame(update);
};
