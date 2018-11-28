export function HUDalert(color) {
  const hud = document.getElementById('hudColor')
  if (color === 'red') {
    hud.src = './images/red.png'
  }
  if (color === 'green') {
    return '/images/greenHud.png'
  } else {
    return '/images/hud.png'
  }
}
