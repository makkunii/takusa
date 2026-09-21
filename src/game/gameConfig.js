// src/game/gameConfig.js
import makkuniiImgSrc from '../assets/characters/makkunii/makkunii.png';
import dangImgSrc from '../assets/characters/dang/dang.png';
import zakyImgSrc from '../assets/characters/zaky/zaky.png';
import hunaImgSrc from '../assets/characters/huna/huna.png';
import miyaImgSrc from '../assets/characters/miya/miya.png';
import nanaImgSrc from '../assets/characters/nana/nana.png';
import musicImgSrc from '../assets/characters/music/music.png';
import coffeeAssetImgSrc from '../assets/characters/coffee/coffee.png';
import vapeAssetImgSrc from '../assets/characters/vape/vape.png';

export const MAP_WIDTH = 1200;
export const MAP_HEIGHT = 900;

export const ASSET_SOURCES = {
  makkunii: makkuniiImgSrc,
  dang: dangImgSrc,
  zaky: zakyImgSrc,
  huna: hunaImgSrc,
  miya: miyaImgSrc,
  nana: nanaImgSrc,
  music: musicImgSrc,
  coffee: coffeeAssetImgSrc,
  vape: vapeAssetImgSrc,
};

export const createInitialMapState = () => {
  const trees = [];
  const flowers = [];
  const grassTufts = [];
  const notes = [];
  const floatingParticles = [];

  // Outer border trees
  for (let x = 0; x < MAP_WIDTH; x += 40) { trees.push({ x, y: 0 }, { x, y: MAP_HEIGHT - 40 }); }
  for (let y = 0; y < MAP_HEIGHT; y += 40) { trees.push({ x: 0, y }, { x: MAP_WIDTH - 40, y }); }

  const forestSpots = [
    { x: 150, y: 200 }, { x: 190, y: 200 }, { x: 150, y: 240 }, 
    { x: 900, y: 550 }, { x: 940, y: 550 }, { x: 240, y: 640 }
  ];
  forestSpots.forEach(spot => trees.push(spot));

  for (let i = 0; i < 60; i++) {
    flowers.push({ 
      x: Math.floor(Math.random() * 26 + 2) * 40 + Math.random() * 10, 
      y: Math.floor(Math.random() * 19 + 2) * 40 + Math.random() * 10, 
      color: i % 3 === 0 ? '#fb7185' : i % 3 === 1 ? '#fde047' : '#f472b6' 
    });
  }

  for (let i = 0; i < 100; i++) {
    grassTufts.push({ x: Math.floor(Math.random() * 28 + 1) * 40, y: Math.floor(Math.random() * 21 + 1) * 40 });
  }

  for (let i = 0; i < 20; i++) {
    floatingParticles.push({
      x: Math.random() * MAP_WIDTH,
      y: Math.random() * MAP_HEIGHT,
      speedY: 0.2 + Math.random() * 0.4,
      size: 2 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.6
    });
  }

  const ponds = [
    { x: 180, y: 380, width: 110, height: 75 }, 
    { x: 850, y: 580, width: 110, height: 75 }
  ];
  
  const notePositions = [
    { x: 400, y: 160 }, 
    { x: 700, y: 160 }, 
    { x: 200, y: 120 }, 
    { x: 950, y: 120 }, 
    { x: 440, y: 470 }  
  ];
  notePositions.forEach(p => notes.push({ ...p, taken: false }));

  return {
    player: { x: 100, y: 100, vx: 0, vy: 0, accel: 0.55, friction: 0.80, maxSpeed: 4.0, size: 64, facingLeft: false },
    camera: { x: 0, y: 0 },
    keys: { up: false, down: false, left: false, right: false },
    mapWidth: MAP_WIDTH, 
    mapHeight: MAP_HEIGHT, 
    trees, 
    flowers, 
    grassTufts, 
    ponds, 
    notes, 
    floatingParticles,
    coffeeShop: { x: 340, y: 220, width: 220, height: 190 },
    vapeShop: { x: 640, y: 220, width: 220, height: 190 },
    zakyNpc: { x: 200, y: 180, size: 64 },
    hunaNpc: { x: 200, y: 390, size: 64 },
    miyaNpc: { x: 650, y: 500, size: 64 },
    nanaNpc: { x: 950, y: 180, size: 64 },
    musicSpot: { x: 340, y: 530, width: 220, height: 190 },
    partner: { x: 1050, y: 750, size: 64 }
  };
};