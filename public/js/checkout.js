

window.onload = () => {
    if(!sessionStorage.user){
        location.replace('/login')
    }

    if(location.search.includes('payment=done')){
        let items = [];
        localStorage.setItem('cart', JSON.stringify(items));
        showFormError("Your order is placed");
    }
    if (location.search.includes('payment_fail=true')) {
        showFormError("Some error occured placing your order, please try again");
    }
}



// select place order button
const placeOrderbtn = document.querySelector('.place-order-btn');

placeOrderbtn.addEventListener('click', () => {
    let address = getAddress();

    //send data to backend
    fetch('stripe-checkout', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            items: JSON.parse(localStorage.getItem('cart')),
            address: address,
            email: JSON.parse(sessionStorage.user).email
        })
    })
    .then(res => res.json())
    .then(url => {
        location.href = url;
    })
    .catch(err => console.log(err))
})

const getAddress = () => {
    // form validation
    let address = document.querySelector('#address').value;
    let street = document.querySelector('#street').value;
    let city = document.querySelector('#city').value;
    let state = document.querySelector('#state').value;
    let pincode = document.querySelector('#pincode').value;
    let landmark = document.querySelector('#landmark').value;

    if(!address.length || !street.length || !city.length || !state.length || !pincode.length || !landmark.length){
        return showFormError("Fill all the inputs");
    } else {
        return {address, street, city, state, pincode, landmark }
    }
}