document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: name.value,
    email: email.value,
    message: message.value
  };

  await fetch("http://localhost:4000/contact", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });

  alert("Message Sent 🚀");
});