const API_URL = "https://ajar-incongruous-foxtail.glitch.me/";
//console.log(API_URL);

const price = {
  Клубника: 60,
  Банан: 50,
  Манго:70,
  Киви: 55,
  Маракуйа: 90,
  Яблоко: 45,
  Мята: 50,
  Лед: 10,
  Биоразлагаемый: 20,
  Пластиковый: 0,
}

const cartDataControl = {
  get() {

    return JSON.parse(localStorage.getItem("freshyBarCart") || "[]" );
  },
add(item) {
  // console.log("item: ", item);
const cartData = this.get();
item.idls = Math.random().toString(36).substring(2, 8);
cartData.push(item);
localStorage.setItem("freshyBarCart", JSON.stringify(cartData));
},
remove(idls) {
  const cartData = this.get();
  const index = cart.findIndex((item) => item.idls === idls);
  if(index != -1) {
    cartData.splice(index, 1);
  }
  localStorage.setItem("freshyBarCart", JSON.stringify(cartData));  
},
clear() {
  localStorage.removeItem("freshyBarCart");
},
};

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
    //console.log(item);
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
                            <button class="btn cocktail__btn cocktail__btn-add" data-id="${item.id}">Добавить</button>
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

const modalController = ({ modal, btnOpen, time = 300, open, close }) => {
 const buttonElems = document.querySelectorAll(btnOpen);
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
    //console.log("code: ", code)

    if ( event === "close" || target === modalElem || code ==="Escape") {
      modalElem.style.opacity = 0;


      setTimeout(() => {
        modalElem.style.visibility = "hidden";
        // enabled мы будем вызывать когда модальное окно закрываем
        scrollService.enableScroll();

if (close) {
  close();
}

      }, time);

      window.removeEventListener("keydown", closeModal);
    }
};

const openModal = (e) => {

  if(open) {
    open({btn: e.target});
  };

  modalElem.style.visibility = "visible";
  modalElem.style.opacity = 1;
  window.addEventListener('keydown', closeModal);
  scrollService.disabledScroll();
};

buttonElems.forEach((buttonElem) => {
  //console.log(buttonElem);
  buttonElem.addEventListener("click", openModal);
})
// buttonElem.addEventListener('click', openModal);
//console.log("buttonElem: ", buttonElem);
modalElem.addEventListener('click', closeModal);
//console.log("modalElem: ", modalElem);

modalElem.closeModal = closeModal;
modalElem.openModal = openModal;

return { openModal, closeModal };
};

const getFormData = (form) => {
  const formData = new FormData(form);
  const data = {};
  //console.log("formData: ", formData.entries);
  for (const [name, value] of (formData.entries())) {
    //console.log("data: ", data)
    if (data[name]) {
      if (~Array.isArray(data[name])) {
        data[name] = [data[name]]
      }
      data[name].push(value)
    } else {
      data[name] = value;
    }
  }
  return data;
}

const calculateTotalPrice = (form, startPrice) => {
let totalPrice = startPrice;

const data = getFormData(form)
//console.log("data: ", data);

if (Array.isArray(data.ingredients)) {
  data.ingredients.forEach(item => {
    totalPrice += price[item] || 0;
  })
} else {
  totalPrice += price[data.ingredients] || 0;
}

if (Array.isArray(data.topping)) {
  data.topping.forEach((item) => {
      totalPrice += price[item] || 0;
    });
} else {
  totalPrice += price[data.topping] || 0;
}

totalPrice += price[data.cup] || 0;

return totalPrice
};

const formControl = (form, cb) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = getFormData(form);
      cartDataControl.add(data);

      if (cb) {
        cb();
      }
    });
};

const calculateMakeYourOwn = () => {
  const modalMakeOwn = document.querySelector(".modal__make-your-own");
  // будет получать элементы с верстки 
  const formMakeOwn = modalMakeOwn.querySelector(".make__form-make-your-own");
  const makeInputTitle = modalMakeOwn.querySelector(".make__input-title");
  const makeInputPrice = modalMakeOwn.querySelector(".make__input-price");
  const makeTotalPrice = modalMakeOwn.querySelector(".make__total-price");
  const makeAddBtn = modalMakeOwn.querySelector(".make__add-btn");

  const handlerChange = () => {
    const totalPrice = calculateTotalPrice(formMakeOwn, 150);

    const data = getFormData(formMakeOwn);

    if (data.ingredients) {
      const ingredients = Array.isArray(data.ingredients)
        ? data.ingredients.join(", ")
        : data.ingredients;

      makeInputTitle.value = `Конструктор: ${ingredients}`;
      makeAddBtn.disabled = false;
    } else {
      makeAddBtn.disabled = true;
    }
    makeInputPrice.value = totalPrice;
    makeTotalPrice.textContent = `${totalPrice} ₽`;
  };

  formMakeOwn.addEventListener("change", handlerChange);
  // () => {
  // console.log("test");
  //будет высчитываться тотал прайс с отдельной функции
  /*     const totalPrice = calculateTotalPrice(formMakeOwn, 150);
    makeInputprice.value = totalPrice;
    makeTotalPrice.textContent = `${totalPrice} ₽`;  */
  
  formControl(formMakeOwn, () => {
    modalMakeOwn.closeModal("close");
  });
  handlerChange();
  // });

  const resetForm = () => {
    // makeTitle.textContent = "";
    makeTotalPrice.textContent = "";
    makeAddBtn.disabled = true;
    formMakeOwn.reset();
  }

  return {resetForm};
};

const calculateAdd = () => {
    const modalAdd = document.querySelector(".modal__add");
    const formAdd = document.querySelector(".make__form-add");

    const makeTitle = modalAdd.querySelector(".make__title");
    const makeInputTitle = modalAdd.querySelector(".make__input-title");
    const makeTotalPrice = modalAdd.querySelector(".make__total-price");
    const makeInputStartPrice = modalAdd.querySelector(".make__input-start-price");
    const makeInputPrice = modalAdd.querySelector(".make__input-price");
    const makeTotalSize = modalAdd.querySelector(".make__total-size");
    const makeInputSize = modalAdd.querySelector(".make__input-size");

const handlerChange = () => {
  const totalPrice = calculateTotalPrice(formAdd, +makeInputStartPrice.value);
  
  makeInputPrice.value = totalPrice;
  makeTotalPrice.textContent = `${totalPrice} ₽`;
};

    formAdd.addEventListener("change", handlerChange);
    formControl(formAdd, () => {
      modalAdd.closeModal("close");
    });

const fillInForm = (data) => {
  
makeTitle.textContent = data.title
makeInputTitle.value = data.title
makeTotalPrice.textContent = `${data.price} ₽`;
makeInputStartPrice.value = data.price;
makeInputPrice.value = data.price;
makeTotalSize.textContent = data.size
makeInputSize.value = data.size
handlerChange();
};

const resetForm = () => {
makeTitle.textContent = "";
makeTotalPrice.textContent = "";
makeTotalSize.textContent =  "";

formAdd.reset();
};



  return { fillInForm, resetForm };
};

const createCartItem = (item) => {
  const li  = document.createElement('li');
  li.classList.add("order__item");

  li.innerHTML = `
  <img class="order__img" src="./img/banana.png" alt="${item.title}"/>

      <div class="order__info">
          <h3 class="order__name">${item.title}</h3>

              <ul class="order__topping-list">
                  <li class="order__topping-item">${item.size}</li>
                  <li class="order__topping-item">${item.cup}</li>
                   ${
                    item.topping 
                    ? (Array.isArray(item.topping)
                      ? item.topping.map(
                        (topping) => `<li class="order__topping-item">${topping}</li>`, 
                        )
                  : `<li class="order__topping-item">${item.topping}</li>`)
                  : ''
                }
                  
              </ul>
      </div>

      <button class="order__item-delete" data-idls="${item.idls}"
      aria-label="удалить коктейль из корзины"></button>

      <p class="order__item-price">${item.price}&nbsp;₽</p>
  `;

  return li;
}


const renderCart = () => {
  // эта функция будет получать модальное окно modal: ".modal__order",
  const modalOrder = document.querySelector(".modal__order");
  const orderCount = modalOrder.querySelector(".order__count");
  const orderList = modalOrder.querySelector(".order__list");
  const orderTotalPrice = modalOrder.querySelector(".order__total-price");
  const orderForm = modalOrder.querySelector(".order__form");

  const orderListData = cartDataControl.get();

  orderList.textContent = "";
  orderCount.textContent = `(${orderListData.length})`;

  orderListData.forEach(item => {
    orderList.append(createCartItem(item));
  });

  orderTotalPrice.textContent = `${orderListData.reduce(
    (acc, item) => acc + +item.price, 0,)} ₽`;

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!orderListData.length) {
      alert("Корзина пустая");
       orderForm.reset();
       modalOrder.closeModal("close");
      return;
    }

    const data = getFormData(orderForm);
    const response = await fetch(`${API_URL}api/order`, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        products: orderListData,
      }),
      headers: {
        "Content-Type": 'application/json'
      }
    });

    const {message} = await response.json();
    alert (message);

    cartDataControl.clear();
    // orderForm.reset();
    // modalOrder.closeModal("close");
    
  });
};

  const init = async () => {
    modalController({
      modal: ".modal__order",
      btnOpen: ".header__btn-order",
      // time: 500 скорость открытия модального окна
      open: renderCart,
    });

    const { resetForm: resetFormMakeYourOwn  } = calculateMakeYourOwn ();

    modalController({
      modal: ".modal__make-your-own",
      btnOpen: ".cocktail__btn-make",
      close: resetFormMakeYourOwn,
    });

    // modalController({
    //     modal: ".modal__make",
    //     btnOpen: ".cocktail__btn-make"
    // })

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

    const cartsCocktail = data.map((item) => {
      //перебираем дата и получаем
      const li = document.createElement("li");
      li.classList.add("goods__item");
      // li.textContent = item.title
      li.append(createCard(item)); //передаем его дальше
      return li;
      console.log(item);
    });
    goodsListEitem.append(...cartsCocktail);


    const { fillInForm: fillInFormAdd, resetForm: resetFormAdd } = calculateAdd();

    modalController({
      modal: ".modal__add",
      btnOpen: ".cocktail__btn-add",

      //callback functions кот передаются в тот момент когда будет происходить open и после того, когда будет происходить close
      open({ btn }) {
        const id = btn.dataset.id;
        const item = data.find((item) => item.id.toString() === id);
        fillInFormAdd(item);
      },

      close: resetFormAdd,
    });
  };

init();

