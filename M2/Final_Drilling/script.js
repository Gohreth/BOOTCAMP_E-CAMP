addEventListener("DOMContentLoaded", async () => {
  const THEME_STYLES = {
    dark: {
      text: "text-white",
      bg: "bg-black",
    },
    light: {
      text: "text-black",
      bg: "bg-white",
    },
  };

  const ENDPOINT = "https://digimon-api.vercel.app/api/digimon";

  const DIGIMONS_PER_PAGE = 12;

  const ENTER_KEY = "Enter";

  //Contendrá los digimons
  let digimons = [];

  function byName(digimonName) {
    return `${ENDPOINT}/name/${digimonName}`;
  }

  function byLevel(digimonLevel) {
    return `${ENDPOINT}/level/${digimonLevel}`;
  }

  function createDigimonCardHTML(digimon) {
    /* Recrea este componente Card sacado de Bootstrap
    <div class="card" style="width: 18rem">
        <img class="card-img-top"/>
        <div class="card-body">
            <p class="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
            </p>
        </div>
    </div> */
    const containerCard = document.createElement("div");
    containerCard.style.width = "12rem";
    containerCard.id = digimon.name;
    containerCard.role = "button";
    containerCard.className = "col border border-4 border-white g-0 rounded";
    const digimonImage = document.createElement("img");
    digimonImage.className = "card-img-top";
    digimonImage.className = "img-fluid object-fit-scale";
    digimonImage.src = digimon.img;
    digimonImage.alt = `Imagen de digimon ${digimon.name}`;
    const digimonBody = document.createElement("div");
    digimonBody.className = "card-body p-2";

    const nameText = document.createElement("p");
    nameText.className = "card-text text-center fw-bolder";
    nameText.innerText = digimon.name;

    const levelText = document.createElement("p");
    levelText.style.fontSize = "0.6rem";
    levelText.className = "card-text text-end";
    levelText.innerText = digimon.level;

    digimonBody.append(nameText, levelText);

    containerCard.append(digimonImage, digimonBody);
    return containerCard;
  }

  //Función que devuelve un arreglo con los digimones obtendidos desde la API o un arreglo vacío en caso de un error
  async function getDigimons() {
    try {
      const response = await fetch(ENDPOINT);
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async function getDigimonsByLevel(level) {
    try {
      const response = await fetch(byLevel(level));
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async function getDigimonsByName(name) {
    const response = await fetch(byName(name));
    return await response.json();
  }

  //Función que crea un arreglo de nodos con el formato definido por createDigimonCardHTML
  function createDigimonNodes(digimons, currentPage) {
    //Función que permite realizar una búsqueda particular de un Digimon clickeado
    function onDigimonClick(event) {
      const parent = event.currentTarget;

      //Asignamos el nombre del Digimon clickeado al input de texto para búsqueda por nombre
      nameInput.value = parent.id;

      //Disparamos el evento de búsqueda presionando Enter programaticamente en el elemento de input
      nameInput.dispatchEvent(
        new KeyboardEvent("keypress", {
          key: "Enter",
          code: "Enter",
          which: 13,
          keyCode: 13,
          charCode: 13,
          bubbles: true,
        })
      );
    }

    //Almacenará los nodos creados
    const digimonNodes = [];
    for (
      let index = DIGIMONS_PER_PAGE * (currentPage - 1);
      index < DIGIMONS_PER_PAGE * currentPage;
      index++
    ) {
      try {
        const digimon = digimons[index];
        const digimonElement = createDigimonCardHTML(digimon);
        digimonElement.addEventListener("click", onDigimonClick);
        digimonNodes.push(digimonElement);
      } catch (error) {}
    }
    return digimonNodes;
  }

  function calculateTotalPages(totalDigimons, digimonsPerPage) {
    return Math.floor(
      totalDigimons % digimonsPerPage === 0
        ? totalDigimons / digimonsPerPage
        : totalDigimons / digimonsPerPage + 1
    );
  }

  function createPaginationChildrenHTML(totalDigimons) {
    /*
    <li class="page-item">
        <a class="page-link" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        </a>
    </li>
    <li class="page-item active"><a class="page-link">1</a></li>
    <li class="page-item"><a class="page-link">2</a></li>
    <li class="page-item"><a class="page-link">3</a></li>
    <li class="page-item">
        <a class="page-link" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        </a>
    </li>
    */
    function createAnchorHTML(innerText, withSpan, ariaLabel) {
      const anchor = document.createElement("a");
      anchor.className = "page-link";
      if (withSpan) {
        anchor.ariaLabel = ariaLabel;
        anchor.appendChild(withSpan);
      } else {
        anchor.innerText = innerText;
      }
      return anchor;
    }

    const liNodes = [];

    const spanPrevious = document.createElement("span");
    spanPrevious.ariaHidden = "true";

    const previous = document.createElement("li");
    previous.className = "page-item";

    spanPrevious.innerText = "«";
    previous.appendChild(createAnchorHTML(null, spanPrevious, "Previous"));
    liNodes.push(previous);

    for (
      let index = 0;
      index < calculateTotalPages(totalDigimons, DIGIMONS_PER_PAGE);
      index++
    ) {
      const page = document.createElement("li");
      page.className = `page-item ${index === 0 ? "active" : ""}`;
      page.appendChild(createAnchorHTML(index + 1, null, null));
      liNodes.push(page);
    }

    const spanNext = document.createElement("span");
    spanNext.ariaHidden = "true";
    const next = document.createElement("li");
    next.className = "page-item";
    spanNext.innerText = "»";
    next.appendChild(createAnchorHTML(null, spanNext, "Next"));
    liNodes.push(next);

    return liNodes;
  }

  //Función que actualiza el UI de paginación
  function updatePagination(event, totalDigimons) {
    //Corresponde al elemento al que se le agregó el listener
    const parent = event.currentTarget;

    //Corresponde al elemento que disparó el evento
    const target = event.target;

    let newPage = target.innerText;

    const currentPage = getCurrentPage(parent);
    //Si no es número manejamos la lógica según el botón presionado << o >>
    if (!parseInt(target.innerText)) {
      if (target.innerText === "«") {
        newPage = Math.max(currentPage - 1, 1).toString();
      } else if (target.innerText === "»") {
        newPage = Math.min(
          currentPage + 1,
          calculateTotalPages(totalDigimons, DIGIMONS_PER_PAGE)
        ).toString();
      }
    }

    if (currentPage.toString() === newPage) return;

    //El loop actualizará la clase activa de los elementos de la paginación que sean números
    for (const element of parent.children) {
      if (element.innerText === newPage) {
        element.classList.toggle("active");
      } else {
        element.classList.toggle("active", false);
      }
    }
  }

  //Función que obtiene el valor de página actual
  function getCurrentPage(paginationElement) {
    let currentPage = 1;
    let potentialNewPage;
    try {
      for (const element of paginationElement.children) {
        if (!(potentialNewPage = parseInt(element.innerText))) continue;
        currentPage = element.classList.contains("active")
          ? potentialNewPage
          : currentPage;
      }
    } catch (error) {
    } finally {
      return currentPage;
    }
  }

  digimons = await getDigimons();

  const LEVELS = new Set(digimons.map((digimon) => digimon.level));

  function createLevelSelectorChildrenHTML(levels) {
    //<option value="1">One</option>
    const keys = levels.keys();
    let currentValue;
    const optionNodes = [];
    while ((currentValue = keys.next().value)) {
      const option = document.createElement("option");
      option.value = currentValue;
      option.innerText = currentValue;
      optionNodes.push(option);
    }
    return optionNodes;
  }
  const nameInput = document.getElementById("name-input");
  nameInput.addEventListener("keypress", async (event) => {
    const digimonName = event.target.value.trim();
    if (event.key !== ENTER_KEY) return;
    if (!digimonName) return;

    digimons = await getDigimonsByName(digimonName);

    digimonPagination.replaceChildren(
      ...createPaginationChildrenHTML(digimons.length)
    );

    if (digimons?.ErrorMsg) {
      const infoMessage = document.createElement("div");
      infoMessage.className = "alert alert-danger text-center";
      infoMessage.role = "alert";
      infoMessage.innerText = `No se encontró ningún Digimon llamado ${digimonName}`;
      digimonsContainer.replaceChildren(infoMessage);
    } else {
      //Re-renderizado dependiendo de la página actual
      digimonsContainer.replaceChildren(
        ...createDigimonNodes(digimons, getCurrentPage(digimonPagination))
      );
    }
  });

  const clearButton = document.getElementById("clear-button");
  clearButton.addEventListener("click", async () => {
    digimons = await getDigimons();

    digimonPagination.replaceChildren(
      ...createPaginationChildrenHTML(digimons.length)
    );

    //Re-renderizado dependiendo de la página actual
    digimonsContainer.replaceChildren(
      ...createDigimonNodes(digimons, getCurrentPage(digimonPagination))
    );
  });

  createLevelSelectorChildrenHTML(LEVELS);

  const levelSelector = document.getElementById("level-selector");
  levelSelector.append(...createLevelSelectorChildrenHTML(LEVELS));

  const digimonPagination = document.getElementById("digimon-pagination");
  digimonPagination.replaceChildren(
    ...createPaginationChildrenHTML(digimons.length)
  );

  digimonPagination.addEventListener("click", (event) => {
    //Actualiza la clase active de la paginación en el DOM
    updatePagination(event, digimons.length);

    //Re-renderizado dependiendo de la página actual
    digimonsContainer.replaceChildren(
      ...createDigimonNodes(digimons, getCurrentPage(event.currentTarget))
    );
  });

  levelSelector.addEventListener("change", async (event) => {
    //Resetea el valor de input por nombre de Digimon a ""
    nameInput.value = "";

    const level = event.target.value;
    digimons = await getDigimonsByLevel(level);

    digimonPagination.replaceChildren(
      ...createPaginationChildrenHTML(digimons.length)
    );

    //Re-renderizado dependiendo de la página actual
    digimonsContainer.replaceChildren(
      ...createDigimonNodes(digimons, getCurrentPage(digimonPagination))
    );
  });

  const digimonsContainer = document.getElementById("digimons-container");

  //Renderizado inicial de digimones (página 1)
  digimonsContainer.replaceChildren(
    ...createDigimonNodes(digimons, getCurrentPage(digimonPagination))
  );
});
