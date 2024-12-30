export class SoundManager {
  constructor() {
    this.enabled = true;
    this.initialized = false;
    this.sounds = {};
  }

  init() {
    if (this.initialized) return;
    
    try {
      // 初始化音频上下文
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      
      // 初始化音效
      this.sounds = {
        background: new Audio('/snake-game/sounds/background.mp3'),
        eat: new Audio('/snake-game/sounds/eat.wav'),
        move: new Audio('/snake-game/sounds/move.wav'),
        gameover: new Audio('/snake-game/sounds/gameover.wav')
      };
      
      this.initialized = true;
    } catch (error) {
      console.log('音频初始化失败:', error);
    }
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