let balance = 1000000000; // 初期残高
const balanceDisplay = document.getElementById("current-balance");
const paymentSound = document.getElementById("payment-sound");

// モーダルを開く関数
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

// モーダルを閉じる関数
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// 残高を表示する関数
function updateBalance() {
  balanceDisplay.textContent = balance.toLocaleString(); // 数字を区切り付きで表示
}

// 支払う処理
function processPayment() {
  const amount = parseInt(document.getElementById("pay-amount").value);
  if (!isNaN(amount) && amount > 0) {
    if (amount > balance) {
      // 残高不足の場合
      document.getElementById("error-message").innerText = "残高が足りません。";
      document.getElementById("error-message").style.color = "red"; // 赤文字に設定
      openModal("error-modal"); // エラーモーダルを開く
    } else {
      // 残高が足りる場合
      balance -= amount;
      updateBalance();
      paymentSound.play();
      document.getElementById("complete-message").innerText = "お支払いが完了しました。";
      closeModal("pay-modal");
      openModal("complete-modal");
    }
  } else {
    alert("有効な金額を入力してください");
  }
}

// 入金処理
function processDeposit() {
  const amount = parseInt(document.getElementById("deposit-amount").value);
  if (!isNaN(amount) && amount > 0) {
    balance += amount;
    updateBalance();
    paymentSound.play();
    document.getElementById("complete-message").innerText = "入金が完了しました。";
    closeModal("deposit-modal");
    openModal("complete-modal");
  } else {
    alert("有効な金額を入力してください");
  }
}

// ボタンのイベントリスナーを設定
document.getElementById("pay-button").onclick = () => openModal("pay-modal");
document.getElementById("deposit-button").onclick = () => openModal("deposit-modal");

// 最初の状態の残高を更新
updateBalance();
