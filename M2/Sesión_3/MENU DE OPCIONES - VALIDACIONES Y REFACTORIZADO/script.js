function checkNumbers(numbers) {
  if (!numbers) throw new Error("Número(s) incorrecto(s)");
}

function checkDivisionByZero(divisor) {
  if (divisor === 0) throw new Error("No se puede dividir por cero");
}

function compare() {
  const numbers = askTwoNumber();
  console.log(numbers);
  checkNumbers(numbers);
  [n1, n2] = numbers;
  n1 > n2
    ? alert(`${n1} es mayor que ${n2}`)
    : n1 === n2
    ? alert(`${n1} es igual que ${n2}`)
    : alert(`${n2} es mayor que ${n1}`);
}

function sum() {
  const numbers = askTwoNumber();
  checkNumbers(numbers);
  [n1, n2] = numbers;
  alert(`La suma de los números ${n1} y ${n2} es: ${n1 + n2}`);
}

function subtract() {
  const numbers = askTwoNumber();
  checkNumbers(numbers);
  [n1, n2] = numbers;
  alert(`La resta de los números ${n1} y ${n2} es: ${n1 - n2}`);
}

function multiply() {
  const numbers = askTwoNumber();
  checkNumbers(numbers);
  [n1, n2] = numbers;
  alert(`La multiplicación de los números ${n1} y ${n2} es: ${n1 * n2}`);
}

function divide() {
  const numbers = askTwoNumber();
  checkNumbers(numbers);
  [n1, n2] = numbers;
  checkDivisionByZero(n2);
  alert(`La división de los números ${n1} y ${n2} es: ${n1 / n2}`);
}

function show() {
  const numbers = askTwoNumber();
  checkNumbers(numbers);
  [n1, n2] = numbers;
  alert(`Los números ingresados son: ${n1} y ${n2}`);
}

function askTwoNumber() {
  const n1 = prompt("Ingrese el primer número");
  const n2 = prompt("Ingrese el segundo número");
  if (typeof n1 === "string") {
    if (Object.is(n1.trim(), "")) return null;
  }
  if (typeof n2 === "string") {
    if (Object.is(n2.trim(), "")) return null;
  }
  if (isNaN(n1) || isNaN(n2)) return null;
  return [parseInt(n1), parseInt(n2)];
}

let option;

while (option !== 7) {
  option = prompt(
    "Seleccione que desea hacer:\n1.- Calcular cual número es mayor\n2.- Sumar\n3.- Restar\n4.- Multiplicar\n5.-Dividir\n6.- Mostrar los números ingresados\n7.- Salir"
  );

  if (isNaN(option)) {
    alert("Elección incorrecta. Adiós!");
    continue;
  }

  option = parseInt(option);

  switch (option) {
    case 1:
      try {
        compare();
      } catch (error) {
        alert(error.message);
      }
      break;
    case 2:
      try {
        sum();
      } catch (error) {
        alert(error.message);
      }
      break;
    case 3:
      try {
        subtract();
      } catch (error) {
        alert(error.message);
      }
      break;
    case 4:
      try {
        multiply();
      } catch (error) {
        alert(error.message);
      }
      break;
    case 5:
      try {
        divide();
      } catch (error) {
        alert(error.message);
      }
      break;
    case 6:
      try {
        show();
      } catch (error) {
        alert(error.message);
      }
      break;
    case 7:
      alert("Gracias por participar");
      break;
    default:
      alert("Elección incorrecta. Adiós!");
  }
}
