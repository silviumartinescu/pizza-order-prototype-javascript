import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("checkout");
  }

  async getHtml() {
    let data = await fetch("/test.json");
    let orderList = await data.json();
    let cartPrice = 0;
    let deliveryFee = "FREE";

    for (let i = 0; i < orderList.length; i++) {
      cartPrice += orderList[i].totalPrice;
    }
    if (cartPrice < 100) {
      deliveryFee = "8 RON";
      cartPrice = cartPrice + 8;
    }
    let header1 = `
        <div class="headerTEXT" >
      <a href="javascript: history.go(-1)" class="nav__link" data-link
        ><img
          src="https://cdn.dribbble.com/users/35347/screenshots/1970894/attachments/430895/dribbble_shots_marios_a.jpg"
          style="height: 100px; width: 100p; border-radius: 20px"
          alt="pizza logo"
      /></a>
      <div>
      
      </div>
      
    `;

    let header2 = `
      </form >
      <div class="header-right"  >
        <a href="/checkout" class="nav__link" data-link
          ></h1><i class="fa-solid fa-cart-shopping fa-3x"></i
        ></a>
      </div>
    </div>
    `;
    let bodyInner = orderList
      .map((el) => {
        return `
      <table class='order-table'>
          <tbody>
            <tr>
              <td><img src='${el.img}' class='full-width'></img>
              </td>
              <td>
                <br> <span class='thin'>${el.name} x ${el.qty}</span>
              </td>

            </tr>
            <tr>
              <td>
                <div class='price'>${el.totalPrice} RON</div>
              </td>
            </tr>
          </tbody>

        </table>
        <div class='line'></div>
      `;
      })
      .join("");
    let body = `
      <div class='container-z'>
    <div class='window'>
      <div class='order-info'>
        <div class='order-info-content'>
        <div class='total'>
          <span style='float:left;'>
            <div class='thin dense'>Delivery</div>
            TOTAL
          </span>
          <span style='float:right; text-align:right;'>
            <div class='thin dense'>${deliveryFee}</div>
            ${cartPrice} RON
          </span>
        </div>
          <h2>Order Summary</h2>
                  <div class='line'></div>
          ${bodyInner}
          
  </div>
  </div>
          <div class='credit-info'>
            <div class='credit-info-content'>
              <table class='half-input-table'>
                <tr><td>Please select your card: </td><td><div class='dropdown' id='card-dropdown'><div class='dropdown-btn' id='current-card'>Visa</div>
                  <div class='dropdown-select'>
                  <ul>
                    <li>Master Card</li>
                    <li>American Express</li>
                    </ul></div>
                  </div>
                 </td></tr>
              </table>
              <img src='https://dl.dropboxusercontent.com/s/ubamyu6mzov5c80/visa_logo%20%281%29.png' height='80' class='credit-card-image' id='credit-card-image'></img>
              Card Number
              <input id="card-number" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
              maxlength="16" type="number" class='input-field'></input>
              Card Holder
              <input id="card-holder" class='input-field'></input>
             
              <table class='half-input-table'>
                <tr>
                  <td> Expires
                    <input id="expires" class='input-field'></input>
                  </td>
                  <td>CVC
                    <input id="cvc" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    maxlength="3" type="number" class='input-field'></input>
                  </td>
                </tr>
              </table>
              <div style="text-align:center; font-weight:bold; font-size:10px">Delivery details</div>
              Email
              <input id="email" type="email" class='input-field'></input>
              Address
              <input id="address" class='input-field'></input>
              <button class='pay-btn'>Checkout</button>
  
            </div>
  
          </div>
        </div>
  </div>;`;

    return header1 + header2 + body;
  }
}
