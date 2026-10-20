fetch("https://localhost:7181/products/GetAllProducts")
.then(response => {
    console.log(response)
    return response.json()
})
.then(data => {
    console.log(data)
    let html = ""
    data.map(product => {
        html += `<div class="card" style="width: 18rem;">
  <img src="${product.image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${product.name}</h5>
    <p class="card-text">${product.stock}</p>
    <p class="card-text">${product.description}</p>
    <p class="card-text">${product.price}</p>
    <a href="#" class="btn btn-primary">Menj az oldalára</a>
  </div>
</div>`
    })
    document.getElementById("shop").innerHTML = html
})