import './svg/'
import './styles/styles.scss'

///////////////////////////////////////////////////////////////////////////////
// MAIN
///////////////////////////////////////////////////////////////////////////////
import Typed from 'typed.js'
const load = () => {
  // var typed = new Typed('.typed', {
  //   strings: ['First sentence.', 'Second sentence.'],
  //   typeSpeed: 30
  // })
  var typed2 = new Typed('#printer', {
    stringsElement: '#printer-string',
    typeSpeed: 0,
    backSpeed: 0,
    fadeOut: true,
    fadeOutDelay: 0,

    // backDelay: 5000,
    showCursor: true,
    loop: true
  })
}

document.addEventListener('DOMContentLoaded', load)
