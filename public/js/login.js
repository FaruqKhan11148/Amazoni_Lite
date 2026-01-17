async function loginUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem('token', data.token);

    router.get('/', (req, res) => {
      res.render('pages/home');
    });
  } else {
    alert(data.message);
  }
}
