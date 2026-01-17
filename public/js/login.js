async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    // cookie is set by backend automatically
    window.location.href = "/products"; // redirect to home
  } else {
    alert(data.message);
  }
}
