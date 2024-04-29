
const debugEl = document.getElementById('debug'),
      iconMap = ["Банан", "Семёрка", "Вишня", "Слива", "Апельсин", "Колокольчик", "Бар", "Лимон", "Арбуз"],
      icon_width = 79,
      icon_height = 79,
      num_icons = 9,
      time_per_icon = 100,
      
      indexes = [0, 0, 0, 0];


const roll = (reel, offset = 0) => {
  const delta = (offset + 3) * num_icons + Math.round(Math.random() * num_icons);
  return new Promise((resolve, reject) => {

    const style = getComputedStyle(reel),
      backgroundPositionY = parseFloat(style["background-position-y"]),
      targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
      normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height);

    
    setTimeout(() => {
      
      reel.style.transition = `background-position-y ${(8 + 1 * delta) * time_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
      
      reel.style.backgroundPositionY = `${backgroundPositionY + delta * icon_height}px`;
    }, offset * 150);

    
    setTimeout(() => {
      
      reel.style.transition = `none`;
      reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
      
      resolve(delta % num_icons);
    }, (8 + 1 * delta) * time_per_icon + offset * 150);

  });
};


document.getElementById("myBtn").onclick = function () {

  this.disabled = true;
  debugEl.textContent = 'Крутится...';

  const reelsList = document.querySelectorAll('.slots > .reel');

  Promise

    
    .all([...reelsList].map((reel, i) => roll(reel, i)))

    
    .then((deltas) => {
      // add up indexes
      deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta) % num_icons);
      debugEl.textContent = indexes.map((i) => iconMap[i]).join(' - ');

      
      if (indexes[0] == indexes[1]|| indexes[1] == indexes[2]|| indexes[2] == indexes[3]) {
        const winCls = indexes[0] == indexes[2] ? "win2" : "win1";
        document.querySelector(".slots").classList.add(winCls);
        setTimeout(() => document.querySelector(".slots").classList.remove(winCls), 2000)
      }

    
      setTimeout(() => {
        this.disabled = false;
      },100);
    });
};


