const contactForm = document.getElementById("contact-us");
const reservationForm = document.getElementById("reservation");
const forms = document.getElementsByTagName("form");
const openFormButtons = document.getElementsByClassName("open-button");

window.addEventListener("resize", (event) => {
  toggleFormsVisibility(forms, event.target.innerWidth < 768);
  toggleFormButtonsVisibility(openFormButtons, event.target.innerWidth < 768);
});

function toggleFormsVisibility(forms, isMobile) {
  for (element of forms) {
    element.style.display = isMobile ? "none" : "flex";
  }
}

function toggleFormButtonsVisibility(buttons, isMobile) {
  for (const element of buttons) {
    element.style.display = !isMobile ? "none" : "block";
    element.innerText = !isMobile
      ? element.innerText.replace("CERRAR", "ABRIR")
      : element.innerText;
  }
}

function setupOpenButtonsEvent(buttons) {
  for (const element of buttons) {
    element.addEventListener("click", () => {
      const currentDisplay = element.previousElementSibling.style.display;
      const currentInnerText = element.innerText;
      element.previousElementSibling.style.display =
        currentDisplay === "none" ? "flex" : "none";
      element.innerText = element.innerText.replace(
        currentInnerText.includes("ABRIR") ? "ABRIR" : "CERRAR",
        currentInnerText.includes("ABRIR") ? "CERRAR" : "ABRIR"
      );
    });
  }
}

function setupFormsEvent(forms) {
  for (const element of forms) {
    element.addEventListener("submit", (event) => {
      event.preventDefault();
      if (checkInputTypeElements(element, element.elements)) element.reset();
    });
  }
}

function checkInputTypeElements(elements) {
  const invalidInputs = [];
  const customer = { name: "", email: "" };
  for (const input of elements) {
    if (input.tagName === "BUTTON") continue;
    if (input.value === "") invalidInputs.push(input.id.split("-")[1]);
    if (input.id.split("-")[1] === "nombre") customer.nombre = input.value;
    if (input.id.split("-")[1] === "correo") customer.email = input.value;
  }
  if (invalidInputs.length === 0) {
    alert(
      `Muchas gracias ${customer.name} hemos recibido su sugerencia y enviaremos una pronta respuesta al correo ${customer.email}`
    );
    return true;
  }
  alert(
    `${invalidInputs.length === 1 ? "El campo" : "Los campos"} ${invalidInputs
      .map((input) => "'" + input[0].toUpperCase() + input.substring(1) + "'")
      .join(" ")} ${
      invalidInputs.length === 1 ? "es obligatorio" : "son obligatorios"
    }`
  );
  return false;
}

setupOpenButtonsEvent(openFormButtons);
toggleFormsVisibility(forms, window.innerWidth < 768);
toggleFormButtonsVisibility(openFormButtons, window.innerWidth < 768);
setupFormsEvent(forms);
