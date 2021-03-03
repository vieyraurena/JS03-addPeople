// Nuestro API:
// https://5d2cd8678c90070014972942.mockapi.io/people

const apiUrl = "https://603ebe94d952850017603912.mockapi.io/people";


// ELEMENTOS
const addButton = document.querySelector(".add-person__button");
const cancelButton = document.querySelector(".people-add__cancel");
const addForm = document.querySelector(".people-add");
const htmlListElement = document.querySelector(".people__list");
const personaContentElement = document.querySelector(".people__content");
const form = document.querySelector('form');

// EVENTOS
addButton.addEventListener("click", () => {
  addForm.classList.add("active");
});

cancelButton.addEventListener("click", (e) => {
  e.preventDefault();
  addForm.classList.remove("active");
});

form.addEventListener('submit', event => {
  event.preventDefault();
  addInfo(
    form.elements[0].value,
    form.elements[1].value,
    form.elements[2].value,
    form.elements[3].value,
  );
  event.target.reset();
});

// FUNCIONES GLOBALES

function getListElement(id) {
  return document.querySelector(`[data-id="${id}"]`);
}

/*
PASOS A SEGUIR
1. Obtener el listado de todos las personas y pintarlos en el sidebar de la izquierda
- Llamar al API, con un fetch
- Crear los elementos con la lista de personas
- Agregar el listado al DOM
*/

// Recibe un array de personas y develve un string de <li> con el nombre de cada persona
const createPersonDOM = (person) => {
  return `
  <li data-id="${person.id}">
    <h3 role="button">${person.fullName}</h3>
    <button>X</button>
  </li>
`;
}


function getPeopleHtmlList(people) {
  return people
    .map((person) => {
      return createPersonDOM(person)
    })
    .join("");
}

fetch(apiUrl, {
  method: "GET"
})
  .then((response) => {
    return response.json();
  })
  .then((people) => {
    const htmlListItems = getPeopleHtmlList(people);
    htmlListElement.innerHTML = htmlListItems;
  })
  .catch((err) => {
    console.error(err);
  });

/*

2. Eliminar una persona del sistema
    2.1. Agregar un boton de eliminar al listado
    2.2. Escuchar los eventos de la lista y reaccionar dependiendo del target
    2.3. Usar el data-id para poder construir el url para eliminar una persona
    2.4. Hacer el request (metodo DELETE) para eliminar una persona
    2.5. Si el request esta ok === true eliminamos la persona de la lista usando el selector [data-id="${id}"] y el metodo remove()
    2.6. Si el request esta ok === false (mal), tiramos un error para poder agarrarlo en el .catch y mostrarle un mensaje de error al usuario
*/

// Event delegation de la lista
htmlListElement.addEventListener("click", (e) => {
  const id = e.target.parentElement.dataset.id;

  if (e.target.tagName === "BUTTON") {
    eliminarPersona(id);
  } else {
    mostrarInformacionCompleta(id);
  }
});

function eliminarPersona(id) {
  fetch(`${apiUrl}/${id}`, {
    method: "DELETE"
  })
    .then((response) => {
      if (response.ok) {
        const liEliminado = getListElement(id);
        liEliminado.remove();
      } else {
        throw new Error(response.status);
      }
    })
    .catch((err) => {
      alert(`Ocurrió un error de tipo ${err}`);
    });
}

/*
3. Al hacer click en uno de las personas del sidebar agregar la informacion completa en la columna derecha y poner la clase "active" a la persona seleccionada
  3.1. Escuchar el click del listado: ya esto lo hicimos cuando escuchamos el click de toda la lista
  3.2. Buscar el usuario cliqueado en nuestro API
  3.3. Pintar la informacion del usuario en la columna derecha
*/

function getPersonaHtmlContent(persona) {
  return `
    <h1>${persona.fullName}</h1>
    <ul>
      <li>Phone: ${persona.phoneNumber}</li>
      <li>Email: ${persona.email}</li>
      <li>Ciudad: ${persona.city}</li>
    </ul>
  `;
}

function mostrarInformacionCompleta(id) {
  fetch(`${apiUrl}/${id}`, {
    method: "GET"
  })
    .then((response) => {
      return response.json();
    })
    .then((persona) => {
      // persona es el objeto que viene del servidor

      // con el objeto persona construimos el string de HTML
      const htmlContent = getPersonaHtmlContent(persona);

      // con el string de HTML lo agregamos al contenido
      personaContentElement.innerHTML = htmlContent;

      // QUITAR EL ACTIVE DEL ANTERIOR

      // conseguimos el primer elemento que tenga la clase .active
      const currentActive = document.querySelector(".people__list .active");

      // si el element existe, le quitamos la clase .active
      if (currentActive) {
        currentActive.classList.remove("active");
      }

      // AGREGAR EL ACTIVE AL ELEMENTO CLICKEADO

      // conseguimos el elemento que le hicimos click usando el id
      const menuItemCliqueado = getListElement(id);

      // y le agregamos la clase active
      menuItemCliqueado.classList.add("active");
    })
    .catch((err) => {
      console.error(err);
    });
}

/*
4. Crear una persona nueva desde el formulario

Clona tu propio API: https://mockapi.io/clone/5d2cd8678c90070014972943


// PROXIMO MARTES 2/3/2021

    4.1. Es escuchar el evento "submit" del formulario
    4.2. Obtener los values de los inputs
    4.3. Hacer el fetch de un metodo POST
          4.3.1. Construir un objeto para el body del request
    4.4. Añadir el nombre del nuevo usuario a la lista en el sidebar (en la ultima posicion de la lista)
    4.5. Usar un alert para decirle al usuario que la persona fue agregada satisfactoriamente
    4.6. Limpiar el formulario

*/

const addInfo = (fullName, email, phone, city) => {
  const newInfo = {
    'fullName': fullName,
    'email': email,
    'phoneNumber': phone,
    'city': city,
  };

  fetch(`${apiUrl}`, {
    method: "POST",
    body: JSON.stringify(newInfo),
    headers: {
      "Content-Type": "application/json"
    },
  })
    .then((response) => {{
      return response.json();
    }})
    .then((data) => {
      htmlListElement.innerHTML += createPersonDOM(data);
    })
    alert('La persona fue agregada satisfactoriamente')
};