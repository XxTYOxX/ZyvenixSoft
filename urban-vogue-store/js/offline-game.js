import { $ } from "./dom.js";
import { toast } from "./toast.js";

export function initOfflineGame() {
  const offlineGame = $("#offlineGame");
  const gameCanvas = $("#shootingGame");
  if (!offlineGame || !gameCanvas) return;

  const gameScoreEl = $("#gameScore");
  const gameTimeEl = $("#gameTime");
  const restartGameBtn = $("#restartGame");
  const closeOfflineGameBtn = $("#closeOfflineGame");
  const gameCtx = gameCanvas.getContext("2d");

  let gameScore = 0;
  let gameTime = 30;
  let gameTarget = null;
  let gameTimer = null;
  let gameRunning = false;
  let gameRaf = null;

  function showOfflineGame() {
    offlineGame.classList.add("show");
    offlineGame.setAttribute("aria-hidden", "false");
    startShootingGame();
  }

  function hideOfflineGame() {
    offlineGame.classList.remove("show");
    offlineGame.setAttribute("aria-hidden", "true");
    stopShootingGame();
  }

  function randomTarget() {
    const r = 24;
    return {
      x: r + Math.random() * (gameCanvas.width - r * 2),
      y: 60 + Math.random() * (gameCanvas.height - 135),
      r,
    };
  }

  function drawShootingGame() {
    if (!gameTarget) return;
    const c = gameCtx;
    c.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // suelo
    c.fillStyle = "#c8c8c8";
    c.fillRect(0, gameCanvas.height - 45, gameCanvas.width, 45);

    // objetivo
    c.beginPath();
    c.arc(gameTarget.x, gameTarget.y, gameTarget.r, 0, Math.PI * 2);
    c.fillStyle = "#ffffff";
    c.fill();
    c.lineWidth = 5;
    c.strokeStyle = "#222";
    c.stroke();

    c.beginPath();
    c.arc(gameTarget.x, gameTarget.y, 12, 0, Math.PI * 2);
    c.fillStyle = "#222";
    c.fill();

    // pistola sencilla en la parte inferior
    const gx = gameCanvas.width / 2;
    const gy = gameCanvas.height - 35;
    c.save();
    c.translate(gx, gy);
    c.fillStyle = "#222";
    c.fillRect(-7, -48, 14, 38);
    c.fillRect(-24, -12, 48, 12);
    c.fillStyle = "#555";
    c.fillRect(-13, -5, 26, 8);
    c.fillStyle = "#222";
    c.beginPath();
    c.moveTo(-5, -1);
    c.lineTo(10, -1);
    c.lineTo(4, 22);
    c.lineTo(-10, 22);
    c.closePath();
    c.fill();
    c.restore();

    // texto
    c.fillStyle = "#555";
    c.font = "bold 12px Arial";
    c.fillText("OBJETIVO", gameTarget.x - 31, gameTarget.y - gameTarget.r - 10);
  }

  function startShootingGame() {
    clearInterval(gameTimer);
    cancelAnimationFrame(gameRaf);

    gameScore = 0;
    gameTime = 30;
    gameRunning = true;
    gameTarget = randomTarget();
    gameScoreEl.textContent = gameScore;
    gameTimeEl.textContent = gameTime;

    gameTimer = setInterval(() => {
      gameTime--;
      gameTimeEl.textContent = gameTime;
      if (gameTime <= 0) {
        clearInterval(gameTimer);
        gameRunning = false;
        drawShootingGame();
        setTimeout(() => {
          if (offlineGame.classList.contains("show")) {
            toast("Partida terminada: " + gameScore + " puntos");
          }
        }, 50);
      }
    }, 1000);

    function loop() {
      drawShootingGame();
      if (gameRunning) gameRaf = requestAnimationFrame(loop);
    }
    loop();
  }

  function stopShootingGame() {
    gameRunning = false;
    clearInterval(gameTimer);
    cancelAnimationFrame(gameRaf);
  }

  gameCanvas.addEventListener("click", (e) => {
    if (!gameRunning || !gameTarget) return;
    const rect = gameCanvas.getBoundingClientRect();
    const scaleX = gameCanvas.width / rect.width;
    const scaleY = gameCanvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const hit = Math.hypot(x - gameTarget.x, y - gameTarget.y) <= gameTarget.r;

    if (hit) {
      gameScore += 10;
      gameScoreEl.textContent = gameScore;
      gameTarget = randomTarget();
    }
  });

  restartGameBtn?.addEventListener("click", startShootingGame);
  closeOfflineGameBtn?.addEventListener("click", hideOfflineGame);

  window.addEventListener("offline", showOfflineGame);
  window.addEventListener("online", () => {
    if (offlineGame.classList.contains("show")) {
      hideOfflineGame();
      toast("Conexión restaurada");
    }
  });

  if (!navigator.onLine) showOfflineGame();
}
