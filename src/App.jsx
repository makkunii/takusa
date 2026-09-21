import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { audio } from './utils/soundEngine';
import HudBar from './components/HudBar';
import StartScreen from './components/StartScreen';
import CoffeeModal from './components/CoffeeModal';
import VapeModal from './components/VapeModal';
import ZakyModal from './components/ZakyModal';
import HunaModal from './components/HunaModal';
import MiyaModal from './components/MiyaModal';
import NanaModal from './components/NanaModal';
import MusicModal from './components/MusicModal';
import PartnerMessageModal from './components/PartnerMessageModal'; 
import VictoryModal from './components/VictoryModal';
import TouchControls from './components/TouchControls';
import './App.css';

import { ASSET_SOURCES, createInitialMapState } from './game/gameConfig';
import coverImgSrc from './assets/cover-image.png';
import coffeePhotoImgSrc from './assets/coffee-photo.png';

export default function App() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('START'); // 'START' | 'PLAYING' | 'VICTORY'
  const [hearts, setHearts] = useState(0);
  const [muted, setMuted] = useState(false);
  const [playerChar, setPlayerChar] = useState('makkunii');
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const modalOpenRef = useRef(false);
  modalOpenRef.current = activeModal !== null;

  const charImagesRef = useRef({});
  const gameRef = useRef(createInitialMapState());

  // Preload assets efficiently
  useEffect(() => {
    let loadedCount = 0;
    const entries = Object.entries(ASSET_SOURCES);
    const totalAssets = entries.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalAssets) setAssetsLoaded(true);
    };

    const images = {};
    entries.forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded; 
      images[key] = img;
    });
    charImagesRef.current = images;
  }, []);

  const toggleAudio = () => {
    audio.muted = !muted;
    setMuted(!muted);
  };

  const startGame = () => {
    audio.init();
    gameRef.current = createInitialMapState();
    setHearts(0);
    setActiveModal(null);
    setGameState('PLAYING');
  };

  const goToCharSelect = () => {
    setActiveModal(null);
    setGameState('START');
  };

  // Setup Keyboard Control Listeners
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

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let animId;
    let stepTimer = 0;
    let frameCounter = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderCharacter = (type, x, y, size, isMoving, facingLeft, animTick) => {
      const img = charImagesRef.current[type];
      
      const waterBob = type === 'huna' ? Math.sin(animTick * 0.1) * 4 : 0;
      const bounceY = (isMoving ? Math.sin(animTick * 0.25) * 3 : Math.sin(animTick * 0.08) * 1.2) + waterBob;
      const tiltAngle = isMoving ? Math.sin(animTick * 0.25) * 0.08 : (type === 'huna' ? Math.sin(animTick * 0.08) * 0.04 : 0);

      ctx.save();
      ctx.translate(x + size / 2, y + size / 2 + bounceY);

      // Soft character shadow
      ctx.fillStyle = type === 'huna' ? 'rgba(76, 29, 149, 0.3)' : 'rgba(40, 15, 45, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, size / 2 - 2 - bounceY * 0.5, type === 'huna' ? size * 0.45 : size * 0.35, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      if (facingLeft) ctx.scale(-1, 1);
      ctx.rotate(tiltAngle);

      if (img && img.complete && img.naturalWidth !== 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
      } else {
        ctx.fillStyle = type === 'makkunii' ? '#fb7185' : type === 'dang' ? '#38bdf8' : '#f472b6';
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

        const pBox = { offsetX: 16, offsetY: 32, width: 32, height: 28 };
        let collideX = false, collideY = false;
        
        g.trees.forEach(t => {
          const tBox = { x: t.x + 10, y: t.y + 16, width: 20, height: 18 };
          if (nextX + pBox.offsetX < tBox.x + tBox.width && nextX + pBox.offsetX + pBox.width > tBox.x && p.y + pBox.offsetY < tBox.y + tBox.height && p.y + pBox.offsetY + pBox.height > tBox.y) collideX = true;
          if (p.x + pBox.offsetX < tBox.x + tBox.width && p.x + pBox.offsetX + pBox.width > tBox.x && nextY + pBox.offsetY < tBox.y + tBox.height && nextY + pBox.offsetY + pBox.height > tBox.y) collideY = true;
        });

        p.x = collideX ? p.x : Math.max(10, Math.min(g.mapWidth - 40, nextX));
        p.y = collideY ? p.y : Math.max(10, Math.min(g.mapHeight - 40, nextY));

        const isMoving = Math.abs(p.vx) > 0.3 || Math.abs(p.vy) > 0.3;
        if (isMoving && ++stepTimer % 16 === 0) audio.step();

        const checkTrigger = (spot) => {
          return Math.abs((p.x + p.size / 2) - (spot.x + spot.width / 2)) < 50 && 
                 Math.abs((p.y + p.size / 2) - (spot.y + spot.height / 2)) < 50;
        };

        if (checkTrigger(g.coffeeShop)) {
          audio.collect(); setActiveModal('coffee'); p.y += 65;
        }
        else if (checkTrigger(g.vapeShop)) {
          audio.collect(); setActiveModal('vape'); p.y += 65;
        }
        else if (checkTrigger(g.musicSpot)) {
          audio.collect(); setActiveModal('music'); p.y += 65;
        }
        else if (Math.abs((p.x + p.size / 2) - (g.zakyNpc.x + g.zakyNpc.size / 2)) < 35 && Math.abs((p.y + p.size / 2) - (g.zakyNpc.y + g.zakyNpc.size / 2)) < 35) {
          audio.collect(); setActiveModal('zaky'); p.y += 65;
        }
        else if (Math.abs((p.x + p.size / 2) - (g.hunaNpc.x + g.hunaNpc.size / 2)) < 35 && Math.abs((p.y + p.size / 2) - (g.hunaNpc.y + g.hunaNpc.size / 2)) < 35) {
          audio.collect(); setActiveModal('huna'); p.y += 65;
        }
        else if (Math.abs((p.x + p.size / 2) - (g.miyaNpc.x + g.miyaNpc.size / 2)) < 35 && Math.abs((p.y + p.size / 2) - (g.miyaNpc.y + g.miyaNpc.size / 2)) < 35) {
          audio.collect(); setActiveModal('miya'); p.y += 65;
        }
        else if (Math.abs((p.x + p.size / 2) - (g.nanaNpc.x + g.nanaNpc.size / 2)) < 35 && Math.abs((p.y + p.size / 2) - (g.nanaNpc.y + g.nanaNpc.size / 2)) < 35) {
          audio.collect(); setActiveModal('nana'); p.y = g.nanaNpc.y + 70;
        }

        g.notes.forEach(note => {
          if (!note.taken && Math.abs((p.x + p.size / 2) - (note.x + 12)) < 28 && Math.abs((p.y + p.size / 2) - (note.y + 12)) < 28) {
            note.taken = true; 
            audio.collect(); 
            setHearts(prev => {
              const newTotal = prev + 1;
              if (newTotal >= 5) {
                audio.winFanfare();
                confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
                setActiveModal('partner');
              }
              return newTotal;
            });
          }
        });

        if (Math.abs((p.x + p.size / 2) - (g.partner.x + g.partner.size / 2)) < 35 && Math.abs((p.y + p.size / 2) - (g.partner.y + g.partner.size / 2)) < 35) {
          audio.winFanfare();
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
          setGameState('VICTORY');
          return;
        }
      }

      const isMoving = Math.abs(p.vx) > 0.3 || Math.abs(p.vy) > 0.3;

      g.camera.x = Math.max(0, Math.min(p.x - canvas.width / 2, g.mapWidth - canvas.width));
      g.camera.y = Math.max(0, Math.min(p.y - canvas.height / 2, g.mapHeight - canvas.height));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-g.camera.x, -g.camera.y);

      // Terrain
      ctx.fillStyle = '#375a3e';
      ctx.fillRect(0, 0, g.mapWidth, g.mapHeight);

      ctx.fillStyle = '#2e4d35';
      for (let x = 0; x < g.mapWidth; x += 80) {
        for (let y = 0; y < g.mapHeight; y += 80) {
          if ((x + y) % 160 === 0) ctx.fillRect(x, y, 40, 40);
        }
      }

      ctx.fillStyle = '#4c7a54';
      g.grassTufts.forEach(gt => {
        ctx.fillRect(gt.x, gt.y, 3, 6);
        ctx.fillRect(gt.x + 4, gt.y - 2, 3, 8);
        ctx.fillRect(gt.x + 8, gt.y + 1, 3, 5);
      });

      // Ponds
      g.ponds.forEach(pond => {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(pond.x, pond.y, pond.width, pond.height, 16);
        ctx.fill();
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        const rippleOffset = Math.sin(frameCounter * 0.05) * 4;
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pond.x + pond.width / 2, pond.y + pond.height / 2, 12 + rippleOffset, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Paths
      const pathPoints = [
        { startX: 100, startY: 100, endX: 1050, endY: 100 },
        { startX: 1050, startY: 100, endX: 1050, endY: 750 },
        { startX: 100, startY: 100, endX: 100, endY: 750 },
        { startX: 100, startY: 750, endX: 1050, endY: 750 },
        { startX: 450, startY: 100, endX: 450, endY: 410 },
        { startX: 750, startY: 100, endX: 750, endY: 410 }
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
          ctx.fillStyle = '#8b7355';
          ctx.fillRect(cx, cy, 22, 22);
          ctx.fillStyle = '#a48764';
          ctx.fillRect(cx, cy, 22, 3);
          ctx.fillStyle = '#6e5a42';
          ctx.fillRect(cx, cy + 19, 22, 3);
        }
      });

      // Shops & Music Building
      const renderShop = (shop, imgRef) => {
        const img = charImagesRef.current[imgRef];
        const assetOffsetY = 35;
        if (img && img.complete && img.naturalWidth !== 0) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, shop.x, shop.y - assetOffsetY, shop.width, shop.height + assetOffsetY);
        } else {
          ctx.fillStyle = imgRef === 'coffee' ? '#7c2d12' : '#334155';
          ctx.fillRect(shop.x, shop.y, shop.width, shop.height);
        }
      };

      renderShop(g.coffeeShop, 'coffee');
      renderShop(g.vapeShop, 'vape');

      const musicImg = charImagesRef.current.music;
      const ms = g.musicSpot;
      if (musicImg && musicImg.complete && musicImg.naturalWidth !== 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(musicImg, ms.x, ms.y - 35, ms.width, ms.height + 35);
      } else {
        ctx.fillStyle = '#059669';
        ctx.fillRect(ms.x, ms.y, ms.width, ms.height);
      }

      // Flowers
      g.flowers.forEach(f => {
        ctx.fillStyle = f.color;
        ctx.fillRect(f.x - 2, f.y, 10, 6);
        ctx.fillRect(f.x + 2, f.y - 4, 6, 10);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(f.x + 2, f.y + 1, 4, 4);
      });

      // Collectible Hearts
      g.notes.forEach(n => {
        if (!n.taken) {
          const floatY = Math.sin(frameCounter * 0.08) * 4;
          const pulse = Math.sin(frameCounter * 0.12) * 2;

          ctx.save();
          ctx.translate(n.x + 12, n.y + 12 + floatY);
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.beginPath();
          ctx.ellipse(0, 14, 10, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          const size = 14 + pulse;

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-size / 2 - 1, -size / 2 - 1, size / 2 + 1, Math.PI, 0, false);
          ctx.arc(size / 2 + 1, -size / 2 - 1, size / 2 + 1, Math.PI, 0, false);
          ctx.lineTo(0, size / 2 + 3);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(-size / 2, -size / 2, size / 2, Math.PI, 0, false);
          ctx.arc(size / 2, -size / 2, size / 2, Math.PI, 0, false);
          ctx.lineTo(0, size / 2 + 2);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      });

      // Trees
      g.trees.forEach(t => {
        ctx.fillStyle = 'rgba(40, 15, 45, 0.35)';
        ctx.beginPath();
        ctx.ellipse(t.x + 18, t.y + 32, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#6b4423';
        ctx.fillRect(t.x + 12, t.y + 16, 12, 18);
        ctx.fillStyle = '#4a2e16';
        ctx.fillRect(t.x + 20, t.y + 16, 4, 18);

        ctx.fillStyle = '#1e4d30';
        ctx.beginPath();
        ctx.arc(t.x + 18, t.y + 10, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2a6b44';
        ctx.beginPath();
        ctx.arc(t.x + 14, t.y + 6, 13, 0, Math.PI * 2);
        ctx.fill();
      });

      // Floating Particles
      g.floatingParticles.forEach(fp => {
        fp.y -= fp.speedY;
        if (fp.y < 0) fp.y = g.mapHeight;
        ctx.fillStyle = `rgba(251, 113, 133, ${fp.opacity})`;
        ctx.fillRect(fp.x, fp.y, fp.size, fp.size);
      });

      // Render Characters
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
      <HudBar 
        muted={muted} 
        toggleAudio={toggleAudio} 
        gameState={gameState} 
        goToCharSelect={goToCharSelect} 
        hearts={hearts} 
      />

      <div className="canvas-viewport">
        <canvas ref={canvasRef} width={800} height={360} className="game-canvas" />

        {gameState === 'START' && (
          <StartScreen 
            playerChar={playerChar} 
            setPlayerChar={setPlayerChar} 
            startGame={startGame} 
            assetsLoaded={assetsLoaded} 
            makkuniiImgSrc={ASSET_SOURCES.makkunii} 
            dangImgSrc={ASSET_SOURCES.dang} 
          />
        )}

        {activeModal === 'coffee' && <CoffeeModal onClose={() => setActiveModal(null)} coffeePhotoImgSrc={coffeePhotoImgSrc} />}
        {activeModal === 'vape' && <VapeModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'zaky' && <ZakyModal onClose={() => setActiveModal(null)} zakyImgSrc={ASSET_SOURCES.zaky} />}
        {activeModal === 'huna' && <HunaModal onClose={() => setActiveModal(null)} hunaImgSrc={ASSET_SOURCES.huna} />}
        {activeModal === 'miya' && <MiyaModal onClose={() => setActiveModal(null)} miyaImgSrc={ASSET_SOURCES.miya} />}
        {activeModal === 'nana' && <NanaModal onClose={() => setActiveModal(null)} nanaImgSrc={ASSET_SOURCES.nana} />}
        {activeModal === 'music' && <MusicModal onClose={() => setActiveModal(null)} musicImgSrc={ASSET_SOURCES.music} />}
        {activeModal === 'partner' && <PartnerMessageModal onClose={() => setActiveModal(null)} />}

        {gameState === 'VICTORY' && (
          <VictoryModal 
            playerChar={playerChar} 
            hearts={hearts} 
            startGame={startGame} 
            goToCharSelect={goToCharSelect} 
            coverImgSrc={coverImgSrc} 
          />
        )}
      </div>

      {gameState === 'PLAYING' && <TouchControls setDir={setDir} />}
    </div>
  );
}