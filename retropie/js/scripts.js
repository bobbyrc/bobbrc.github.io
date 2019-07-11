let slideIndex = 0
slideshow()

function slideshow() {
  let i
  let x = document.getElementsByClassName("gameSlide")
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none"
  }
  slideIndex++
  if (slideIndex > x.length) {
    slideIndex = 1
  }
  x[slideIndex - 1].style.display = "block"
  setTimeout(slideshow, 5000) // Change image every 5 seconds
}

function getContactForm() {
  event.preventDefault()

  const inputName = document.getElementById("name").value
  const inputEmail = document.getElementById("email").value
  const inputPhone = document.getElementById("phone").value

  validateContactInfo(inputName, inputEmail, inputPhone)
}

function validateContactInfo(name, email, phone) {
  const splitEmail = email.split("@")
  let tempPhone = []
  let splitPhone = []

  name = name.trim()
  if (!name.includes(" ")) {
    alert("Please include both your first and last name in the name field.")
    return
  }

  if (!splitEmail[1].includes(".")) {
    alert(
      "Please ensure that your email address has a trailing domain (Ex: .com, .org, .net)"
    )
    return
  }

  if (
    !phone.includes("(") ||
    !phone.includes(")") ||
    !phone.includes(" ") ||
    !phone.includes("-")
  ) {
    alert(
      "Please check the formatting of your phone number. Example: (555) 555-5555"
    )
    return
  }

  tempPhone = phone.split(" ")
  console.log(tempPhone)

  if (
    tempPhone[0].length !== 5 ||
    tempPhone[1].length !== 8 ||
    !tempPhone[0].includes("(") ||
    !tempPhone[0].includes(")") ||
    !tempPhone[1].includes("-")
  ) {
    alert(
      "Please check the formatting of your phone number. Example: (555) 555-5555"
    )
    return
  }

  splitPhone[0] = tempPhone[0].slice(1, 4)
  splitPhone[1] = tempPhone[1].split("-")[0]
  splitPhone[2] = tempPhone[1].split("-")[1]
  console.log(splitPhone)

  if (
    Number.isInteger(splitPhone[0]) ||
    Number.isInteger(splitPhone[1]) ||
    Number.isInteger(splitPhone[2]) ||
    splitPhone[1].length !== 3 ||
    splitPhone[2].length !== 4
  ) {
    alert(
      "Please check the formatting of your phone number. Example: (555) 555-5555"
    )
    return
  }
}
