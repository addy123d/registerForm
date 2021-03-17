// const { default: fetch } = require("node-fetch");

    // Form data
    const name = document.querySelector("#name");
    const email = document.querySelector("#email");
    const contact = document.querySelector("#contact");
    const clgname = document.querySelector("#clgname");
    const branch = document.querySelector("#branch");


    const button = document.getElementById("loader");
    const loading = document.querySelector(".loading-1");
    const icon = document.querySelector(".fa-paper-plane");
    const contactNumber = document.querySelector("#contact");
    const publicStripeKey = "pk_test_51HdNR5C6SLkEa44zG7m6rbgIKGz8nYcZICdMuKnQoU4JH03CW1Se5kKtlu4wiAJUrzRzG7ZpXst55d50wEl2lMUI00yLUVByM1";

    // Payment Gateway
    var stripe = Stripe(publicStripeKey);

    // Check for external error !
    if (error === "Failed") {
        document.querySelector(".notify").classList.toggle("active");
        document.querySelector(".notify").innerHTML = `<h2>Failed ! ❌</h2>`;

        setTimeout(() => {
            document.querySelector(".notify").classList.toggle("active");
        }, 5000)
    }else{
        if(error === "Already Registered !"){
            document.querySelector(".notify").classList.toggle("active");
            document.querySelector(".notify").innerHTML = `<h2>Already Registered ! 🤷‍♂️</h2>`;

            setTimeout(() => {
                document.querySelector(".notify").classList.toggle("active");
                loading.style.opacity = "0";
            }, 5000)
        }
    }

    button.addEventListener("click", () => {
        console.log("Hit")
        loading.style.opacity = "1";
        // icon.style.display = "none";

        if (name.value && email.value.includes("@") && contact.value.length === 10 && clgname.value && branch.value) {

            const options = {
                method: "POST",
                body: JSON.stringify({
                    name: name.value,
                    email: email.value,
                    contact: contact.value,
                    clgname: clgname.value,
                    branch: branch.value
                }),
                headers: new Headers({ 'Content-Type': 'application/json' })
            }

            fetch('/registerDetails', options)
                .then(res => res.json())
                .then((result) => {
                    console.log(result);
                    const { message, type } = result;

                    if (message.includes("Error")) {
                        if (type === "userexists") {
                            document.querySelector(".notify").classList.toggle("active");
                            document.querySelector(".notify").innerHTML = `<h2>Already Registered ! 🤷‍♂️</h2>`;

                            setTimeout(() => {
                                document.querySelector(".notify").classList.toggle("active");
                                loading.style.opacity = "0";
                            }, 5000)
                        }
                    }else{
                        location.href= `${location.href}/success?contact=${contactNumber.value}&id=${uuidv4()}`;
                        // fetch(`/pay?contact=${contactNumber.value}&email=${email.value}`).then(res=>res.json()).then(result=>{
                        //     console.log(JSON.parse(result))
                        //     const paymentDetails = JSON.parse(result);

                        //     location.href= `${location.href}/success?contact=${contactNumber.value}&id=${uuidv4()}`;
                            
                        // })
                        //     .catch(err=>console.log(err));
                    }

                })
                .catch(err => console.error(err));
        } else {
            document.querySelector(".notify").classList.toggle("active");
            document.querySelector(".notify").innerHTML = `<h2>Incomplete Form ! 🤷‍</h2>`;

            setTimeout(() => {
                document.querySelector(".notify").classList.toggle("active");
                loading.style.opacity = "0";
            }, 2000)
        }

    })


