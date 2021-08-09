import './styles/styles.scss'
import Typed from 'typed.js'

const load = () => {
  const strings = new Typed('#printer-strings', {
    stringsElement: '#strings',
    startDelay: 2000,
    smartBackspace: true,
    typeSpeed: 30,
    backDelay: 1000,
    loop: true,
    showCursor: true,
    cursorChar: '&nbsp;#'
  })
}

document.addEventListener('DOMContentLoaded', load)
