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

                        return cocktail
}

const init = async () => {
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