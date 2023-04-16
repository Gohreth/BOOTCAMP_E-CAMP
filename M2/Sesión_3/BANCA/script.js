//Usuario hard-codeado
const onlineBankUser = {
  name: "Sebastián Campos",
  id: "18850004-8",
  password: "abc123",
  balance: 10000,
};

//Las funciones utilizan el objecto hard-codeado de usuario, sino deberían recibir como parámetro el usuario loggeado en Banca en Línea

function showBalance() {
  alert(`Su saldo es: ${onlineBankUser.balance}`);
}

function promptWithMessage(message) {
  const amount = parseInt(
    prompt(`Su saldo actual es: ${onlineBankUser.balance}\n${message}`)
  );
  if (amount <= 0)
    throw new Error("No puede ingresar monto inferior o igual a cero");
  if (isNaN(amount))
    throw new Error("Monto ingresado incorrecto, ingrese un número válido");
  return amount;
}

function makeDraft() {
  const amount = promptWithMessage("Ingrese el monto que desea girar");
  if (amount > onlineBankUser.balance)
    throw new Error("Giro rechazado. No tienes saldo suficiente");
  onlineBankUser.balance -= amount;
  alert(`Giro realizado. Su nuevo saldo es ${onlineBankUser.balance}`);
}

function makeDeposit() {
  const amount = promptWithMessage("Ingrese el monto que desea depositar");
  onlineBankUser.balance += amount;
  alert(`Depósito realizado. Su nuevo saldo es ${onlineBankUser.balance}`);
}

alert("Bienvenid@ a Banca en Línea");

const rutRegex = /^[1-9]\d*\-(\d|k|K)$/;

let id, password;
while (id !== onlineBankUser.id || password !== onlineBankUser.password) {
  do {
    id = prompt("Ingrese su identificador (R.U.T. sin puntos y con guión)");
    if (!rutRegex.test(id)) alert("Formato de R.U.T. incorrecto");
  } while (!rutRegex.test(id));
  password = prompt("Ingrese su contraseña");
  if (id !== onlineBankUser.id || password !== onlineBankUser.password)
    alert("Credenciales incorrectas, intente otra vez");
}

alert(`Bienvenid@ ${onlineBankUser.name}`);

let option;

while (option !== 4) {
  option = prompt(
    "Seleccione que desea hacer:\n1.- Ver saldo\n2.- Realizar giro\n3.- Realizar depósito\n4.- Salir"
  );

  if (isNaN(option)) {
    alert("Elección incorrecta. Adiós!");
    continue;
  }

  option = parseInt(option);

  switch (option) {
    case 1:
      showBalance();
      break;
    case 2:
      try {
        makeDraft();
      } catch (error) {
        alert(error.message);
      }
      break;
    case 3:
      try {
        makeDeposit();
      } catch (error) {
        alert(error.message);
      }
      break;
    case 4:
      alert("Gracias por usar Banca en Línea");
      break;
    default:
      alert("Elección incorrecta. Adiós!");
  }
}
