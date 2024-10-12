export function helper(){
    let avatarId = 'Binx Bond'
fetch('https://api.multiavatar.com/'+JSON.stringify(avatarId))
  .then(res => res.text())
  .then(svg => console.log(svg))


}