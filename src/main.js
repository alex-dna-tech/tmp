import './styles/styles.scss'
import Typed from 'typed.js'

const load = () => {
  const typedText = new Typed('#printer', {
    stringsElement: '#printer-strings',
    typeSpeed: 0,
    backDelay: 1000,
    fadeOut: true,
    fadeOutDelay: 0,
    loop: true,
    showCursor: true,
    cursorChar: '&nbsp;#',
    preStringTyped: (pos, self) => {
      console.log(pos)
      if (pos > 1) {
        self.typeSpeed = 20
        self.fadeOut = false
      } else if (pos == 2) {
        self.fadeOut = true
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', load)
