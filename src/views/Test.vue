<template>
  <div class="test-wrapper">
    <div v-show="showStartBtn">
      <el-button
        @click="startTest"
        type="primary"
        round>
        开始测试
      </el-button>
    </div>
    <div v-show="!showStartBtn" class="images-row-wrapper">
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
              @click="handleSelect(options[0].validity)"
              class="first-option-image"
              :class="{ 'can-select': !playStatus && !selectRightAnswer }"
              style="width: 200px; height: 200px"
              :src="options[0].src">
            </el-image>
            <el-image
              class="first-option-validity"
              style="width: 50px; height: 50px;position: absolute;bottom: 50px;opacity: 0"
              :src="options[0].validSrc">
            </el-image>
            <el-image
              v-if="options[0].validity"
              class="option-background"
              style="width: 350px; height: 350px;position: absolute;bottom: 50px;opacity: 0;z-index: -1"
              :src="options[0].backgroundSrc">
            </el-image>
          </div>
        </div>
        <div class="option-assistor second-option-assistor">
          <div
            v-if="showSecondOption"
            class="option-wrapper images-wrapper">
            <el-image
              @click="handleSelect(options[1].validity)"
              class="second-option-image"
              :class="{ 'can-select': !playStatus && !selectRightAnswer }"
              style="width: 200px; height: 200px"
              :src="options[1].src">
            </el-image>
            <el-image
              class="second-option-validity"
              style="width: 50px; height: 50px;position: absolute;bottom: 50px;opacity: 0"
              :src="options[1].validSrc">
            </el-image>
            <el-image
              v-if="options[1].validity"
              class="option-background"
              style="width: 350px; height: 350px;position: absolute;bottom: 50px;opacity: 0;z-index: -1"
              :src="options[0].backgroundSrc">
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
      selectRightAnswer: false,
      showStartBtn: true,
      options: []
    }
  },
  beforeMount () {
    this.randomOptions()
    this.initIntroPlayList()
    this.initWrongSound()
    this.initRightSound()
    this.initRightOptionSound()
    window.onbeforeunload = () => {
      this.stopAllPlay()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.stopAllPlay()
    next()
  },
  methods: {
    startTest () {
      this.showStartBtn = false
      this.playList()
    },
    randomOptions () {
      this.options = [
        {
          src: require('@/assets/images/egg.png'),
          validSrc: require('@/assets/images/wrong.png'),
          validity: false
        },
        {
          src: require('@/assets/images/hatch.png'),
          validSrc: require('@/assets/images/right.png'),
          backgroundSrc: require('@/assets/images/wave_gif.gif'),
          validity: true
        }
      ]
      const randomNumber = Math.random()
      if (randomNumber > 0.5) {
        this.options.reverse()
        this.wordList = [soundA, hatch, egg]
      }
    },
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
            animeVisible('.option-background')
            return
          }
          if (index === 3) {
            const selector = this.options[0].validity ? '.first-option-image' : '.second-option-image'
            animePulse(selector)
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
        const selector = this.options[0].validity ? '.second-option-validity' : '.first-option-validity'
        animeVisible(selector)
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
        const selector = this.options[0].validity ? {
          visible: '.first-option-validity',
          vanish: '.second-option-image',
          moveCenter: '.first-option-assistor'
        } : {
          visible: '.second-option-validity',
          vanish: '.first-option-image',
          moveCenter: '.second-option-assistor'
        }
        const isLeft = !this.options[0].validity
        animeVisible(selector.visible)
        animeVanish(selector.vanish)
        animeMoveCenter(selector.moveCenter, isLeft)
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
        const selector = this.options[0].validity ? '.first-option-image' : '.second-option-image'
        animePulse(selector)
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
    },
    stopAllPlay () {
      this.sound && this.sound.stop()
      this.rightOptionSound && this.rightOptionSound.stop()
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
  padding-left: 350px;
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
  min-width: 350px;
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
