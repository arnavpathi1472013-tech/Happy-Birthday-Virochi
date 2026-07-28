document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bdayAudio');

  const curtainStage = document.getElementById('curtainStage');
  const openCurtainBtn = document.getElementById('openCurtainBtn');

  const giftStage = document.getElementById('giftStage');
  const giftBox = document.getElementById('giftBox');

  const mainStage = document.getElementById('mainStage');

  const confettiBtn = document.getElementById('confettiBtn');
  const sparkleBtn = document.getElementById('sparkleBtn');
  const musicBtn = document.getElementById('musicBtn');

  const balloonLayer = document.getElementById('balloonLayer');

  const balloonColors = ['#ff5cb8', '#f6b8a8', '#d9c4f5', '#ffd166', '#ffc1e3'];
  const sparkleEmojis = ['⭐', '✨', '💖', '🌸'];

  let audioUnlocked = false;

  function tryPlayAudio() {
    if (!audio) return;
    audio.play().catch(() => {
      
    });
    audioUnlocked = true;
  }

  function openCurtains() {
    curtainStage.classList.add('curtain-open');
    tryPlayAudio();

    setTimeout(() => {
      curtainStage.classList.add('hidden-stage');
      giftStage.classList.remove('hidden-stage');
    }, 1100);
  }

  openCurtainBtn.addEventListener('click', openCurtains);
  curtainStage.addEventListener('click', (e) => {
    if (e.target !== openCurtainBtn && !openCurtainBtn.contains(e.target)) {
      openCurtains();
    }
  });

  let giftOpened = false;

  giftBox.addEventListener('click', () => {
    if (giftOpened) return;
    giftOpened = true;

    if (!audioUnlocked) tryPlayAudio();

    giftBox.classList.add('shaking');

    setTimeout(() => {
      // Massive confetti explosion
      fireConfettiBurst();

      giftBox.classList.remove('shaking');
      giftBox.classList.add('gift-pop-out');

      setTimeout(() => {
        giftStage.classList.add('hidden-stage');
        mainStage.classList.remove('hidden-stage');
        startBalloons();
      }, 450);
    }, 1000);
  });

  function fireConfettiBurst() {
    if (typeof confetti !== 'function') return;

    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff5cb8', '#ffd166', '#d9c4f5', '#f6b8a8', '#ffffff'],
    });

    confetti({
      particleCount: 100,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
      colors: ['#ff5cb8', '#ffd166', '#d9c4f5'],
    });

    confetti({
      particleCount: 100,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
      colors: ['#f6b8a8', '#ffc1e3', '#ffffff'],
    });
  }

  confettiBtn.addEventListener('click', fireConfettiBurst);

  function spawnSparkleAt(x, y) {
    const particle = document.createElement('span');
    particle.className = 'sparkle-particle';
    particle.textContent =
      sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty(
      '--burst-transform',
      `translate(${dx}px, ${dy}px) scale(1.3) rotate(${Math.random() * 90 - 45}deg)`
    );

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 900);
  }

  function sparkleExplosion(count = 40) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      setTimeout(() => spawnSparkleAt(x, y), i * 12);
    }
  }

  sparkleBtn.addEventListener('click', () => sparkleExplosion(50));

  musicBtn.addEventListener('click', () => {
    if (!audio) return;
    audio.currentTime = 0;
    tryPlayAudio();
  });
  
  document.addEventListener('pointerdown', (e) => {
    
    if (!mainStage.classList.contains('hidden-stage')) {
      for (let i = 0; i < 6; i++) {
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        spawnSparkleAt(e.clientX + offsetX, e.clientY + offsetY);
      }
    }
  });

  function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = '🎈';
    balloon.style.color =
      balloonColors[Math.floor(Math.random() * balloonColors.length)];
    balloon.style.left = `${Math.random() * 90}vw`;

    const duration = 8 + Math.random() * 6;
    const delay = Math.random() * 2;
    balloon.style.animationDuration = `${duration}s`;
    balloon.style.animationDelay = `${delay}s`;

    balloon.addEventListener('click', () => popBalloon(balloon));
    balloon.addEventListener('pointerdown', (e) => e.stopPropagation());

    balloonLayer.appendChild(balloon);

    setTimeout(() => {
      if (balloon.parentNode) balloon.remove();
    }, (duration + delay) * 1000 + 500);
  }

  function popBalloon(balloon) {
    if (balloon.dataset.popped) return;
    balloon.dataset.popped = 'true';

    const rect = balloon.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 10; i++) {
      spawnSparkleAt(
        cx + (Math.random() - 0.5) * 30,
        cy + (Math.random() - 0.5) * 30
      );
    }

    balloon.classList.add('balloon-pop');
    setTimeout(() => balloon.remove(), 250);
  }

  let balloonInterval = null;

  function startBalloons() {
    if (balloonInterval) return;
    createBalloon();
    balloonInterval = setInterval(createBalloon, 1400);
  }
});
