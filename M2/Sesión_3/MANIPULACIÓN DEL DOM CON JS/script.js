const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");
const caja2 = document.getElementById("caja2");
const caja3 = document.getElementById("caja3");
const img = document.getElementById("img");

text2.classList.add("hidden");

text1.addEventListener("mouseenter", () => text2.classList.toggle("hidden"));
text1.addEventListener("mouseleave", () => text2.classList.toggle("hidden"));

caja2.addEventListener("click", () => img.setAttribute("width", "100%"));
caja2.addEventListener("mouseleave", () => img.setAttribute("width", "20%"));

caja3.addEventListener("dblclick", () => (caja3.style.fontSize = "2rem"));
