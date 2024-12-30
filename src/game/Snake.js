export class Snake {
  constructor(cols, rows, gridSize) {
    // 网格系统参数
    this.cols = cols;
    this.rows = rows;
    this.gridSize = gridSize;
    
    // 蛇的初始状态
    this.init();
    
    // 移动方向 (初始向右)
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT'; // 用于存储下一步的方向，防止快速按键导致的自身碰撞
    
    // 方向映射
    this.directionMap = {
      'UP': { x: 0, y: -1 },
      'DOWN': { x: 0, y: 1 },
      'LEFT': { x: -1, y: 0 },
      'RIGHT': { x: 1, y: 0 }
    };
  }

  init() {
    // 初始化蛇的位置（从中心开始）
    const centerX = Math.floor(this.cols / 2);
    const centerY = Math.floor(this.rows / 2);
    
    // 初始长度为3，水平排列
    this.body = [
      { x: centerX, y: centerY },     // 蛇头
      { x: centerX - 1, y: centerY }, // 身体
      { x: centerX - 2, y: centerY }  // 尾巴
    ];
  }

  move() {
    // 更新方向
    this.direction = this.nextDirection;
    
    // 获取移动增量
    const delta = this.directionMap[this.direction];
    
    // 获取新的头部位置
    const newHead = {
      x: (this.body[0].x + delta.x + this.cols) % this.cols, // 穿墙处理
      y: (this.body[0].y + delta.y + this.rows) % this.rows  // 穿墙处理
    };
    
    // 将新头部添加到身体数组的开头
    this.body.unshift(newHead);
    
    // 移除尾部（除非刚吃到食物，由外部控制）
    return this.body.pop();
  }

  grow() {
    // 通过保留尾部实现生长
    const tail = this.body[this.body.length - 1];
    this.body.push({ ...tail });
  }

  setDirection(newDirection) {
    // 防止反向移动
    const opposites = {
      'UP': 'DOWN',
      'DOWN': 'UP',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT'
    };
    
    // 如果是相反方向，则忽略
    if (opposites[this.direction] === newDirection) {
      return;
    }
    
    this.nextDirection = newDirection;
  }

  checkCollision() {
    const head = this.body[0];
    
    // 检查是否与身体碰撞
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }
    
    return false;
  }

  draw(ctx) {
    // 绘制蛇身
    this.body.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#4CAF50' : '#81C784'; // 蛇头深绿色，身体浅绿色
      ctx.fillRect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.gridSize - 1, // 留出1像素的间隔，使身体节点分明
        this.gridSize - 1
      );
      
      // 为蛇头添加方向指示
      if (index === 0) {
        this.drawHeadDirection(ctx, segment);
      }
    });
  }

  drawHeadDirection(ctx, head) {
    const halfGrid = this.gridSize / 2;
    const quarterGrid = this.gridSize / 4;
    
    ctx.fillStyle = '#2E7D32'; // 更深的绿色
    
    // 根据方向绘制小三角形
    ctx.beginPath();
    switch (this.direction) {
      case 'RIGHT':
        ctx.moveTo(head.x * this.gridSize + this.gridSize - quarterGrid, head.y * this.gridSize + halfGrid);
        ctx.lineTo(head.x * this.gridSize + this.gridSize, head.y * this.gridSize + quarterGrid);
        ctx.lineTo(head.x * this.gridSize + this.gridSize, head.y * this.gridSize + this.gridSize - quarterGrid);
        break;
      case 'LEFT':
        ctx.moveTo(head.x * this.gridSize + quarterGrid, head.y * this.gridSize + halfGrid);
        ctx.lineTo(head.x * this.gridSize, head.y * this.gridSize + quarterGrid);
        ctx.lineTo(head.x * this.gridSize, head.y * this.gridSize + this.gridSize - quarterGrid);
        break;
      case 'UP':
        ctx.moveTo(head.x * this.gridSize + halfGrid, head.y * this.gridSize + quarterGrid);
        ctx.lineTo(head.x * this.gridSize + quarterGrid, head.y * this.gridSize);
        ctx.lineTo(head.x * this.gridSize + this.gridSize - quarterGrid, head.y * this.gridSize);
        break;
      case 'DOWN':
        ctx.moveTo(head.x * this.gridSize + halfGrid, head.y * this.gridSize + this.gridSize - quarterGrid);
        ctx.lineTo(head.x * this.gridSize + quarterGrid, head.y * this.gridSize + this.gridSize);
        ctx.lineTo(head.x * this.gridSize + this.gridSize - quarterGrid, head.y * this.gridSize + this.gridSize);
        break;
    }
    ctx.fill();
  }

  getHead() {
    return this.body[0];
  }

  getBody() {
    return this.body;
  }
} 