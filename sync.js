// Simpele sync test met cloud indicator
document.addEventListener("DOMContentLoaded", () => {
  const cloud = document.getElementById("cloud-status");
  cloud.textContent = "Cloud: verbonden";

  document.querySelectorAll(".dot").forEach(dot => {
    dot.addEventListener("click", () => {
      dot.classList.toggle("green");
      dot.classList.toggle("red");
    });
  });
});
