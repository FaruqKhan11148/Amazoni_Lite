const token = localStorage.getItem("token");

fetch("/api/products")
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("products");

    products.forEach(p => {
      container.innerHTML += `
        <div class="card">
          <img src="${p.image_url}" width="150" />
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
        </div>
      `;
    });
  })
  .catch(err => console.log(err));

