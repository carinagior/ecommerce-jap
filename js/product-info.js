var comentariosArray = [];
var relacionados = [];

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

function showComments(array) {
    let comentario = '';
    array.forEach(function (comment) {
        let puntos = '';

        for (let i = 1; i <= comment.score; i++) {
            puntos += `<span class="fa fa-star checked"></span>`;
            }
                    
        for (let i = comment.score + 1; i <= 5; i++) {
            puntos += `<span class="fa fa-star unchecked"></span>`;
            }

        comentario += `<div class="col-12 border rounded m-2 p-2">
                        <div class="row">
                            <div class="col-10" >
                                <small><strong class='user'> ` + comment.user + `</strong></small>
                            </div>
                            <div>
                                <small> ` + comment.dateTime + `</small>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-10">
                                <p>` + comment.description + `</p>
                                <div>${puntos}</div>
                            </div>
                        </div>
                    </div> `;

    });

    document.getElementById('comments').innerHTML = comentario; 
}

document.addEventListener("DOMContentLoaded", function (e) {
    let currentProduct = getQueryVariable("producto");
    document.getElementById('product_name').innerHTML =`<h1 class="display-2">`
                                                        + decodeURIComponent(currentProduct)
                                                        + `</h1>`;

    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        let description = document.getElementById('more_info');
        let carousel = document.getElementById('carousel')
        if (resultObj.status === "ok") {
            let product = resultObj.data;
            description.innerHTML = `
            <div class="container m-auto d-block justify-text-center">
                <p class="lead p-5">`+ product.description + `</p>
            </div>`

            carousel.innerHTML = `
            <div class="carousel-item active">
                <img src="` + product.images[0] + `"class="d-block w-100" alt="...">
            </div>`

            for (let i = 1; i < product.images.length; i++) {
                const image = product.images[i];
                carousel.innerHTML += `
                    <div class="carousel-item">
                        <img src="` + image + `"class="d-block w-100" alt="...">
                    </div>`
            }

            relacionados = product.relatedProducts;
        }
    }) .then(function(){
        getJSONData(PRODUCTS_URL).then(function (resultObj) {
                if (resultObj.status === "ok") {
                    for (let i = 0; i < resultObj.data.length; i++) {
                        let relProd = resultObj.data[i];
                        
                        if (relacionados.includes(i)) {
                           document.getElementById('related_products').innerHTML +=
                           `<div class="card m-auto d-block" style="width: 18rem;">
                                <img class="card-img-top" src="` + relProd.imgSrc + `" alt="Card image cap">
                                <div class="card-body">
                                    <h5 class="card-title">` + relProd.name + `</h5>
                                    <p class="card-text">` + relProd.description + `</p>
                                    <a href="#" class="btn btn-primary">Comprar</a>
                                </div>
                            </div>`;
                        }
                        
                    }
                }
            });
        });

    

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            document.getElementById('number_of_comments').innerHTML = resultObj.data.length;
            comentariosArray = resultObj.data;
            showComments(comentariosArray);
        }
    });

// enviar nuevo comentario

    document.getElementById('enviar_com').addEventListener('click', function (e){

        var currentdate = new Date();
        var dateTime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1) + "-"
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    
        let newComment = {
            score: parseInt(sessionStorage.getItem('score'))+1,
            description: document.getElementById('comment').value,
            user: localStorage.getItem('cuenta'),
            dateTime: dateTime
        }

        comentariosArray.push(newComment);
        showComments(comentariosArray);
        document.getElementById('comment').value = '';
    });

// agregar puntuacion

    var list=['one','two','three','four','five'];
        list.forEach(function(element, posicion) {
            document.getElementById(element).addEventListener("mouseover", function(){
                for (let i = 0; i < list.length; i++) {
                    
                    var cls=document.getElementById(element).className;
                    var star = document.getElementById(list[i]);

                    if(posicion >= i && cls.includes("unchecked")) {
                        star.classList.remove("unchecked");
                        star.classList.add("checked");
                    }   
                    else if (posicion <= i && cls.includes("checked")) {
                        star.classList.remove("checked");
                        star.classList.add("unchecked");
                    }
                    
                } 
            });

            document.getElementById(element).addEventListener("click", function(){

                for (let i = 0; i < list.length; i++) {
                    
                    var cls=document.getElementById(element).className;
                    var star = document.getElementById(list[i]);

                    if(posicion >= i && cls.includes("unchecked")) {
                        star.classList.remove("unchecked");
                        star.classList.add("checked");
                    }   
                    else if (posicion < i && cls.includes("checked")) {
                        star.classList.remove("checked");
                        star.classList.add("unchecked");
                    }
                    
                }

                sessionStorage.setItem('score', posicion);
            });            
        });
    
});