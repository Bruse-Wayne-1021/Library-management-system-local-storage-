document.getElementById('registerForm').addEventListener('submit', async (e)=>{
    e.preventDefault();

    const admin="http://localhost:3000/admin";
    const member="http://localhost:3000/member";

    let role=document.getElementById('role').value;
    let firstname=document.getElementById('firstname').value;
    let lastname =document.getElementById('lastname').value;
    let email=document.getElementById('email').value;
    let nationalId=document.getElementById('nationalId').value;
    let contactNo=document.getElementById('contactNo').value;
    let password=document.getElementById('password').value;
    let confirmPassword=document.getElementById('confirmPassword').value;


    const user={
        role,
        firstname,
        lastname,
        email,
        nationalId,
        contactNo,
        password,
        confirmPassword,
        registerdDate:new Date().toLocaleDateString()
    }

    if(password !==confirmPassword){
        alert("password Doesnot match")
        return
    }

    try {
        
            const ApiEnd=(role==="admin")? admin:member;

            const Response=await fetch(ApiEnd,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(user)
            })
            


    } catch (error) {
        alert("some error while in  register :" +error)
    }

})