import Checkout from "./views/Checkout.js";
import Menu from "./views/Menu.js";
// import fs from "fs";

// const fs = require("fs");

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

let content = document.querySelector("#app");

const router = async () => {
  const routes = [
    {
      path: "/checkout",
      view: Checkout,
    },
    {
      path: "/menu",
      view: Menu,
    },
    // {
    //   path: "/menu/id",
    //   view: ViewMenu,
    // },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potMatch) => potMatch.isMatch);

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }
  let a = await fetch("/getData");
  let pizzaObj = await a.json();
  let orderList = [];
  if (match.route.path === "/menu") {
    const view = new match.route.view();
    // console.log(view);
    content.innerHTML = await view.getHtml();
    let allergenList = [];
    document.getElementsByName("alergen").forEach((el) => {
      el.addEventListener("click", (out) => {
        if (out.target.checked === true) {
          allergenList.push(parseInt(out.target.id));
        } else if (out.target.checked === false) {
          allergenList.splice(allergenList.indexOf(parseInt(out.target.id)), 1);
        }
        for (let i = 0; i < pizzaObj.length; i++) {
          for (let j = 0; j < allergenList.length + 1; j++) {
            if (
              pizzaObj[i].allergens.some((el) => {
                return allergenList.includes(el);
              })
            ) {
              document
                .getElementById(`card-id-${pizzaObj[i].id}`)
                .classList.add("hidden");
            } else {
              document
                .getElementById(`card-id-${pizzaObj[i].id}`)
                .classList.remove("hidden");
            }
          }
        }
      });
    });

    document.getElementsByName("add-to-cart").forEach((el) => {
      el.addEventListener("click", (item) => {
        const pizzaName = item.path[1].querySelector("#pizza").innerHTML;
        const pizzaQty = parseInt(item.path[1].querySelector("input").value);
        const pizzaPrice = parseInt(
          item.path[1].querySelector("#price").innerHTML
        );
        const pizzaImgSrc = item.path[1].querySelector("#myImg").src;
        let pizza = {
          name: pizzaName,
          qty: pizzaQty,
          totalPrice: pizzaQty * pizzaPrice,
          img: pizzaImgSrc,
        };
        if (pizzaQty > 0) {
          const index = orderList.findIndex((el) => el.name === pizza.name);

          if (index === -1) {
            orderList.push(pizza);
            document.querySelector("#checkout").classList.remove("disabled");
          } else {
            orderList[index] = pizza;
          }
        } else {
          const index = orderList.findIndex((el) => el.name === pizza.name);
          if (index > -1) {
            orderList.splice(index, 1);
          }
        }
        let cartPrice = 0;
        for (let i = 0; i < orderList.length; i++) {
          cartPrice += orderList[i].totalPrice;
        }
        if (orderList.length === 0) {
          cartPrice = 0;
          document.querySelector("#checkout").classList.add("disabled");
        }

        document.querySelector("#cart-price").innerText = `${cartPrice} RON`;
        console.log(cartPrice);
        console.log(orderList);
      });
    });

    document.querySelector("#checkout").addEventListener("click", () => {
      console.log("checkout");
      fetch("/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderList),
      }).then((res) => {
        console.log("Request complete! response:", res);
      });
    });
  } else if (match.route.path === "/checkout") {
    const view = new match.route.view();
    content.innerHTML = await view.getHtml();
    document.querySelector(".header-right").classList.add("hidden");

    document.querySelector(".bouncy").classList.add("menu-title");

    var cardDrop = document.getElementById("card-dropdown");
    var activeDropdown;
    fetch("test.json")
      .then((response) => response.json())
      .then((data) => {
        document.querySelector(".pay-btn").addEventListener("click", (e) => {
          var cardNumber = document.getElementById("card-number").value;

          var cardHolder = document.getElementById("card-holder").value;

          var expires = document.getElementById("expires").value;
          var cvc = document.getElementById("cvc").value;

          var email = document.getElementById("email").value;
          var address = document.getElementById("address").value;

          if (
            [cardNumber, cardHolder, expires, cvc, email, address].includes("")
          ) {
            alert("Please fill all inputs!");
            return false;
          } else {
            const date = new Date().toLocaleDateString("sv");
            const hour = new Date().getHours();
            const minutes = new Date().getMinutes();
            const orderForm = {
              order: data,
              cardNumber: cardNumber,
              cardHolder: cardHolder,
              expires: expires,
              cvc: cvc,
              email: email,
              address: address,
              time: `${hour}:${minutes} ${date}`,
            };
            fetch("/placeOrder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderForm),
            }).then((res) => {
              console.log("Request complete! response:", res);
            });
            location.href = "/completeOrder";
          }
        });
      });
    cardDrop.addEventListener("click", function () {
      var node;
      for (var i = 0; i < this.childNodes.length - 1; i++)
        node = this.childNodes[i];
      if (node.className === "dropdown-select") {
        node.classList.add("visible");
        activeDropdown = node;
      }
    });

    window.onclick = function (e) {
      console.log(e.target.tagName);
      console.log("dropdown");
      console.log(activeDropdown);
      if (e.target.tagName === "LI" && activeDropdown) {
        if (e.target.innerHTML === "Master Card") {
          document.getElementById("credit-card-image").src =
            "https://dl.dropboxusercontent.com/s/2vbqk5lcpi7hjoc/MasterCard_Logo.svg.png";
          activeDropdown.classList.remove("visible");
          activeDropdown = null;
          e.target.innerHTML =
            document.getElementById("current-card").innerHTML;
          document.getElementById("current-card").innerHTML = "Master Card";
        } else if (e.target.innerHTML === "American Express") {
          document.getElementById("credit-card-image").src =
            "https://dl.dropboxusercontent.com/s/f5hyn6u05ktql8d/amex-icon-6902.png";
          activeDropdown.classList.remove("visible");
          activeDropdown = null;
          e.target.innerHTML =
            document.getElementById("current-card").innerHTML;
          document.getElementById("current-card").innerHTML =
            "American Express";
        } else if (e.target.innerHTML === "Visa") {
          document.getElementById("credit-card-image").src =
            "https://dl.dropboxusercontent.com/s/ubamyu6mzov5c80/visa_logo%20%281%29.png";
          activeDropdown.classList.remove("visible");
          activeDropdown = null;
          e.target.innerHTML =
            document.getElementById("current-card").innerHTML;
          document.getElementById("current-card").innerHTML = "Visa";
        }
      } else if (e.target.className !== "dropdown-btn" && activeDropdown) {
        activeDropdown.classList.remove("visible");
        activeDropdown = null;
      }
    };
  }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
});

// export { orderList };
