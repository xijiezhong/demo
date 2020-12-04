import anime from 'animejs'

export const animePulse = (selector) => {
  anime({
    targets: selector,
    opacity: 0.5,
    width: '+=20px',
    height: '+=20px',
    direction: 'alternate',
    duration: 1000,
    easing: 'easeInOutQuad'
  })
}

export const animeVisible = (selector) => {
  anime({
    targets: selector,
    opacity: 1,
    direction: 'alternate',
    duration: 600,
    easing: 'easeInOutQuad'
  })
}

export const animeVanish = (selector) => {
  anime({
    targets: selector,
    opacity: 0,
    duration: 600,
    easing: 'easeInOutQuad'
  })
}

export const animeMoveCenter = (selector) => {
  anime({
    targets: selector,
    marginLeft: '-25%',
    duration: 800,
    delay: 1200,
    easing: 'easeInOutQuad'
  })
}
