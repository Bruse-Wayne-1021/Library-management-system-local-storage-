const contuctUs = JSON.parse(localStorage.getItem('contuctUs')) || [];

document.getElementById('submit-btn').addEventListener('click' , ()=>{
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const today = new Date();

    contuctUs.push({name,email,message,date:today})
    localStorage.setItem('contuctUs' , JSON.stringify(contuctUs))
     document.getElementById('name').value = ""
     document.getElementById('email').value = ""
     document.getElementById('message').value = ""
})