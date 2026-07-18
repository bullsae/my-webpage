let count = 0;
const btn = document.getElementById("btn");
const output = document.getElementById("count");

btn.addEventListener("click", () => {
  count++;
  output.textContent = `${count}번 클릭했어요!`;
});
