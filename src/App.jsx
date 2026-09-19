import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { audio } from './utils/soundEngine';
import HudBar from './components/HudBar';
import StartScreen from './components/StartScreen';
import CoffeeModal from './components/CoffeeModal';
import ZakyModal from './components/ZakyModal';
import HunaModal from './components/HunaModal';
import MiyaModal from './components/MiyaModal';
import NanaModal from './components/NanaModal';
import MusicModal from './components/MusicModal';
import VictoryModal from './components/VictoryModal';
import TouchControls from './components/TouchControls';
import './App.css';

// Asset Imports with Character Folders & Items
import makkuniiImgSrc from './assets/characters/makkunii/makkunii.png';
import dangImgSrc from './assets/characters/dang/dang.png';
import zakyImgSrc from './assets/characters/zaky/zaky.png';
import hunaImgSrc from './assets/characters/huna/huna.png';
import miyaImgSrc from './assets/characters/miya/miya.png';
import nanaImgSrc from './assets/characters/nana/nana.png';
import musicImgSrc from './assets/characters/music/music.png';
import coverImgSrc from './assets/cover-image.png';
import coffeePhotoImgSrc from './assets/coffee-photo.png';

export default function App() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('START');
  const [hearts, setHearts] = useState(0);
  const [muted, setMuted] = useState(false);
  const [playerChar, setPlayerChar] = useState('makkunii');
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [showZakyModal, setShowZakyModal] = useState(false);
  const [showHunaModal, setShowHunaModal] = useState(false);
  const [showMiyaModal, setShowMiyaModal] = useState(false);
  const [showNanaModal, setShowNanaModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);

  const modalOpenRef = useRef(false);
  modalOpenRef.current = showCoffeeModal || showZakyModal || showHunaModal || showMiyaModal || showNanaModal || showMusicModal;

  const charImagesRef = useRef({ makkunii: null, dang: null, zaky: null, huna: null, miya: null, nana: null, music: null });

  const gameRef = useRef({
    player: { x: 100, y: 100, vx: 0, vy: 0, accel: 0.5, friction: 0.82, maxSpeed: 3.8, size: 64, facingLeft: false },
    camera: { x: 0, y: 0 },
    keys: { up: false, down: false, left: false, right: false },
    mapWidth: 1200,
    mapHeight: 900,
    trees: [],
    flowers: [],
    grassTufts: [],
    ponds: [],
    notes: [],
    coffeeShop: { x: 500, y: 320, width: 140, height: 100, doorX: 570, doorY: 420 },
    zakyNpc: { x: 200, y: 180, size: 64 },
    hunaNpc: { x: 200, y: 390, size: 64 },
    miyaNpc: { x: 650, y: 500, size: 64 },
    nanaNpc: { x: 850, y: 180, size: 64 }, // Safely moved into an upper open path area
    musicSpot: { x: 350, y: 550, size: 88 }, 
    partner: { x: 950, y: 750, size: 100 }
  });

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = 7; // makkunii, dang, zaky, huna, miya, nana, music
    const checkAllLoaded = () => { if (++loadedCount === totalAssets) setAssetsLoaded(true); };

    const imgMakkunii = new Image(); imgMakkunii.src = makkuniiImgSrc; imgMakkunii.onload = checkAllLoaded;
    const imgDang = new Image(); imgDang.src = dangImgSrc; imgDang.onload = checkAllLoaded;
    const imgZaky = new Image(); imgZaky.src = zakyImgSrc; imgZaky.onload = checkAllLoaded;
    const imgHuna = new Image(); imgHuna.src = hunaImgSrc; imgHuna.onload = checkAllLoaded;
    const imgMiya = new Image(); imgMiya.src = miyaImgSrc; imgMiya.onload = checkAllLoaded;
    const imgNana = new Image(); imgNana.src = nanaImgSrc; imgNana.onload = checkAllLoaded;
    const imgMusic = new Image(); imgMusic.src = musicImgSrc; imgMusic.onload = checkAllLoaded;

    charImagesRef.current = { makkunii: imgMakkunii, dang: imgDang, zaky: imgZaky, huna: imgHuna, miya: imgMiya, nana: imgNana, music: imgMusic };
  }, []);

  const toggleAudio = () => {
    audio.muted = !muted;
    setMuted(!muted);
  };

  const initMap = () => {
    const trees = [];
    const flowers = [];
    const grassTufts = [];
    const notes = [];

    for (let x = 0; x < 1200; x += 40) { trees.push({ x, y: 0 }, { x, y: 860 }); }
    for (let y = 0; y < 900; y += 40) { trees.push({ x: 0, y }, { x: 1160, y }); }

    const forestSpots = [{ x: 300, y: 200 }, { x: 340, y: 200 }, { x: 300, y: 240 }, { x: 750, y: 400 }, { x: 790, y: 400 }, { x: 240, y: 640 }, { x: 800, y: 200 }];
    forestSpots.forEach(spot => trees.push(spot));

    for (let i = 0; i < 55; i++) {
      flowers.push({ x: Math.floor(Math.random() * 26 + 2) * 40 + Math.random() * 10, y: Math.floor(Math.random() * 19 + 2) * 40 + Math.random() * 10, color: i % 3 === 0 ? '#f43f5e' : i % 3 === 1 ? '#fde047' : '#a855f7' });
    }

    for (let i = 0; i < 90; i++) {
      grassTufts.push({ x: Math.floor(Math.random() * 28 + 1) * 40, y: Math.floor(Math.random() * 21 + 1) * 40 });
    }

    const ponds = [{ x: 180, y: 380, width: 110, height: 75 }, { x: 850, y: 500, width: 110, height: 75 }];
    const notePositions = [{ x: 250, y: 150 }, { x: 720, y: 260 }, { x: 850, y: 150 }, { x: 350, y: 700 }, { x: 750, y: 650 }];
    notePositions.forEach(p => notes.push({ ...p, taken: false }));

    gameRef.current = {
      player: { x: 100, y: 100, vx: 0, vy: 0, accel: 0.5, friction: 0.82, maxSpeed: 3.8, size: 64, facingLeft: false },
      camera: { x: 0, y: 0 },
      keys: { up: false, down: false, left: false, right: false },
      mapWidth: 1200, mapHeight: 900, trees, flowers, grassTufts, ponds, notes,
      coffeeShop: { x: 500, y: 320, width: 140, height: 100, doorX: 570, doorY: 420 },
      zakyNpc: { x: 200, y: 180, size: 64 },
      hunaNpc: { x: 200, y: 390, size: 64 },
      miyaNpc: { x: 650, y: 500, size: 64 },
      nanaNpc: { x: 850, y: 180, size: 64 },
      musicSpot: { x: 350, y: 550, size: 88 },
      partner: { x: 1050, y: 750, size: 64 }
    };
  };

  const startGame = () => {
    audio.init();
    initMap();
    setHearts(0);
    setShowCoffeeModal(false);
    setShowZakyModal(false);
    setShowHunaModal(false);
    setShowMiyaModal(false);
    setShowNanaModal(false);
    setShowMusicModal(false);
    setGameState('PLAYING');
  };

  const goToCharSelect = () => {
    setShowCoffeeModal(false);
    setShowZakyModal(false);
    setShowHunaModal(false);
    setShowMiyaModal(false);
    setShowNanaModal(false);
    setShowMusicModal(false);
    setGameState('START');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = gameRef.current.keys;
      if (['ArrowUp', 'KeyW'].includes(e.code)) k.up = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) k.down = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) k.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) k.right = true;
    };
    const handleKeyUp = (e) => {
      const k = gameRef.current.keys;
      if (['ArrowUp', 'KeyW'].includes(e.code)) k.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) k.down = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) k.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) k.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let animId;
    let stepTimer = 0;
    let frameCounter = 0;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const renderCharacter = (type, x, y, size, isMoving, facingLeft, animTick) => {
      const img = charImagesRef.current[type];
      
      const waterBob = type === 'huna' ? Math.sin(animTick * 0.1) * 4 : 0;
      const bounceY = (isMoving ? Math.sin(animTick * 0.25) * 3 : Math.sin(animTick * 0.08) * 1.2) + waterBob;
      const tiltAngle = isMoving ? Math.sin(animTick * 0.25) * 0.08 : (type === 'huna' ? Math.sin(animTick * 0.08) * 0.04 : 0);

      ctx.save();
      ctx.translate(x + size / 2, y + size / 2 + bounceY);

      ctx.fillStyle = type === 'huna' ? 'rgba(30, 64, 175, 0.4)' : 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(0, size / 2 - 2 - bounceY * 0.5, type === 'huna' ? size * 0.45 : size * 0.35, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      if (facingLeft) ctx.scale(-1, 1);
      ctx.rotate(tiltAngle);

      if (img && img.complete && img.naturalWidth !== 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
      } else {
        ctx.fillStyle = type === 'makkunii' ? '#f43f5e' : type === 'dang' ? '#06b6d4' : type === 'huna' ? '#ec4899' : '#3b82f6';
        ctx.fillRect(-size / 2, -size / 2, size, size);
      }
      ctx.restore();
    };

    const loop = () => {
      frameCounter++;
      const g = gameRef.current;
      const p = g.player;

      if (!modalOpenRef.current) {
        if (g.keys.up) p.vy -= p.accel;
        if (g.keys.down) p.vy += p.accel;
        if (g.keys.left) { p.vx -= p.accel; p.facingLeft = true; }
        if (g.keys.right) { p.vx += p.accel; p.facingLeft = false; }

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > p.maxSpeed) { p.vx = (p.vx / speed) * p.maxSpeed; p.vy = (p.vy / speed) * p.maxSpeed; }

        p.vx *= p.friction;
        p.vy *= p.friction;

        const nextX = p.x + p.vx;
        const nextY = p.y + p.vy;

        let collideX = false, collideY = false;
        g.trees.forEach(t => {
          if (nextX < t.x + 36 && nextX + p.size > t.x && p.y < t.y + 36 && p.y + p.size > t.y) collideX = true;
          if (p.x < t.x + 36 && p.x + p.size > t.x && nextY < t.y + 36 && nextY + p.size > t.y) collideY = true;
        });

        const cs = g.coffeeShop;
        if (nextX < cs.x + cs.width && nextX + p.size > cs.x && p.y < cs.y + cs.height - 15 && p.y + p.size > cs.y) collideX = true;
        if (p.x < cs.x + cs.width && p.x + p.size > cs.x && nextY < cs.y + cs.height - 15 && nextY + p.size > cs.y) collideY = true;

        p.x = collideX ? p.x : Math.max(10, Math.min(g.mapWidth - 40, nextX));
        p.y = collideY ? p.y : Math.max(10, Math.min(g.mapHeight - 40, nextY));

        const isMoving = Math.abs(p.vx) > 0.3 || Math.abs(p.vy) > 0.3;
        if (isMoving && ++stepTimer % 16 === 0) audio.step();

        // Check Coffee Shop interaction
        if (Math.abs(p.x - cs.doorX) < 45 && Math.abs(p.y - cs.doorY) < 45) {
          audio.collect(); setShowCoffeeModal(true); p.y += 100;
        }

        // Check Zaky NPC interaction
        if (Math.abs(p.x - g.zakyNpc.x) < 30 && Math.abs(p.y - g.zakyNpc.y) < 20) {
          audio.collect(); setShowZakyModal(true); p.y += 100;
        }

        // Check Huna NPC interaction
        if (Math.abs(p.x - g.hunaNpc.x) < 30 && Math.abs(p.y - g.hunaNpc.y) < 20) {
          audio.collect(); setShowHunaModal(true); p.y += 100;
        }

        // Check Miya NPC interaction
        if (Math.abs(p.x - g.miyaNpc.x) < 30 && Math.abs(p.y - g.miyaNpc.y) < 20) {
          audio.collect(); setShowMiyaModal(true); p.y += 100;
        }

        // Check Nana NPC interaction
        if (Math.abs(p.x - g.nanaNpc.x) < 30 && Math.abs(p.y - g.nanaNpc.y) < 20) {
          audio.collect(); 
          setShowNanaModal(true); 
          p.y = g.nanaNpc.y + 60; // Safely pushes the player down into the clear path area below her
        }

        // Check Music Spot interaction
        if (Math.abs(p.x - g.musicSpot.x) < 40 && Math.abs(p.y - g.musicSpot.y) < 40) {
          audio.collect(); setShowMusicModal(true); p.y += 100;
        }

        g.notes.forEach(note => {
          if (!note.taken && Math.abs(p.x - note.x) < 30 && Math.abs(p.y - note.y) < 30) {
            note.taken = true; audio.collect(); setHearts(prev => prev + 1);
          }
        });

        if (Math.abs(p.x - g.partner.x) < 50 && Math.abs(p.y - g.partner.y) < 50) {
          audio.winFanfare();
          confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
          setGameState('VICTORY');
          return;
        }
      }

      const isMoving = Math.abs(p.vx) > 0.3 || Math.abs(p.vy) > 0.3;

      g.camera.x = Math.max(0, Math.min(p.x - canvas.width / 2, g.mapWidth - canvas.width));
      g.camera.y = Math.max(0, Math.min(p.y - canvas.height / 2, g.mapHeight - canvas.height));

      // --- RENDER FRAME ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-g.camera.x, -g.camera.y);

      // 1. Base Terrain
      ctx.fillStyle = '#2d5a27';
      ctx.fillRect(0, 0, g.mapWidth, g.mapHeight);

      ctx.fillStyle = '#254e20';
      for (let x = 0; x < g.mapWidth; x += 80) {
        for (let y = 0; y < g.mapHeight; y += 80) {
          if ((x + y) % 160 === 0) ctx.fillRect(x, y, 40, 40);
        }
      }

      ctx.fillStyle = '#3a6f33';
      g.grassTufts.forEach(gt => {
        ctx.fillRect(gt.x, gt.y, 3, 6);
        ctx.fillRect(gt.x + 4, gt.y - 2, 3, 8);
        ctx.fillRect(gt.x + 8, gt.y + 1, 3, 5);
      });

      // 2. Animated Ponds
      g.ponds.forEach(pond => {
        ctx.fillStyle = '#1e40af';
        ctx.beginPath();
        ctx.roundRect(pond.x, pond.y, pond.width, pond.height, 16);
        ctx.fill();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.stroke();

        const rippleOffset = Math.sin(frameCounter * 0.05) * 4;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pond.x + pond.width / 2, pond.y + pond.height / 2, 12 + rippleOffset, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 3. Cobblestone Paths
      const pathPoints = [
        { startX: 100, startY: 100, endX: 1050, endY: 100 },
        { startX: 1050, startY: 100, endX: 1050, endY: 750 },
        { startX: 100, startY: 100, endX: 100, endY: 750 },
        { startX: 100, startY: 750, endX: 1050, endY: 750 },
        { startX: 570, startY: 100, endX: 570, endY: 420 }
      ];

      pathPoints.forEach(pSegment => {
        const stepX = pSegment.startX === pSegment.endX ? 0 : 28;
        const stepY = pSegment.startY === pSegment.endY ? 0 : 28;
        const steps = Math.max(
          Math.abs(pSegment.endX - pSegment.startX) / (stepX || 1),
          Math.abs(pSegment.endY - pSegment.startY) / (stepY || 1)
        );

        for (let i = 0; i <= steps; i++) {
          const cx = pSegment.startX + stepX * i;
          const cy = pSegment.startY + stepY * i;
          ctx.fillStyle = '#64748b';
          ctx.fillRect(cx, cy, 22, 22);
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(cx, cy, 22, 3);
          ctx.fillStyle = '#334155';
          ctx.fillRect(cx, cy + 19, 22, 3);
        }
      });

      // 4. Coffee Shop Building
      const cs = g.coffeeShop;
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(cs.x + 8, cs.y + cs.height - 10, cs.width, 20);

      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(cs.x, cs.y + 20, cs.width, cs.height - 20);

      ctx.fillStyle = '#b45309';
      ctx.fillRect(cs.x - 8, cs.y - 5, cs.width + 16, 25);
      ctx.fillStyle = '#fef08a';
      for (let rx = cs.x - 8; rx < cs.x + cs.width + 16; rx += 24) {
        ctx.fillRect(rx, cs.y - 5, 12, 25);
      }

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(cs.x + 15, cs.y + 35, 28, 28);
      ctx.fillRect(cs.x + cs.width - 43, cs.y + 35, 28, 28);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(cs.x + 28, cs.y + 35, 2, 28);
      ctx.fillRect(cs.x + 15, cs.y + 48, 28, 2);
      ctx.fillRect(cs.x + cs.width - 30, cs.y + 35, 2, 28);
      ctx.fillRect(cs.x + cs.width - 43, cs.y + 48, 28, 2);

      ctx.fillStyle = '#451a03';
      ctx.fillRect(cs.x + 25, cs.y + 2, cs.width - 50, 18);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(cs.x + 25, cs.y + 2, cs.width - 50, 18);
      ctx.fillStyle = '#fef08a';
      ctx.font = '7px "Press Start 2P"';
      ctx.fillText('COFFEE', cs.x + 36, cs.y + 14);

      ctx.fillStyle = '#451a03';
      ctx.fillRect(cs.doorX - 16, cs.doorY - 30, 32, 30);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cs.doorX + 8, cs.doorY - 16, 4, 4);

      const pulseMat = Math.sin(frameCounter * 0.1) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(245, 158, 11, ${pulseMat})`;
      ctx.fillRect(cs.doorX - 18, cs.doorY - 2, 36, 8);

      // 5. Flowers
      g.flowers.forEach(f => {
        ctx.fillStyle = f.color;
        ctx.fillRect(f.x - 2, f.y, 10, 6);
        ctx.fillRect(f.x + 2, f.y - 4, 6, 10);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(f.x + 2, f.y + 1, 4, 4);
      });

      // 6. Love Notes
      g.notes.forEach(n => {
        if (!n.taken) {
          const floatY = Math.sin(frameCounter * 0.08) * 3;
          const pulse = Math.sin(frameCounter * 0.12) * 1.5;

          ctx.save();
          ctx.translate(n.x + 8, n.y + 8 + floatY);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          ctx.beginPath();
          ctx.ellipse(0, 12, 8, 3, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f43f5e';
          const size = 8 + pulse;
          ctx.beginPath();
          ctx.arc(-size / 2, -size / 2, size / 2, Math.PI, 0, false);
          ctx.arc(size / 2, -size / 2, size / 2, Math.PI, 0, false);
          ctx.lineTo(0, size / 2 + 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      });

      // 7. Trees
      g.trees.forEach(t => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(t.x + 18, t.y + 32, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#78350f';
        ctx.fillRect(t.x + 12, t.y + 16, 12, 18);
        ctx.fillStyle = '#451a03';
        ctx.fillRect(t.x + 20, t.y + 16, 4, 18);

        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.arc(t.x + 18, t.y + 10, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(t.x + 14, t.y + 6, 13, 0, Math.PI * 2);
        ctx.fill();
      });

      // 8. Render Music Spot Object on Map
      const musicImg = charImagesRef.current.music;
      if (musicImg && musicImg.complete && musicImg.naturalWidth !== 0) {
        ctx.drawImage(musicImg, g.musicSpot.x, g.musicSpot.y, g.musicSpot.size, g.musicSpot.size);
      } else {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(g.musicSpot.x, g.musicSpot.y, g.musicSpot.size, g.musicSpot.size);
      }

      // Render NPCs and Player
      renderCharacter('zaky', g.zakyNpc.x, g.zakyNpc.y, g.zakyNpc.size, false, false, frameCounter);
      renderCharacter('huna', g.hunaNpc.x, g.hunaNpc.y, g.hunaNpc.size, false, false, frameCounter);
      renderCharacter('miya', g.miyaNpc.x, g.miyaNpc.y, g.miyaNpc.size, false, false, frameCounter);
      renderCharacter('nana', g.nanaNpc.x, g.nanaNpc.y, g.nanaNpc.size, false, false, frameCounter);
      renderCharacter(playerChar, p.x, p.y, p.size, isMoving, p.facingLeft, frameCounter);
      
      const targetChar = playerChar === 'makkunii' ? 'dang' : 'makkunii';
      renderCharacter(targetChar, g.partner.x, g.partner.y, g.partner.size, false, false, frameCounter);

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, playerChar]);

  const setDir = (dir, active) => { gameRef.current.keys[dir] = active; };

  return (
    <div className="game-container">
      <HudBar muted={muted} toggleAudio={toggleAudio} gameState={gameState} goToCharSelect={goToCharSelect} hearts={hearts} />

      <div className="canvas-viewport">
        <canvas ref={canvasRef} width={800} height={360} className="game-canvas" />

        {gameState === 'START' && (
          <StartScreen 
            playerChar={playerChar} 
            setPlayerChar={setPlayerChar} 
            startGame={startGame} 
            assetsLoaded={assetsLoaded} 
            makkuniiImgSrc={makkuniiImgSrc} 
            dangImgSrc={dangImgSrc} 
          />
        )}

        {showCoffeeModal && <CoffeeModal onClose={() => setShowCoffeeModal(false)} coffeePhotoImgSrc={coffeePhotoImgSrc} />}
        {showZakyModal && <ZakyModal onClose={() => setShowZakyModal(false)} zakyImgSrc={zakyImgSrc} />}
        {showHunaModal && <HunaModal onClose={() => setShowHunaModal(false)} hunaImgSrc={hunaImgSrc} />}
        {showMiyaModal && <MiyaModal onClose={() => setShowMiyaModal(false)} miyaImgSrc={miyaImgSrc} />}
        {showNanaModal && <NanaModal onClose={() => setShowNanaModal(false)} nanaImgSrc={nanaImgSrc} />}
        {showMusicModal && <MusicModal onClose={() => setShowMusicModal(false)} musicImgSrc={musicImgSrc} />}

        {gameState === 'VICTORY' && (
          <VictoryModal playerChar={playerChar} hearts={hearts} startGame={startGame} goToCharSelect={goToCharSelect} coverImgSrc={coverImgSrc} />
        )}
      </div>

      {gameState === 'PLAYING' && <TouchControls setDir={setDir} />}
    </div>
  );
}