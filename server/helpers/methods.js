function picMethod () {
  let num = Math.floor(Math.random() * 6) + 1
  let method
  switch (num) {
    case 1:
      method= 'characterCount = (str, char) => str.split(char).length - 1'
      break;
    case 2:
      method= 'average = (arr) => arr.reduce((a, b) => a + b) / arr.length'
      break;
    case 3:
      method= 'getRandomBoolean = () => Math.random() >= 0.5'
      break;
    case 4:
      method= 'getSelectedText = () => window.getSelection().toString()'
      break;
    case 5:
      method= 'shuffle = arr => arr.sort(() => 0.5 - Math.random())'
      break;
    case 6:
      method= 'insertHTMLAfter = (html, el) => el.insertAdjacentHTML("afterend", html)'
      break;
    default:
      break;
  }
  return method
}
// const characterCount = (str, char) => str.split(char).length - 1
// const average = (arr) => arr.reduce((a, b) => a + b) / arr.length
// const getRandomBoolean = () => Math.random() >= 0.5
// const getSelectedText = () => window.getSelection().toString()
// const shuffle = arr => arr.sort(() => 0.5 - Math.random())
// const insertHTMLAfter = (html, el) => el.insertAdjacentHTML('afterend', html)
// const touchSupported = () => ('ontouchstart' in window || DocumentTouch && document instanceof DocumentTouch)
// const redirect = url => location.href = url
// const daysBetween = (date1, date2) => Math.ceil(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24))
// const wait = async (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
// const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object

module.exports = { picMethod }