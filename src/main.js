import './style.css'
import { Game } from './game/Game.js'

// 清理默认内容
document.querySelector('#app').innerHTML = `
  <div class="game-container">
    <canvas id="gameCanvas"></canvas>
    <div id="gameInfo">
      <div id="score">分数: 0</div>
      <div id="highScore">最高分: 0</div>
    </div>
  </div>
`;

// 初始化游戏
const game = new Game('gameCanvas');
