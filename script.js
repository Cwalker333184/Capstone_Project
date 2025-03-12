document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const elements = {
      spinButton: document.getElementById("spinButton"),
      choreDisplay: document.getElementById("choreDisplay"),
      totalPoints: document.getElementById("totalPoints"),
      progressBar: document.getElementById("progressBar"),
      addChoreButton: document.getElementById("addChoreButton"),
      customChoreInput: document.getElementById("customChoreInput"),
      customChoreCategory: document.getElementById("customChoreCategory"),
      choreTable: document.querySelector("#choreTable tbody"),
      addRewardButton: document.getElementById("addRewardButton"),
      rewardName: document.getElementById("rewardName"),
      rewardPoints: document.getElementById("rewardPoints"),
      rewardList: document.getElementById("rewardList"),
      rewardDropdown: document.getElementById("rewardDropdown"),
      redeemButton: document.getElementById("redeemButton"),
      redeemStatus: document.getElementById("redeemStatus"),
      toggleModeButton: document.getElementById("toggleModeButton"),
      bgColorInput: document.getElementById("bg-color"),
      bgImageInput: document.getElementById("bg-image"),
      resetButton: document.getElementById("resetButton"),
      timerInput: document.getElementById("timerInput"), // Ensure you have an input for timer duration
  };

  let points = 0;

  // Chore List
  const chores = [
      "Sweep the floor", "Wash the dishes", "Take out the trash", "Water the plants",
      "Clean your room", "Vacuum the house", "Do the laundry", "Dust the furniture",
      "Mop the floor", "Organize the closet"
  ];

  // Get a random chore
  function getRandomChore() {
      if (chores.length > 0) {
          const randomChore = chores[Math.floor(Math.random() * chores.length)];
          elements.choreDisplay.textContent = `Your chore: ${randomChore}`;
          addChoreToTable(randomChore, "General");
      } else {
          elements.choreDisplay.textContent = "No chores available!";
      }
  }

  // Add a chore to the table
  function addChoreToTable(task, category) {
      if (!task || !category) return;

      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${task}</td>
          <td>${category}</td>
          <td><button class="btn btn-info startTimer">Start Timer</button></td>
          <td><button class="btn btn-success completeChore">Complete</button></td>
          <td><button class="btn btn-danger deleteChore">Delete</button></td>
      `;
      elements.choreTable.appendChild(row);
  }

  // Event Listener: Spin button for random chore
  elements.spinButton.addEventListener("click", getRandomChore);

  // Event Listener: Add custom chore
  elements.addChoreButton.addEventListener("click", function () {
      const task = elements.customChoreInput.value.trim();
      const category = elements.customChoreCategory.value.trim();

      if (task && category) {
          addChoreToTable(task, category);
          elements.customChoreInput.value = "";
          elements.customChoreCategory.value = "";
      }
  });

  // Handle table button actions using event delegation
  elements.choreTable.addEventListener("click", function (event) {
      const button = event.target;
      const row = button.closest("tr");

      if (button.classList.contains("completeChore")) {
          updatePoints(10);
          row.remove();
      } else if (button.classList.contains("deleteChore")) {
          row.remove();
      } else if (button.classList.contains("startTimer")) {
          startCountdownTimer(button);
      }
  });

  // Start Countdown Timer
  function startCountdownTimer(button) {
      let timeLeft = (parseInt(elements.timerInput?.value, 10) || 1) * 60; // Default: 1 minute
      button.disabled = true;

      const countdown = setInterval(() => {
          timeLeft--;
          button.textContent = `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`;

          if (timeLeft <= 0) {
              clearInterval(countdown);
              button.textContent = "Time's Up!";
              button.disabled = false;
          }
      }, 1000);
  }

  // Update Points & Progress Bar
  function updatePoints(value) {
      points += value;
      elements.totalPoints.textContent = points;
      const percentage = Math.min((points / 100) * 100, 100);
      elements.progressBar.style.width = `${percentage}%`;
      elements.progressBar.setAttribute("aria-valuenow", percentage);
  }

  // Add Reward
  elements.addRewardButton.addEventListener("click", function () {
      const reward = elements.rewardName.value.trim();
      const cost = parseInt(elements.rewardPoints.value.trim(), 10);

      if (reward && cost > 0) {
          const listItem = document.createElement("li");
          listItem.className = "list-group-item d-flex justify-content-between";
          listItem.dataset.points = cost;
          listItem.innerHTML = `
              ${reward} - ${cost} points
              <button class="btn btn-danger btn-sm removeReward">Remove</button>
          `;
          elements.rewardList.appendChild(listItem);
          const option = new Option(reward, cost);
          elements.rewardDropdown.add(option);
          elements.rewardName.value = "";
          elements.rewardPoints.value = "";
      }
  });

  // Remove Rewards
  elements.rewardList.addEventListener("click", function (event) {
      if (event.target.classList.contains("removeReward")) {
          event.target.parentElement.remove();
      }
  });

  // Redeem Reward
  elements.redeemButton.addEventListener("click", function () {
      const selectedOption = elements.rewardDropdown.selectedOptions[0];
      const cost = parseInt(selectedOption.value, 10);

      if (points >= cost) {
          updatePoints(-cost);
          elements.redeemStatus.textContent = `You redeemed ${selectedOption.text}!`;
          selectedOption.remove();
      } else {
          elements.redeemStatus.textContent = "Not enough points!";
      }
  });

  // Toggle Dark/Light Mode
  elements.toggleModeButton.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  });

  // Load Dark Mode Preference
  if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
  }

  // Background Customization
  function applyBackground() {
      document.body.style.backgroundColor = localStorage.getItem("bgColor") || "";
      document.body.style.backgroundImage = localStorage.getItem("bgImage") ? `url('${localStorage.getItem("bgImage")}')` : "none";
  }

  applyBackground();

  elements.bgColorInput.addEventListener("input", function () {
      document.body.style.backgroundColor = elements.bgColorInput.value;
      localStorage.setItem("bgColor", elements.bgColorInput.value);
  });

  elements.bgImageInput.addEventListener("change", function () {
      const file = elements.bgImageInput.files[0];
      if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = function (event) {
              document.body.style.backgroundImage = `url('${event.target.result}')`;
              localStorage.setItem("bgImage", event.target.result);
          };
          reader.readAsDataURL(file);
      }
  });

  elements.resetButton.addEventListener("click", function () {
      localStorage.clear();
      applyBackground();
  });
});
