export class SoundManager {
  constructor() {
    // 音效状态
    this.enabled = true;
    
    // 创建单个音频实例
    this.sounds = {
      move: new Audio('/sounds/move.wav'),
      eat: new Audio('/sounds/eat.wav'),
      gameOver: new Audio('/sounds/gameover.wav'),
      background: new Audio('/sounds/background.mp3')
    };

    // 配置背景音乐
    this.sounds.background.loop = true;
    this.sounds.background.volume = 0.3;

    // 配置音效音量
    this.sounds.move.volume = 0.2;
    this.sounds.eat.volume = 0.4;
    this.sounds.gameOver.volume = 0.5;
  }

  // 播放指定音效
  play(soundName) {
    if (!this.enabled) return;

    const sound = this.sounds[soundName];
    if (sound) {
      try {
        // 对于移动音效，需要重置播放位置
        if (soundName === 'move') {
          sound.currentTime = 0;
        }
        
        // 使用 Promise 处理音频播放
        const playPromise = sound.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log(`音效播放失败: ${soundName}`, error);
          });
        }
      } catch (error) {
        console.log(`音效播放错误: ${soundName}`, error);
      }
    }
  }

  // 停止指定音效
  stop(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      try {
        sound.pause();
        sound.currentTime = 0;
      } catch (error) {
        console.log(`停止音效失败: ${soundName}`, error);
      }
    }
  }

  // 开始播放背景音乐
  startBackgroundMusic() {
    if (this.enabled) {
      try {
        const playPromise = this.sounds.background.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('背景音乐播放失败:', error);
          });
        }
      } catch (error) {
        console.log('背景音乐播放错误:', error);
      }
    }
  }

  // 停止背景音乐
  stopBackgroundMusic() {
    try {
      this.sounds.background.pause();
      this.sounds.background.currentTime = 0;
    } catch (error) {
      console.log('停止背景音乐失败:', error);
    }
  }

  // 切换音效开关
  toggleSound() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      // 停止所有音效
      Object.values(this.sounds).forEach(sound => {
        try {
          sound.pause();
          sound.currentTime = 0;
        } catch (error) {
          console.log('停止音效失败:', error);
        }
      });
    }
    return this.enabled;
  }
} 