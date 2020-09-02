//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

sessionStorage.setItem("logged", false);
document.addEventListener("DOMContentLoaded", function (e) {
    document.getElementById('signin').addEventListener('submit', (evento) => {
        evento.preventDefault();
        location.href = "./index.html";
        sessionStorage.setItem("logged", true);

        var email = document.getElementById('email').value;
        localStorage.setItem('cuenta', email);
        return true;

    })
});