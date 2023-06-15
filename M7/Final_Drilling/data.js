const USERS = [
  {
    firstName: "Mateo",
    lastName: "Díaz",
    email: "mateo.diaz@correo.com",
  },
  {
    firstName: "Santiago",
    lastName: "Mejías",
    email: "santiago.mejias@correo.com",
  },
  {
    firstName: "Lucas",
    lastName: "Rojas",
    email: "lucas.rojas@correo.com",
  },
  {
    firstName: "Facundo",
    lastName: "Fernandez",
    email: "facundo.fernandez@correo.com",
  },
];

const BOOTCAMPS = [
  {
    title: "Introduciendo El Bootcamp De React.",
    cue: 10,
    description:
      "React es la librería más usada en JavaScript para el desarrollo de interfaces.",
  },
  {
    title: "Bootcamp Desarrollo Web Full Stack.",
    cue: 12,
    description:
      "Crearás aplicaciones web utilizando las tecnologías y lenguajes más actuales y populares, como: JavaScript, nodeJS, Angular, MongoDB, ExpressJS.",
  },
  {
    title: "Bootcamp Big Data, Inteligencia Artificial & Machine Learning.",
    cue: 18,
    description:
      "Domina Data Science, y todo el ecosistema de lenguajes y herramientas de Big Data, e intégralos con modelos avanzados de Artificial Intelligence y Machine Learning.",
  },
];

const BOOTCAMP_USERS = {
  [BOOTCAMPS[0].title]: [
    `${USERS[0].firstName} ${USERS[0].lastName}`,
    `${USERS[1].firstName} ${USERS[1].lastName}`,
  ],
  [BOOTCAMPS[1].title]: [`${USERS[0].firstName} ${USERS[0].lastName}`],
  [BOOTCAMPS[2].title]: [
    `${USERS[0].firstName} ${USERS[0].lastName}`,
    `${USERS[1].firstName} ${USERS[1].lastName}`,
    `${USERS[2].firstName} ${USERS[2].lastName}`,
  ],
};

module.exports = { USERS, BOOTCAMPS, BOOTCAMP_USERS };
