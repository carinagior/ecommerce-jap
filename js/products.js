const ORDER_ASC_BY_PRICE = "price->PRICE";
const ORDER_DESC_BY_PRICE = "PRICE->price";
const ORDER_DESC_BY_RELEV = "RELEV->relev";

var productsArray = [];

var minPrice = undefined;
var maxPrice = undefined;

var buscar = undefined;

function showProducts(array) {

    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let product = array[i];

        if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))) {

            if (buscar == undefined || product.name.toLowerCase().indexOf(buscar) != -1) {
                htmlContentToAppend += `
                <a href="product-info.html?producto=` + product.name + `" class="list-group-item list-group-item-action">
                    <div class="row pb-2">
                        <div class="col-3">
                            <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                        </div>
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1">`+ product.name +`</h4>
                                <small class="text-muted">` + product.currency + " " + product.cost + `</small>
                            </div>
                            <p class="mb-1">` + product.description + `</p>
                        </div>
                    </div>
                </a>
                `
            }
        }
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;

    }
}

function sortProducts(criterio, array) {
    let result = [];

    if (criterio === ORDER_ASC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    } else if (criterio === ORDER_DESC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) {
                return -1;
            }
            if (a.cost < b.cost) {
                return 1;
            }
            return 0;
        });
    } else if (criterio === ORDER_DESC_BY_RELEV) {
        result = array.sort(function (a, b) {
            if (a.soldCount > b.soldCount) { return -1; }
            if (a.soldCount < b.soldCount) { return 1; }
            return 0;
        });
    }
    return result;
}

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productsArray = resultObj.data;
            showProducts(productsArray);
        }
    });
    // filtrar por rango
    document.getElementById('filtroProductos').addEventListener("click", function (e) {
        minPrice = document.getElementById('filtroProdCountMin').value;
        maxPrice = document.getElementById('filtroProdCountMax').value;

        if ((minPrice != undefined) && minPrice != '' && parseInt(minPrice) >= 0) {
            minPrice = parseInt(minPrice);
        } else {
            minPrice = undefined
        }

        if ((maxPrice != undefined) && maxPrice != '' && parseInt(maxPrice) >= 0) {
            maxPrice = parseInt(maxPrice);
        } else {
            maxPrice = undefined
        }

        showProducts(productsArray);
    });
    // limpiar filtro
    document.getElementById('limpiarFiltroProd').addEventListener("click", function (e) {
        document.getElementById('filtroProdCountMin').value = '';
        document.getElementById('filtroProdCountMax').value = '';

        minPrice = undefined;
        maxPrice = undefined;

        showProducts(productsArray)
    });
    // barra buscador
    document.getElementById('search').addEventListener('input', function (e) {
        buscar = document.getElementById('search').value.toLowerCase();
        showProducts(productsArray);
    });
    // limpiar busqueda
    document.getElementById('cleanSearch').addEventListener('click', function (e) {
        document.getElementById('search').value = '';
        buscar = undefined;
        showProducts(productsArray);
    });
    // orden ascendente
    document.getElementById('sortAscProd').addEventListener('click', function (e) {
        productsArray = sortProducts(ORDER_ASC_BY_PRICE, productsArray);
        showProducts(productsArray);
    });
    // orden descendente
    document.getElementById('sortDescProd').addEventListener('click', function (e) {
        productsArray = sortProducts(ORDER_DESC_BY_PRICE, productsArray);
        showProducts(productsArray);
    });
    // orden relevancia
    document.getElementById('sortByRelevance').addEventListener('click', function (e) {
        productsArray = sortProducts(ORDER_DESC_BY_RELEV, productsArray);
        showProducts(productsArray);
    });
    // filtro de precio
    document.getElementById('filtro1').addEventListener('click', function (e) {
        minPrice = 0;
        maxPrice = 13000;

        showProducts(productsArray);
    });
    document.getElementById('filtro2').addEventListener('click', function (e) {
        minPrice = 13000;
        maxPrice = 15000;

        showProducts(productsArray);
    });
    document.getElementById('filtro3').addEventListener('click', function (e) {
        minPrice = 15000;
        maxPrice = 999999;

        showProducts(productsArray);
    });
});