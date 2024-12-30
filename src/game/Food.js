export class Food {
  constructor(cols, rows, gridSize) {
    this.cols = cols;
    this.rows = rows;
    this.gridSize = gridSize;
    this.position = { x: 0, y: 0 };
    
    // 定义食物类型
    this.types = {
      NORMAL: {
        color: '#FF5722',
        points: 10,
        probability: 0.7,  // 70%概率出现普通食物
        effect: null
      },
      GOLDEN: {
        color: '#FFD700',
        points: 30,
        probability: 0.15,  // 15%概率出现金色食物
        effect: 'doublePoints'
      },
      SPEED: {
        color: '#00FF00',
        points: 20,
        probability: 0.1,  // 10%概率出现速度食物
        effect: 'speedUp'
      },
      SLOW: {
        color: '#4169E1',
        points: 20,
        probability: 0.05,  // 5%概率出现减速食物
        effect: 'slowDown'
      }
    };

    this.currentType = this.types.NORMAL;
    this.effectDuration = 5000; // 特殊效果持续5秒
  }

  // 生成新的食物位置和类型
  generate(snakeBody) {
    // 生成新位置
    let newPosition;
    do {
      newPosition = {
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows)
      };
    } while (this.checkCollisionWithSnake(newPosition, snakeBody));
    
    this.position = newPosition;

    // 随机选择食物类型
    const random = Math.random();
    let probabilitySum = 0;
    
    for (const type of Object.values(this.types)) {
      probabilitySum += type.probability;
      if (random <= probabilitySum) {
        this.currentType = type;
        break;
      }
    }
  }

  // 绘制食物
  draw(ctx) {
    const x = this.position.x * this.gridSize;
    const y = this.position.y * this.gridSize;
    const size = this.gridSize - 2;
    const radius = size / 2;

    ctx.save();
    ctx.fillStyle = this.currentType.color;

    // 绘制基本形状
    ctx.beginPath();
    ctx.arc(
      x + this.gridSize / 2,
      y + this.gridSize / 2,
      radius - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 添加特效
    if (this.currentType !== this.types.NORMAL) {
      // 添加光晕效果
      const gradient = ctx.createRadialGradient(
        x + radius,
        y + radius,
        radius / 3,
        x + radius,
        y + radius,
        radius * 1.2
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // 添加闪烁动画
      const glowSize = Math.sin(Date.now() / 200) * 2 + 4;
      ctx.beginPath();
      ctx.arc(
        x + this.gridSize / 2,
        y + this.gridSize / 2,
        radius + glowSize,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = this.currentType.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  // 获取当前食物类型和效果
  getEffect() {
    return {
      points: this.currentType.points,
      effect: this.currentType.effect,
      duration: this.effectDuration
    };
  }

  // 检查是否被吃掉
  isEaten(snakeHead) {
    return snakeHead.x === this.position.x && snakeHead.y === this.position.y;
  }

  // 检查位置是否与蛇身重叠
  checkCollisionWithSnake(position, snakeBody) {
    return snakeBody.some(segment => 
      segment.x === position.x && segment.y === position.y
    );
  }
} 