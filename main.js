var categories = []
var selectedCat = []
var data = Data
var cart = []
var cartNumbers = []
var pageNum = 1
$(document).ready(() => {
    getData()
    Data.map(item => {
        if (categories.indexOf(item.category) == -1) {
            categories.push(item.category)
        }
    })
    getCategories()
})
const starFull = `<i class="fa fa-star" aria-hidden="true"></i>`
const starHalf = `<i class="fa fa-star-half-o" aria-hidden="true"></i>`
const starEmpty = `<i class="fa fa-star-o" aria-hidden="true"></i>`
const deleteIcon = `<i class="fa fa-times" aria-hidden="true"></i>`
const minusIcon = `<i class="fa fa-minus" aria-hidden="true"></i>`
const getStars = (rating) => {
    var starStr = ""
    var starFullNum = parseInt(rating)
    var starHalfNum = (rating - starFullNum) > 0.2
    var starEmptyNum = starHalfNum ? (4 - starFullNum) : (5 - starFullNum)
    for (let i = 1; i <= starFullNum; i++) {
        starStr += starFull
    }
    if (starHalfNum) {
        starStr += starHalf
    }
    for (let i = 1; i <= starEmptyNum; i++) {
        starStr += starEmpty
    }
    return (starStr)
}

const calculatePrice = (num, discountPercentage) => {
    var price = num - (num * (discountPercentage / 100))
    price = price.toFixed(2)
    return (price)
}

const getData = () => {
    $('.datas').html("")

    data = data.sort((a, b) => a.price - b.price)
    data.slice(0, 9 * pageNum).map((item, key) => {
        var cartBol = true
        var cartItem = cart.filter(x => x.id === item.id)
        var str = ''
        var strImg = ''
        item.images.map((item1, key1) => {
            str += `<button type="button" data-bs-target="#carouselExampleIndicators${key1}" data-bs-slide-to="${key1 + 1}" aria-label="Slide 2"></button>`
            strImg += `
        <div class="carousel-item${key1 === 0 ? ' active' : ''}">
            <img src="${item1}" class="d-block w-100" alt="">
        </div>
    `;
        })
        $('.datas').append(`
      <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="card">
                    <div class="card_img">
                        <div id="carouselExampleIndicators${key}" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-indicators">
                              <button type="button" data-bs-target="#carouselExampleIndicators${key}" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                              ${str}
                           </div>
                            <div class="carousel-inner">
                              <div class="carousel-item active">
                             <div><img src="${item.thumbnail}" class="d-block" alt="..."></div>
                              </div>
                              ${strImg}
                               </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators${key}" data-bs-slide="prev">
                                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators${key}" data-bs-slide="next">
                                <i class="fa fa-chevron-right" aria-hidden="true"></i>
                            </button>
                          </div>
                    </div>
                    <div class="card_text"> 
                        <div class="card_title">
                            <h3>${item.title}</h3>
                            <b>${calculatePrice(item.price, item.discountPercentage)} $ <sup><del>${item.price} $</del></sup></b>
                        </div>
                        <p>
                            ${item.description}
                        </p>
                    </div>
                    <div class="card_stars">
                        ${getStars(item.rating)}
                    </div>
                    <button onclick="addToCart(${key})" class="addCart">
                    ${cartItem.length == 0 ? `<i class="fa fa-shopping-cart" aria-hidden="true"></i>` : `<i class="fa fa-trash" aria-hidden="true"></i>`}
                        
                    </button>
                </div>
            </div>
      `)
    })
    if (pageNum < Math.ceil(data.length / 9)) {
        $('.btnBox').html('<button onclick="addPage()" class="btn btn-primary">Show more</button>')
    } else {
        $('.btnBox').html('')
    }
}

const getCategories = () => {
    categories.map((item, key) => {
        $('.categories').append(`<li><input onchange="selectCategory(${key})" class="check check${key}" value="${item}" type="checkbox"/><span>${item}</span></li>`)
    })
}


const selectCategory = (id) => {
    if ($('.check' + id).is(':checked')) {
        selectedCat.push($('.check' + id).val())
    } else {
        selectedCat.splice(selectedCat.indexOf($('.check' + id).val()), 1)
    }
    if (selectedCat.length > 0) {
        $('.checkAll').prop('checked', false)
    } else {
        $('.checkAll').prop('checked', true)
        selectedCat = []
    }
    if (selectedCat.length === categories.length) {
        $('.check').prop("checked", false)
        $('.checkAll').prop('checked', true)
        selectedCat = []
    }
    getDataFilter()
}

const getAll = () => {
    if ($('.checkAll').is(':checked')) {
        $('.check').prop("checked", false)
        $('.checkAll').prop('checked', true)
        selectedCat = []
    } else {
        if (selectedCat.length === 0) {
            $('.checkAll').prop('checked', true)
            selectedCat = []
        }
    }
    getDataFilter()
}

const getDataFilter = () => {
    if (selectedCat.length == 0) {
        data = Data
    } else {
        data = Data.filter(x => selectedCat.indexOf(x.category) != -1)
    }
    pageNum = 1
    getData()
}

const addPage = () => {
    pageNum++
    getData()
}

const addToCart = (id) => {
    var g = null
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == data[id].id) {
            g = i
            break;
        }
    }

    if (g == null) {
        cart.push(data[id])
        cartNumbers.push(1)
    } else {
        cart.splice(g, 1)
        cartNumbers.splice(g, 1)
    }
    getData()
    $('.cartNum').html(cart.length)
}

const openCart = () => {
    $('.cartBox').removeClass("disabledBox")
    $('.marketBox').addClass("disabledBox")
    getCartData()
}

const closeCart = () => {
    getData()
    $('.marketBox').removeClass("disabledBox")
    $('.cartBox').addClass("disabledBox")
}

const getCartData = () => {
    $('.cartRow').html('')
    cart.map((item, key) => {
        $('.cartRow').append(`<div class="cartCol">
        <div class="cartDiv">
              <div class="cartColDiv cartImg">
                  <img src="${item.images[0]}"/>
              </div>
              <div class="cartColDiv cartText">
                  <h1>${item.title}</h1>
                  <p>${calculatePrice(item.price, item.discountPercentage)} $</p>
              </div>
          </div>
              <div class="cartColDiv cartNumbers number_cart_${key}">
                  <button onclick="reduceNumberCart(${key})" class="btnCart reduceBtn">
                  ${cartNumbers[key] == 1 ? deleteIcon : minusIcon}
                  </button>
                  <h2>${cartNumbers[key]}</h2>
                  <button onclick="addNumberCart(${key})" class="btnCart addBtn"><i class="fa fa-plus" aria-hidden="true"></i></button>
              </div>
         
      </div>`)
    })
    getCheckCart()
}
const getCheckCart = () => {
    $('.cartCheck').html('')
    var totalPrice = 0

    cart.map((item, key) => {
        var price = calculatePrice(item.price, item.discountPercentage)
        var count = cartNumbers[key]
        var allPrice = Number((price * count).toFixed(2))
        totalPrice += allPrice
        $('.cartCheck').append(`<div class="checkItem">
        <h2>${item.title}: </h2>
        <p>${price}$ x ${count} = ${allPrice}$</p>
    </div>`)
    })
    totalPrice = totalPrice.toFixed(2)
    $('.cartCheck').append(` <div class="checkAllItem">
    <h1>Total:</h1>
    <p class="allItemNumber">${totalPrice}$</p>
</div>`)

}
const addNumberCart = (id) => {
    cartNumbers[id] = cartNumbers[id] + 1
    console.log(cartNumbers[id])
    $(`.number_cart_${id} h2`).html(cartNumbers[id])
    $(`.number_cart_${id} .reduceBtn`).html(minusIcon)
    getCheckCart()
}

const reduceNumberCart = (id) => {
    cartNumbers[id] = cartNumbers[id] - 1
    if (cartNumbers[id] == 0) {
        cart.splice(id, 1)
        cartNumbers.splice(id, 1)
        $('.cartNum').html(cart.length)
        getCartData()
    } else {
        if (cartNumbers[id] == 1) {
            $(`.number_cart_${id} .reduceBtn`).html(deleteIcon)
        }
        $(`.number_cart_${id} h2`).html(cartNumbers[id])
    }
    getCheckCart()

}
