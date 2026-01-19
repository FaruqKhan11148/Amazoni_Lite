async function signupUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({name, email, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Signup successful! Please login.");
    window.location.href = "/login";
  } else {
    alert(data.message);
  }
}
