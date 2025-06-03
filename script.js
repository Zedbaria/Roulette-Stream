window.addEventListener("DOMContentLoaded", () => {
  const rarityWeights = {
    common: 80,
    uncommon: 15,
    rare: 4,
    legendary: 1
  };

  const actions = [
    { text: "Boire de l'eau", rarity: "common" },
    { text: "Faire 15 pompes", rarity: "common" },
    { text: "Musique au choix", rarity: "common" },
    { text: "Danser", rarity: "uncommon" },
    { text: "Imitation", rarity: "uncommon" },
    { text: "Offrir un sub", rarity: "rare" },
    { text: "Mettre VIP", rarity: "rare" },
    { text: "Ban 1j", rarity: "rare" },
    { text: "Offrir un skin", rarity: "legendary" }
  ];

  const roulette = document.getElementById("roulette");
  const popup = document.getElementById("popupResult");
  const drumroll = document.getElementById("drumroll");
  const ding = document.getElementById("ding");
  let rouletteRunning = false;

  function getWeightedItem() {
    const pool = [];
    actions.forEach(action => {
      const weight = rarityWeights[action.rarity];
      for (let i = 0; i < weight; i++) {
        pool.push(action);
      }
    });
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function createRollItems(totalItems = 25, centerIndex = 12) {
    roulette.innerHTML = "";
    const result = getWeightedItem();
    let lastText = "";

    for (let i = 0; i < totalItems; i++) {
      let item;
      if (i === centerIndex) {
        item = result;
      } else {
        let tries = 0;
        do {
          item = getWeightedItem();
          tries++;
        } while ((item.text === result.text || item.text === lastText) && tries < 10);
      }
      lastText = item.text;

      const span = document.createElement("span");
      span.textContent = item.text;
      span.classList.add(`rarity-${item.rarity}`);
      if (item.rarity === "rare" || item.rarity === "legendary") {
        span.classList.add("glow");
      }
      roulette.appendChild(span);
    }

    return centerIndex;
  }

  function roll() {
    if (rouletteRunning) return;
    rouletteRunning = true;

    popup.classList.add("hidden");
    roulette.style.transition = "none";
    roulette.style.transform = "translateX(0px)";

    const itemWidth = 130;
    const totalItems = 25;
    const stopIndex = Math.floor(10 + Math.random() * 5);

    createRollItems(totalItems, stopIndex);
    void roulette.offsetWidth;

    const innerOffset = Math.floor(itemWidth * (0.1 + Math.random() * 0.8));
    const distance = stopIndex * itemWidth + innerOffset;
    const duration = 4000;

    try {
      drumroll.pause();
      drumroll.currentTime = 0;
      drumroll.play().catch(() => {});
    } catch (e) {}

    roulette.style.transition = `transform ${duration}ms cubic-bezier(0.15, 0.85, 0.25, 1)`;
    roulette.style.transform = `translateX(-${distance}px)`;

    setTimeout(() => {
      try {
        drumroll.pause();
        ding.pause();
        ding.currentTime = 0;
        ding.play().catch(() => {});
      } catch (e) {}

      const containerRect = document.querySelector(".roulette-container").getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;

      let closestSpan = null;
      let closestDistance = Infinity;

      Array.from(roulette.children).forEach(span => {
        const spanRect = span.getBoundingClientRect();
        const spanCenter = spanRect.left + spanRect.width / 2;
        const distance = Math.abs(spanCenter - centerX);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSpan = span;
        }
      });

      if (closestSpan) {
        popup.textContent = `🎉 ${closestSpan.textContent.trim()}`;
        popup.classList.remove("hidden");

        // 🎊 Affiche le texte dans la popup
popup.textContent = `🎉 ${closestSpan.textContent.trim()}`;
popup.classList.remove("hidden");

// 🎊 Confettis
confetti({
  particleCount: 80,
  spread: 90,
  origin: { y: 0.4 }
});
setTimeout(() => {
  confetti({
    particleCount: 60,
    spread: 120,
    origin: { y: 0.6 }
  });
}, 150);

// ⏳ Masquer la popup après 3 secondes avec fade out
setTimeout(() => {
  popup.classList.add("fadeout");
}, 3000);

// 💡 Réinitialiser la classe pour les futurs tirages
setTimeout(() => {
  popup.classList.add("hidden");
  popup.classList.remove("fadeout");
}, 4000);
      }

      rouletteRunning = false;
    }, duration + 50);
  }

  roll(); // 🚀 Lancement automatique
});
