const button = document.getElementById("compare-button");

const n1 = document.getElementById("first-number");
const n2 = document.getElementById("second-number");

button.addEventListener("click", () => {
  const { value: valor1 } = n1;
  const { value: valor2 } = n2;
  if (!valor1 || !valor2) return;
  if (valor1 === valor2) return alert(`${valor1} es igual a ${valor2}`);
  if (valor1 > valor2) return alert(`${valor1} es mayor a ${valor2}`);
  if (valor1 < valor2) return alert(`${valor2} es mayor a ${valor1}`);
});
