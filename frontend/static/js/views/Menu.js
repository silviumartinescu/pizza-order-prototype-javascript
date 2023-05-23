import AbstractView from "./AbstractView.js";
// import { orderList } from "../index.js";
export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Menu");
  }

  async getHtml() {
    let a = await fetch("/getData");
    let b = await a.json();
    let c = await fetch("/allergens");
    let d = await c.json();
    let CurrentValue = 0;

    let formHead = d
      .map((el) => {
        return ` 
      <input type="checkbox" id="${el.id}" name="alergen" value="${el.name}">
        <label for="${el.id}">
        <h2>${el.name}</h2>
        </label>
         `;
      })
      .join("");

    let header1 = `
        <div class="header">
      <a href="/menu" class="nav__link" data-link
        ><img
          src="https://cdn.dribbble.com/users/35347/screenshots/1970894/attachments/430895/dribbble_shots_marios_a.jpg"
          style="height: 100px; width: 100p; border-radius: 20px"
          alt="pizza logo"
      /></a>
      <div>
      <h2 id="form">Sort pizza by allergens : </h2>
      </div>
      <form id="form" action="/allergens">
    `;
    // let cartPrice = 0;
    // for (el in orderList) {
    //   cartPrice += el.totalPrice;
    // }
    let header2 = `
      </form>
      <div class="header-right">
      <a href="/checkout" class="nav__link disabled" id="checkout" data-link
      ><i class="fa-solid fa-cart-shopping fa-3x"></i
      ></a>
      </div>
      <span id="cart-price">0 RON</span>
    </div>
    `;

    let body = b
      .map((el) => {
        return `
      <figure class="card" id="card-id-${el.id}">
      <div class="card__detail-box">
      <img id="myImg" onclick="onClick(this)" alt="pizza" class="image" src="/${el.image}"/ class="modal-hover-opacity">
    </div>
    <div class="card__title-box">
      <h2 id="pizza" class="card__title">${el.name}</h2>
    </div>

    <div class="card__details">
      <div class="card__detail-box">
          <button   onclick="decrease('btn${el.id}')" type='button' ><i class="fa fa-minus"></i></button>
          <input type="number" class="quantity" id='btn${el.id}'  value="${CurrentValue}"/>
          <button onclick="increase('btn${el.id}')" type='button' ><i class="fa fa-plus"></i></button>
      </div>

      <div class="card__detail-box-2">
        <h6 class="card__detail">${el.ingredients}</h6>
      </div>
        
      <div class="card__detail-box">
        <h6 id="price" class="card__detail card__detail--price">${el.price} RON </h6>
      </div>
    </div>

    <a class="card__link" name="add-to-cart" id="cart-${el.id}">
      <span>Add to cart<i class="emoji-right">🛒</i></span>
    </a>
  </figure>`;
      })
      .join("");
    return header1 + formHead + header2 + body;
  }
}
