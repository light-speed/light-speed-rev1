export function HUDalert(points) {
  const alert = document.getElementById('HUDalert')
  alert.style.visibility = 'visible'
  alert.innerHTML = `${points}`
  setTimeout(() => {
    alert.innerHTML = ''
  }, 1000)
}
