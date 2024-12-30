(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))e(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&e(r)}).observe(document,{childList:!0,subtree:!0});function i(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function e(s){if(s.ep)return;s.ep=!0;const o=i(s);fetch(s.href,o)}})();class a{constructor(t,i,e){this.cols=t,this.rows=i,this.gridSize=e,this.init(),this.direction="RIGHT",this.nextDirection="RIGHT",this.directionMap={UP:{x:0,y:-1},DOWN:{x:0,y:1},LEFT:{x:-1,y:0},RIGHT:{x:1,y:0}}}init(){const t=Math.floor(this.cols/2),i=Math.floor(this.rows/2);this.body=[{x:t,y:i},{x:t-1,y:i},{x:t-2,y:i}]}move(){this.direction=this.nextDirection;const t=this.directionMap[this.direction],i={x:(this.body[0].x+t.x+this.cols)%this.cols,y:(this.body[0].y+t.y+this.rows)%this.rows};return this.body.unshift(i),this.body.pop()}grow(){const t=this.body[this.body.length-1];this.body.push({...t})}setDirection(t){({UP:"DOWN",DOWN:"UP",LEFT:"RIGHT",RIGHT:"LEFT"})[this.direction]!==t&&(this.nextDirection=t)}checkCollision(){const t=this.body[0];for(let i=1;i<this.body.length;i++)if(t.x===this.body[i].x&&t.y===this.body[i].y)return!0;return!1}draw(t){this.body.forEach((i,e)=>{t.fillStyle=e===0?"#4CAF50":"#81C784",t.fillRect(i.x*this.gridSize,i.y*this.gridSize,this.gridSize-1,this.gridSize-1),e===0&&this.drawHeadDirection(t,i)})}drawHeadDirection(t,i){const e=this.gridSize/2,s=this.gridSize/4;switch(t.fillStyle="#2E7D32",t.beginPath(),this.direction){case"RIGHT":t.moveTo(i.x*this.gridSize+this.gridSize-s,i.y*this.gridSize+e),t.lineTo(i.x*this.gridSize+this.gridSize,i.y*this.gridSize+s),t.lineTo(i.x*this.gridSize+this.gridSize,i.y*this.gridSize+this.gridSize-s);break;case"LEFT":t.moveTo(i.x*this.gridSize+s,i.y*this.gridSize+e),t.lineTo(i.x*this.gridSize,i.y*this.gridSize+s),t.lineTo(i.x*this.gridSize,i.y*this.gridSize+this.gridSize-s);break;case"UP":t.moveTo(i.x*this.gridSize+e,i.y*this.gridSize+s),t.lineTo(i.x*this.gridSize+s,i.y*this.gridSize),t.lineTo(i.x*this.gridSize+this.gridSize-s,i.y*this.gridSize);break;case"DOWN":t.moveTo(i.x*this.gridSize+e,i.y*this.gridSize+this.gridSize-s),t.lineTo(i.x*this.gridSize+s,i.y*this.gridSize+this.gridSize),t.lineTo(i.x*this.gridSize+this.gridSize-s,i.y*this.gridSize+this.gridSize);break}t.fill()}getHead(){return this.body[0]}getBody(){return this.body}}class c{constructor(t,i,e){this.cols=t,this.rows=i,this.gridSize=e,this.position={x:0,y:0},this.types={NORMAL:{color:"#FF5722",points:10,probability:.7,effect:null},GOLDEN:{color:"#FFD700",points:30,probability:.15,effect:"doublePoints"},SPEED:{color:"#00FF00",points:20,probability:.1,effect:"speedUp"},SLOW:{color:"#4169E1",points:20,probability:.05,effect:"slowDown"}},this.currentType=this.types.NORMAL,this.effectDuration=5e3}generate(t){let i;do i={x:Math.floor(Math.random()*this.cols),y:Math.floor(Math.random()*this.rows)};while(this.checkCollisionWithSnake(i,t));this.position=i;const e=Math.random();let s=0;for(const o of Object.values(this.types))if(s+=o.probability,e<=s){this.currentType=o;break}}draw(t){const i=this.position.x*this.gridSize,e=this.position.y*this.gridSize,o=(this.gridSize-2)/2;if(t.save(),t.fillStyle=this.currentType.color,t.beginPath(),t.arc(i+this.gridSize/2,e+this.gridSize/2,o-2,0,Math.PI*2),t.fill(),this.currentType!==this.types.NORMAL){const r=t.createRadialGradient(i+o,e+o,o/3,i+o,e+o,o*1.2);r.addColorStop(0,"rgba(255, 255, 255, 0.4)"),r.addColorStop(1,"rgba(255, 255, 255, 0)"),t.fillStyle=r,t.fill();const n=Math.sin(Date.now()/200)*2+4;t.beginPath(),t.arc(i+this.gridSize/2,e+this.gridSize/2,o+n,0,Math.PI*2),t.strokeStyle=this.currentType.color,t.lineWidth=1,t.stroke()}t.restore()}getEffect(){return{points:this.currentType.points,effect:this.currentType.effect,duration:this.effectDuration}}isEaten(t){return t.x===this.position.x&&t.y===this.position.y}checkCollisionWithSnake(t,i){return i.some(e=>e.x===t.x&&e.y===t.y)}}class d{constructor(){this.enabled=!0,this.initialized=!1,this.sounds={}}init(){if(!this.initialized)try{const t=window.AudioContext||window.webkitAudioContext;this.audioContext=new t,this.sounds={background:new Audio("/snake-game/sounds/background.mp3"),eat:new Audio("/snake-game/sounds/eat.wav"),move:new Audio("/snake-game/sounds/move.wav"),gameover:new Audio("/snake-game/sounds/gameover.wav")},this.initialized=!0}catch(t){console.log("音频初始化失败:",t)}}play(t){if(!this.enabled)return;const i=this.sounds[t];if(i)try{t==="move"&&(i.currentTime=0);const e=i.play();e!==void 0&&e.catch(s=>{console.log(`音效播放失败: ${t}`,s)})}catch(e){console.log(`音效播放错误: ${t}`,e)}}stop(t){const i=this.sounds[t];if(i)try{i.pause(),i.currentTime=0}catch(e){console.log(`停止音效失败: ${t}`,e)}}startBackgroundMusic(){if(this.enabled)try{const t=this.sounds.background.play();t!==void 0&&t.catch(i=>{console.log("背景音乐播放失败:",i)})}catch(t){console.log("背景音乐播放错误:",t)}}stopBackgroundMusic(){try{this.sounds.background.pause(),this.sounds.background.currentTime=0}catch(t){console.log("停止背景音乐失败:",t)}}toggleSound(){return this.enabled=!this.enabled,this.enabled||Object.values(this.sounds).forEach(t=>{try{t.pause(),t.currentTime=0}catch(i){console.log("停止音效失败:",i)}}),this.enabled}}class l{constructor(t){this.canvas=document.getElementById(t),this.ctx=this.canvas.getContext("2d"),this.canvas.width=800,this.canvas.height=600,this.gridSize=20,this.cols=this.canvas.width/this.gridSize,this.rows=this.canvas.height/this.gridSize,this.gameState="INIT",this.score=0,this.highScore=parseInt(localStorage.getItem("highScore"))||0,this.initialSpeed=300,this.currentSpeed=this.initialSpeed,this.minSpeed=100,this.lastUpdateTime=0,this.snake=new a(this.cols,this.rows,this.gridSize),this.food=new c(this.cols,this.rows,this.gridSize),this.soundManager=new d,this.handleKeyPress=this.handleKeyPress.bind(this),this.gameLoop=this.gameLoop.bind(this),window.addEventListener("keydown",this.handleKeyPress),this.createSoundButton(),this.drawStartScreen(),console.log("Game initialized with state:",this.gameState),this.effects={doublePoints:!1,speedUp:!1,slowDown:!1},this.effectTimers={},document.addEventListener("click",()=>{this.soundManager.init()},{once:!0})}handleKeyPress(t){switch(console.log("Key pressed:",t.key,"Current state:",this.gameState),t.key){case" ":t.preventDefault(),this.gameState==="INIT"?(console.log("Starting game from INIT state"),this.start()):this.gameState==="PLAYING"?(console.log("Pausing game"),this.pause()):this.gameState==="PAUSED"?(console.log("Resuming game"),this.resume()):this.gameState==="GAME_OVER"&&(console.log("Restarting game"),this.start());break;case"q":case"Q":this.toggleBackgroundMusic();break;case"ArrowUp":this.gameState==="PLAYING"&&this.snake.setDirection("UP");break;case"ArrowDown":this.gameState==="PLAYING"&&this.snake.setDirection("DOWN");break;case"ArrowLeft":this.gameState==="PLAYING"&&this.snake.setDirection("LEFT");break;case"ArrowRight":this.gameState==="PLAYING"&&this.snake.setDirection("RIGHT");break}}toggleBackgroundMusic(){this.soundManager.sounds.background.paused?this.soundManager.startBackgroundMusic():this.soundManager.stopBackgroundMusic()}start(){console.log("Start method called"),this.gameState="PLAYING",this.score=0,this.currentSpeed=this.initialSpeed,this.snake=new a(this.cols,this.rows,this.gridSize),this.food.generate(this.snake.getBody()),this.lastUpdateTime=performance.now(),console.log("Starting game loop"),requestAnimationFrame(t=>{this.lastUpdateTime=t,this.gameLoop(t)})}pause(){this.gameState==="PLAYING"&&(this.gameState="PAUSED")}resume(){this.gameState==="PAUSED"&&(this.gameState="PLAYING",this.lastUpdateTime=performance.now(),requestAnimationFrame(this.gameLoop.bind(this)))}gameLoop(t){if(console.log("Game loop running, state:",this.gameState),this.gameState!=="PLAYING"){console.log("Game loop stopped, state:",this.gameState);return}requestAnimationFrame(e=>this.gameLoop(e)),!(t-this.lastUpdateTime<this.currentSpeed)&&(this.lastUpdateTime=t,this.update(),this.draw())}update(){if(this.snake.getHead(),this.snake.move(),this.food.isEaten(this.snake.getHead())){this.soundManager.play("eat"),this.snake.grow();const t=this.food.getEffect();this.score+=this.effects.doublePoints?t.points*2:t.points,t.effect&&this.applyEffect(t.effect,t.duration),this.food.generate(this.snake.getBody()),this.updateSpeed()}this.snake.checkCollision()&&(this.soundManager.play("gameOver"),this.soundManager.stopBackgroundMusic(),this.gameOver())}draw(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawGrid(),this.food.draw(this.ctx),this.snake.draw(this.ctx),this.updateScore(),this.gameState==="PAUSED"&&this.drawPauseScreen()}drawStartScreen(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawGrid(),this.ctx.fillStyle="#333",this.ctx.font="30px Arial",this.ctx.textAlign="center",this.ctx.fillText("按空格键开始游戏",this.canvas.width/2,this.canvas.height/2),this.ctx.font="20px Arial",this.ctx.fillText("按 Q 键开启/关闭背景音乐",this.canvas.width/2,this.canvas.height/2+40)}drawPauseScreen(){this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="#fff",this.ctx.font="30px Arial",this.ctx.textAlign="center",this.ctx.fillText("游戏暂停",this.canvas.width/2,this.canvas.height/2),this.ctx.fillText("按空格键继续",this.canvas.width/2,this.canvas.height/2+40)}gameOver(){this.gameState="GAME_OVER",this.score>this.highScore&&(this.highScore=this.score,localStorage.setItem("highScore",this.highScore)),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="#fff",this.ctx.font="30px Arial",this.ctx.textAlign="center",this.ctx.fillText("游戏结束",this.canvas.width/2,this.canvas.height/2-40),this.ctx.fillText(`最终得分: ${this.score}`,this.canvas.width/2,this.canvas.height/2),this.ctx.fillText("按空格键重新开始",this.canvas.width/2,this.canvas.height/2+40)}drawGrid(){this.ctx.strokeStyle="#E0E0E0",this.ctx.lineWidth=.5;for(let t=0;t<=this.canvas.width;t+=this.gridSize)this.ctx.beginPath(),this.ctx.moveTo(t,0),this.ctx.lineTo(t,this.canvas.height),this.ctx.stroke();for(let t=0;t<=this.canvas.height;t+=this.gridSize)this.ctx.beginPath(),this.ctx.moveTo(0,t),this.ctx.lineTo(this.canvas.width,t),this.ctx.stroke()}updateSpeed(){const t=Math.floor(this.score/40),i=this.initialSpeed*Math.pow(.9,t);this.currentSpeed=Math.max(i,this.minSpeed)}updateScore(){const t=document.getElementById("score"),i=document.getElementById("highScore");let e=`分数: ${this.score}`;this.effects.doublePoints&&(e+=" (双倍分数!)"),this.effects.speedUp&&(e+=" (加速!)"),this.effects.slowDown&&(e+=" (减速!)"),t&&(t.textContent=e),i&&(i.textContent=`最高分: ${this.highScore}`)}createSoundButton(){const t=document.createElement("button");t.innerHTML="🔊",t.className="sound-button",t.onclick=()=>{const i=this.soundManager.toggleSound();t.innerHTML=i?"🔊":"🔈"},document.getElementById("gameInfo").appendChild(t)}applyEffect(t,i){switch(this.effectTimers[t]&&clearTimeout(this.effectTimers[t]),t){case"doublePoints":this.effects.doublePoints=!0;break;case"speedUp":this.effects.speedUp=!0,this.currentSpeed=Math.max(this.currentSpeed*.7,this.minSpeed);break;case"slowDown":this.effects.slowDown=!0,this.currentSpeed=this.currentSpeed*1.3;break}this.effectTimers[t]=setTimeout(()=>{switch(t){case"doublePoints":this.effects.doublePoints=!1;break;case"speedUp":this.effects.speedUp=!1,this.updateSpeed();break;case"slowDown":this.effects.slowDown=!1,this.updateSpeed();break}},i)}}document.querySelector("#app").innerHTML=`
  <div class="game-container">
    <canvas id="gameCanvas"></canvas>
    <div id="gameInfo">
      <div id="score">分数: 0</div>
      <div id="highScore">最高分: 0</div>
    </div>
  </div>
`;new l("gameCanvas");
