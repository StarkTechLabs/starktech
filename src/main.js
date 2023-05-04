
const registerScrollControl = () => {
  const parallax = document.querySelector('.parallax-container')
  parallax.addEventListener('scroll', () => {
    const ele = document.querySelector('.scroll-indicator')
    if (ele && ele.style) {
      ele.style.opacity = 1 - parallax.scrollTop / 75
    }
  })
}

const registerSectionScrollFade = () => {
  const parallax = document.querySelector('.parallax-container')
  let positionTop = 0
  for (const sec of parallax.children) {
    const { positionTop: current } = Object.assign({}, { positionTop }) // copy value
    positionTop += sec.clientHeight
    // console.log('section scroll listener', sec.id)
    parallax.addEventListener('scroll', () => {
      const offsetModify = window.innerHeight > 100 ? 150 : 250
      sec.style.opacity = 1 - (parallax.scrollTop - current + offsetModify) / (window.innerHeight * 0.1)
    })
  }
}

registerScrollControl()
registerSectionScrollFade()

// window.addEventListener('resize', () => {
//   const parallax = document.querySelector('.parallax-container')
//   parallax.removeEventListener('scroll')
//   registerScrollControl()
//   registerSectionScrollFade()
// })
