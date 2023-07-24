const API_URL = "https://ajar-incongruous-foxtail.glitch.me/";
//console.log(API_URL);

const getData = async() => {
    //const response = await fetch(API_URL + "api/goods");
    const response = await fetch(`${API_URL}api/goods`);
    //console.log('response: ', response);
//const data = response.text();
    const data = await response.json();
    //console.log(data);
    //console.log("data: ", data);
    //возвращаем данные из функции:
    return data;
};

//создаем функцию кот будет создавать карточки
//есть код готовый и мы будем его использовать на странице

const createCard = (item) => {
    console.log(item);
const cocktail = document.createElement("article");
cocktail.classList.add("cocktail");

//вставляем верстку
cocktail.innerHTML = `
        <img    class="cocktail__img" 
                src="${API_URL}${item.image}" 
                alt="Коктейл ${item.title}" >
                    <div class="cocktail__content">
                        <div class="cocktail__text">
                            <h3 class="cocktail__title">${item.title}</h3>
                            <p class="cocktail__price test__red">${item.price}</p>
                            <p class="cocktail__size">${item.size}</p>
                        </div>
                            <button class="btn cocktail__btn" data-id="${item.id}">Добавить</button>
                    </div>
                        `;

                        return cocktail;
};

// блокировка скрола

const scrollService = {
  scrollPosition: 0,
  disabledScroll() {
    this.scrollPosition = window.scrollY;
    document.documentElement.style.scrollBehavior = "auto";
    //console.log("this.scrollPosition: ", this.scrollPosition);
    document.body.style.cssText = `
    overflow: hidden;
    position: fixed;
    top: -${this.scrollPosition}px;
    left: 0;
    height: 100vh;
    width: 100vw;
    padding-right: ${window.innerWidth - document.body.offset}px;
    `;
  } ,
  
  enableScroll() {
    document.body.style.cssText = '';
    window.scroll({ top: this.scrollPosition});
    document.documentElement.style.scrollBehavior = '';
  }
};

const modalController = ({ modal, btnOpen, time = 300 }) => {
 const buttonElem = document.querySelector(btnOpen);
 const modalElem = document.querySelector(modal);

 modalElem.style.cssText = `
 display: flex;
 visibility: hidden;
 opacity: 0;
 transition: opacity ${time}ms ease-in-out;
 `;



const closeModal = (event) => {
    const target = event.target;
    const code = event .code;
    console.log("code: ", code)

    if ( target === modalElem || code ==="Escape") {
      modalElem.style.opacity = 0;


      setTimeout(() => {
        modalElem.style.visibility = "hidden";
        // enabled мы будем вызывать когда модальное окно закрываем
        scrollService.enableScroll();
      }, time);

      window.removeEventListener("keydown", closeModal);
    }
};

const openModal = () => {
  modalElem.style.visibility = "visible";
  modalElem.style.opacity = 1;
  window.addEventListener('keydown', closeModal);
  scrollService.disabledScroll();
};


buttonElem.addEventListener('click', openModal);
//console.log("buttonElem: ", buttonElem);
modalElem.addEventListener('click', closeModal);
//console.log("modalElem: ", modalElem);

return { openModal, closeModal };
};


const init = async () => {
    modalController ({
        modal: '.modal__order', 
        btnOpen: '.header__btn-order',
        // time: 500 скорость открытия модального окна 
    });

/* // будет написана специальная функция кот будет этим заниматься
const headerBtnOrder = document.querySelector(".header__btn-order"); мы должны получить эту кнопку 
headerBtnOrder.addEventListener("click", () => {  далее мы должны на нее кликнуть ., мы вызываем функцию 
    modal__order
})  */

const goodsListEitem = document.querySelector(".goods__list");
//console.log(goodsListEitem);
//console.log(document);
//getData();
const data = await getData(); //мы взяли дата
//console.log("data: ", data);

const cartsCocktail = data.map((item) => { //перебираем дата и получаем
    const li = document.createElement("li");
    li.classList.add("goods__item");
   // li.textContent = item.title
    li.append(createCard(item)); //передаем его дальше
    return li;
    console.log(item);
});
goodsListEitem.append(...cartsCocktail);
};

init();