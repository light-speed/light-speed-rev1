export const showInstructions = isPaused => {
  const blocker = document.getElementById('blocker')
  blocker.style.visibility = 'visible'
  if (isPaused) {
    blocker.style.display = 'block'
    blocker.style.zIndex = '99'
  } else {
    blocker.style.display = 'none'
    blocker.style.zIndex = ''
  }
}
