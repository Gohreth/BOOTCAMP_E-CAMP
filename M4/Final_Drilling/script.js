$(document).ready(async function () {
  const URL = "https://swapi.dev/api/";

  class Fetcher {
    constructor(url) {
      this.url = url;
    }
    async getData(id) {
      const response = await fetch(`${this.url}people/${id}`);
      const data = await response.json();
      return data;
    }
    async *firstTypeGenerator() {
      const start = 1;
      const end = 5;
      let current = start;
      while (current <= end) {
        yield await this.getData(current);
        current++;
      }
    }
    async *secondTypeGenerator() {
      const start = 6;
      const end = 11;
      let current = start;
      while (current <= end) {
        yield await this.getData(current);
        current++;
      }
    }
    async *thirdTypeGenerator() {
      const start = 12;
      const end = 16;
      //El 17 lanzaba error 404 en la API por eso lo omití
      let current = start;
      while (current <= end) {
        yield await this.getData(current);
        current++;
      }
    }

    initializeGenerators() {
      this.firstGen = this.firstTypeGenerator();
      this.secondGen = this.secondTypeGenerator();
      this.thirdGen = this.thirdTypeGenerator();
    }
  }

  function htmlTemplate({ variant, name, height, mass }) {
    return `
    <div class="card">
        <div class="circle circle--${variant}"></div>
        <div class="card__content">
            <div class="content__title">
                ${name}
            </div>
            <div class="content__body">
                Estatura: ${height} cm. Peso: ${mass} kg.
            </div>
        </div>
    </div>
    `;
  }

  const fetcher = new Fetcher(URL);
  fetcher.initializeGenerators();

  $("#first-type-trigger").mouseenter(async function () {
    const iteration = await fetcher.firstGen.next();
    if (iteration.done) return;
    const { name, height, mass } = iteration.value;
    $("#first-type").append(
      htmlTemplate({ variant: "red", name, height, mass })
    );
  });
  $("#second-type-trigger").mouseenter(async function () {
    const iteration = await fetcher.secondGen.next();
    if (iteration.done) return;
    const { name, height, mass } = iteration.value;
    $("#second-type").append(
      htmlTemplate({ variant: "green", name, height, mass })
    );
  });
  $("#third-type-trigger").mouseenter(async function () {
    const iteration = await fetcher.thirdGen.next();
    console.log(iteration);
    if (iteration.done) return;
    const { name, height, mass } = iteration.value;
    $("#third-type").append(
      htmlTemplate({ variant: "blue", name, height, mass })
    );
  });
});
