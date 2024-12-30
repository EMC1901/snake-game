import { Snake } from './Snake.js';
import { Food } from './Food.js';
import { SoundManager } from './SoundManager.js';

export class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // 设置画布尺寸
    this.canvas.width = 800;
    this.canvas.height = 600;
    
    // 网格配置
    this.gridSize = 20;
    this.cols = this.canvas.width / this.gridSize;
    this.rows = this.canvas.height / this.gridSize;
    
    // 明确设置初始游戏状态
    this.gameState = 'INIT';
    
    // 初始化分数
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
    
    // 游戏配置
    this.initialSpeed = 300;
    this.currentSpeed = this.initialSpeed;
    this.minSpeed = 100;
    this.lastUpdateTime = 0;
    
    // 初始化游戏对象
    this.snake = new Snake(this.cols, this.rows, this.gridSize);
    this.food = new Food(this.cols, this.rows, this.gridSize);
    this.soundManager = new SoundManager();
    
    // 确保方法绑定到实例
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    
    // 绑定事件监听器
    window.addEventListener('keydown', this.handleKeyPress);
    
    // 创建音效按钮并显示开始屏幕
    this.createSoundButton();
    this.drawStartScreen();
    
    // 调试日志
    console.log('Game initialized with state:', this.gameState);
    
    // 添加特殊效果状态
    this.effects = {
      doublePoints: false,
      speedUp: false,
      slowDown: false
    };
    
    // 特效计时器
    this.effectTimers = {};
    
    // 添加点击事件监听器来初始化音频
    document.addEventListener('click', () => {
        this.soundManager.init();  // 添加 init 方法
    }, { once: true });  // 只执行一次
  }

  handleKeyPress(event) {
    // 添加调试日志
    console.log('Key pressed:', event.key, 'Current state:', this.gameState);
    
    switch (event.key) {
      case ' ':
        event.preventDefault(); // 防止空格键滚动页面
        if (this.gameState === 'INIT') {
          console.log('Starting game from INIT state');
          this.start();
        } else if (this.gameState === 'PLAYING') {
          console.log('Pausing game');
          this.pause();
        } else if (this.gameState === 'PAUSED') {
          console.log('Resuming game');
          this.resume();
        } else if (this.gameState === 'GAME_OVER') {
          console.log('Restarting game');
          this.start();
        }
        break;
      case 'q':
      case 'Q':  // Q键控制音乐
        this.toggleBackgroundMusic();
        break;
      case 'ArrowUp':
        if (this.gameState === 'PLAYING') {
          this.snake.setDirection('UP');
        }
        break;
      case 'ArrowDown':
        if (this.gameState === 'PLAYING') {
          this.snake.setDirection('DOWN');
        }
        break;
      case 'ArrowLeft':
        if (this.gameState === 'PLAYING') {
          this.snake.setDirection('LEFT');
        }
        break;
      case 'ArrowRight':
        if (this.gameState === 'PLAYING') {
          this.snake.setDirection('RIGHT');
        }
        break;
    }
  }

  // 添加音乐控制方法
  toggleBackgroundMusic() {
    if (this.soundManager.sounds.background.paused) {
      this.soundManager.startBackgroundMusic();
    } else {
      this.soundManager.stopBackgroundMusic();
    }
  }

  start() {
    console.log('Start method called');
    this.gameState = 'PLAYING';
    this.score = 0;
    this.currentSpeed = this.initialSpeed;
    
    // 重置蛇和食物
    this.snake = new Snake(this.cols, this.rows, this.gridSize);
    this.food.generate(this.snake.getBody());
    
    // 设置初始时间
    this.lastUpdateTime = performance.now();
    
    // 开始游戏循环
    console.log('Starting game loop');
    requestAnimationFrame((timestamp) => {
      this.lastUpdateTime = timestamp;
      this.gameLoop(timestamp);
    });
  }

  pause() {
    if (this.gameState === 'PLAYING') {
      this.gameState = 'PAUSED';
      // 移除暂停时自动停止背景音乐
    }
  }

  resume() {
    if (this.gameState === 'PAUSED') {
      this.gameState = 'PLAYING';
      this.lastUpdateTime = performance.now();
      // 移除恢复时自动开始背景音乐
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  gameLoop(timestamp) {
    // 添加调试日志
    console.log('Game loop running, state:', this.gameState);
    
    if (this.gameState !== 'PLAYING') {
      console.log('Game loop stopped, state:', this.gameState);
      return;
    }

    requestAnimationFrame((t) => this.gameLoop(t));

    const deltaTime = timestamp - this.lastUpdateTime;
    if (deltaTime < this.currentSpeed) return;

    this.lastUpdateTime = timestamp;
    this.update();
    this.draw();
  }

  update() {
    const oldHead = this.snake.getHead();
    
    // 更新蛇的位置
    this.snake.move();
    
    // 注释掉移动音效
    // const newHead = this.snake.getHead();
    // if (oldHead.x !== newHead.x || oldHead.y !== newHead.y) {
    //     this.soundManager.play('move');
    // }

    // 检查是否吃到食物
    if (this.food.isEaten(this.snake.getHead())) {
        this.soundManager.play('eat');
        this.snake.grow();
        
        // 获取食物效果
        const effect = this.food.getEffect();
        
        // 添加分数
        this.score += this.effects.doublePoints ? effect.points * 2 : effect.points;
        
        // 应用特殊效果
        if (effect.effect) {
          this.applyEffect(effect.effect, effect.duration);
        }
        
        // 生成新食物
        this.food.generate(this.snake.getBody());
        
        // 更新速度
        this.updateSpeed();
    }

    // 检查碰撞
    if (this.snake.checkCollision()) {
        this.soundManager.play('gameOver');
        this.soundManager.stopBackgroundMusic();
        this.gameOver();
    }
  }

  draw() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制网格
    this.drawGrid();
    
    // 绘制食物
    this.food.draw(this.ctx);
    
    // 绘制蛇
    this.snake.draw(this.ctx);
    
    // 更新分数显示
    this.updateScore();

    // 如果游戏暂停，显示暂停信息
    if (this.gameState === 'PAUSED') {
      this.drawPauseScreen();
    }
  }

  drawStartScreen() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    
    this.ctx.fillStyle = '#333';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('按空格键开始游戏', this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.font = '20px Arial';
    this.ctx.fillText('按 Q 键开启/关闭背景音乐', this.canvas.width / 2, this.canvas.height / 2 + 40);
  }

  drawPauseScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('游戏暂停', this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.fillText('按空格键继续', this.canvas.width / 2, this.canvas.height / 2 + 40);
  }

  gameOver() {
    this.gameState = 'GAME_OVER';
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('highScore', this.highScore);
    }
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 40);
    this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.fillText('按空格键重新开始', this.canvas.width / 2, this.canvas.height / 2 + 40);
  }

  drawGrid() {
    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.lineWidth = 0.5;

    for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  updateSpeed() {
    const speedIncrease = Math.floor(this.score / 40);
    const newSpeed = this.initialSpeed * Math.pow(0.9, speedIncrease);
    this.currentSpeed = Math.max(newSpeed, this.minSpeed);
  }

  updateScore() {
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    
    let scoreText = `分数: ${this.score}`;
    if (this.effects.doublePoints) scoreText += ' (双倍分数!)';
    if (this.effects.speedUp) scoreText += ' (加速!)';
    if (this.effects.slowDown) scoreText += ' (减速!)';
    
    if (scoreElement) scoreElement.textContent = scoreText;
    if (highScoreElement) highScoreElement.textContent = `最高分: ${this.highScore}`;
  }

  createSoundButton() {
    const button = document.createElement('button');
    button.innerHTML = '🔊';
    button.className = 'sound-button';
    button.onclick = () => {
      const enabled = this.soundManager.toggleSound();
      button.innerHTML = enabled ? '🔊' : '🔈';
    };
    document.getElementById('gameInfo').appendChild(button);
  }

  applyEffect(effectType, duration) {
    // 清除已有的相同效果计时器
    if (this.effectTimers[effectType]) {
      clearTimeout(this.effectTimers[effectType]);
    }

    // 应用效果
    switch (effectType) {
      case 'doublePoints':
        this.effects.doublePoints = true;
        break;
      case 'speedUp':
        this.effects.speedUp = true;
        this.currentSpeed = Math.max(this.currentSpeed * 0.7, this.minSpeed);
        break;
      case 'slowDown':
        this.effects.slowDown = true;
        this.currentSpeed = this.currentSpeed * 1.3;
        break;
    }

    // 设置效果结束计时器
    this.effectTimers[effectType] = setTimeout(() => {
      switch (effectType) {
        case 'doublePoints':
          this.effects.doublePoints = false;
          break;
        case 'speedUp':
          this.effects.speedUp = false;
          this.updateSpeed(); // 恢复正常速度
          break;
        case 'slowDown':
          this.effects.slowDown = false;
          this.updateSpeed(); // 恢复正常速度
          break;
      }
    }, duration);
  }
} 