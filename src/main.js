import './styles/styles.scss'
import Typed from 'typed.js'

const load = () => {
  if (window.innerWidth > 380) {
    const intro = new Typed('#printer-intro', {
      stringsElement: '#intro',
      typeSpeed: 0,
      fadeOut: true,
      fadeOutDelay: 20,
      loop: false,
      showCursor: false,
      cursorChar: ''
    })
  }

  const strings = new Typed('#printer-strings', {
    stringsElement: '#strings',
    startDelay: 2000,
    smartBackspace: true,
    typeSpeed: 0,
    backDelay: 1000,
    loop: true,
    showCursor: true,
    cursorChar: '&nbsp;#'
  })
}

document.addEventListener('DOMContentLoaded', load)
