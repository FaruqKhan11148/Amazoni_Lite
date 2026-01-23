document.getElementById("category").addEventListener("change", function () {
  fetch(`/admin/subcategories/${this.value}`)
    .then(res => res.json())
    .then(data => {
      const sub = document.getElementById("subcategory");
      sub.innerHTML = `<option value="">Select Subcategory</option>`;

      data.forEach(s => {
        sub.innerHTML += `<option value="${s.id}">${s.name}</option>`;
      });
    });
});
