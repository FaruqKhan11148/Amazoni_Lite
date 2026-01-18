const token = localStorage.getItem("token");

fetch("http://localhost:5000/api/products", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }
})
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
