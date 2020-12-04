<template>
  <div class="test-wrapper">
    <div class="images-row-wrapper">
      <div class="assistor">
        <div class="mouth-wrapper images-wrapper">
          <el-image
            class="mouth-image"
            style="max-width: 150px; max-height: 150px"
            :src="require('@/assets/images/mouth.png')">
          </el-image>
          <el-image
            style="max-width: 150px; max-height: 150px;position: absolute;bottom: 10px"
            :src="require('@/assets/images/letter_a.png')">
          </el-image>
        </div>
      </div>
      <el-divider v-if="showOptions" direction="vertical"></el-divider>
      <el-row
        v-if="showOptions"
        class="all-options-wrapper">
        <div class="option-assistor first-option-assistor">
          <div
            v-if="showFirstOption"
            class="option-wrapper images-wrapper">
            <el-image
              @click="handleSelect(false)"
              class="first-option-image"
              :class="{ 'can-select': !playStatus && !selectRightAnswer }"
              style="width: 200px; height: 200px"
              :src="require('@/assets/images/egg.png')">
            </el-image>
            <el-image
              class="first-option-validity"
              style="width: 50px; height: 50px;position: absolute;bottom: 50px;opacity: 0"
              :src="require('@/assets/images/wrong.png')">
            </el-image>
          </div>
        </div>
        <div class="option-assistor second-option-assistor">
          <div
            v-if="showSecondOption"
            class="option-wrapper images-wrapper">
            <el-image
              @click="handleSelect(true)"
              class="second-option-image"
              :class="{ 'can-select': !playStatus && !selectRightAnswer }"
              style="width: 200px; height: 200px"
              :src="require('@/assets/images/hatch.png')">
            </el-image>
            <el-image
              class="second-option-validity"
              style="width: 50px; height: 50px;position: absolute;bottom: 50px;opacity: 0"
              :src="require('@/assets/images/right.png')">
            </el-image>
            <el-image
              class="second-option-background"
              style="width: 350px; height: 350px;position: absolute;bottom: 50px;opacity: 0;z-index: -1"
              :src="require('@/assets/images/wave_gif.gif')">
            </el-image>
          </div>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js'
import { Howl } from 'howler'
import intro1 from '@/assets/audios/intro1.m4a'
import soundA from '@/assets/audios/sound_a.m4a'
import intro3 from '@/assets/audios/intro3.m4a'
import egg from '@/assets/audios/egg.m4a'
import hatch from '@/assets/audios/hatch.m4a'
import dong from '@/assets/audios/dong.mp3'
import ding from '@/assets/audios/ding.mp3'
import { animePulse, animeMoveCenter, animeVanish, animeVisible } from '@/utils/utils'

export default {
  name: 'Test',
  data () {
    return {
      sound: null,
      wrongSound: null,
      rightSound: null,
      rightOptionSound: null,
      introList: [intro1, soundA, intro3],
      wordList: [soundA, egg, hatch],
      endList: [soundA, soundA, hatch, hatch],
      introPlayList: [],
      wordPlayList: [],
      endPlayList: [],
      playIndex: 0,
      showOptions: false,
      showFirstOption: false,
      showSecondOption: false,
      playStatus: false,
      selectRightAnswer: false
    }
  },
  beforeMount () {
    this.initIntroPlayList()
    this.initWrongSound()
    this.initRightSound()
    this.initRightOptionSound()
    window.onbeforeunload = () => {
      this.sound && this.sound.stop()
      this.rightOptionSound && this.rightOptionSound.stop()
    }
  },
  mounted () {
    this.playList()
  },
  methods: {
    initIntroPlayList () {
      const len = this.introList.length
      this.introList.forEach((item, index) => {
        const sound = new Howl({
          src: [item]
        })
        sound.once('end', () => {
          if (this.playIndex === len - 1) {
            this.onIntroEnd()
            return
          }
          this.playNext(this.introPlayList)
        })
        if (index === 1) {
          sound.once('play', () => {
            animePulse('.mouth-image')
          })
        }
        this.introPlayList.push({
          howl: sound
        })
      })
      this.sound = this.introPlayList[this.playIndex].howl
    },
    initWordPlayList () {
      const len = this.wordList.length
      this.wordList.forEach((item, index) => {
        const sound = new Howl({
          src: [item]
        })
        sound.on('end', () => {
          if (this.playIndex === 0) {
            this.showFirstOption = true
            this.playNext(this.wordPlayList)
            return
          }
          if (this.playIndex === 1) {
            this.showSecondOption = true
            this.playNext(this.wordPlayList)
            return
          }
          if (this.playIndex === len - 1) {
            this.onWordEnd()
          }
        })
        sound.on('play', () => {
          if (index === 0) {
            animePulse('.mouth-image')
            return
          }
          if (index === 1) {
            animePulse('.first-option-image')
            return
          }
          animePulse('.second-option-image')
        })
        this.wordPlayList.push({
          howl: sound
        })
      })
      this.sound = this.wordPlayList[this.playIndex].howl
    },
    initEndPlayList () {
      const len = this.endList.length
      this.endList.forEach((item, index) => {
        const sound = new Howl({
          src: [item]
        })
        sound.on('end', () => {
          if (this.playIndex === len - 1) {
            this.stopListPlay()
            return
          }
          this.playNext(this.endPlayList)
        })
        sound.on('play', () => {
          if (index === 0 || index === 1) {
            animePulse('.mouth-image')
            return
          }
          if (index === 2) {
            animeVisible('.second-option-background')
            return
          }
          if (index === 3) {
            animePulse('.second-option-image')
          }
        })
        this.endPlayList.push({
          howl: sound
        })
      })
      this.sound = this.endPlayList[this.playIndex].howl
    },
    onIntroEnd () {
      this.stopListPlay()
      anime({
        targets: '.assistor',
        left: '200px',
        duration: 500,
        easing: 'easeInOutQuad'
      }).finished.then(() => {
        this.showOptions = true
        this.initWordPlayList()
        this.playList()
      })
    },
    onWordEnd () {
      this.canSelect = true
      this.stopListPlay()
      this.sound = this.wordPlayList[this.playIndex].howl
    },
    playNext (playList) {
      this.playIndex += 1
      this.sound = playList[this.playIndex].howl
      this.playList()
    },
    initWrongSound () {
      const sound = new Howl({
        src: [dong]
      })
      sound.on('play', () => {
        animeVisible('.first-option-validity')
      })
      sound.on('end', () => {
        this.playList()
      })
      this.wrongSound = sound
    },
    initRightSound () {
      const sound = new Howl({
        src: [ding]
      })
      sound.once('play', () => {
        animeVisible('.second-option-validity')
        animeVanish('.first-option-image')
        animeMoveCenter('.second-option-assistor')
      })
      sound.once('end', () => {
        this.initEndPlayList()
        this.playList()
      })
      this.rightSound = sound
    },
    initRightOptionSound () {
      const sound = new Howl({
        src: [hatch]
      })
      sound.once('play', () => {
        animePulse('.second-option-image')
      })
      sound.once('end', () => {
        this.rightSound.play()
      })
      this.rightOptionSound = sound
    },
    handleSelect (validity) {
      if (this.playStatus || this.selectRightAnswer) {
        return
      }
      if (!validity) {
        this.wrongSound.play()
        return
      }
      this.selectRightAnswer = true
      this.rightOptionSound.play()
    },
    playList () {
      if (this.sound) {
        this.sound.play()
        this.playStatus = true
      }
    },
    stopListPlay () {
      if (this.sound) {
        this.sound.stop()
        this.playStatus = false
        this.playIndex = 0
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.test-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.images-row-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: relative;
  padding-left: 400px;
}
.all-options-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.option-wrapper {
  width: 50%;
}
.assistor {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 400px;
  left: 50%;
  top: 50%;
  margin: -200px 0 0 -200px;
}
.mouth-wrapper {
  overflow: auto;
}
.images-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.option-wrapper {
  margin-top: -30px;
  width: 100%;
  overflow: auto;
}
.option-assistor {
  position: relative;
  width: 50%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
>>> .el-divider {
  height: 100%;
}
.can-select {
  cursor: pointer;
}
</style>
