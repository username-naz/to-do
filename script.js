//create item
document.querySelector('.create-item')
    .addEventListener('click', (e)=>{
        e.preventDefault();
        document.querySelector('.create-item-form').style.display = 'block';
    });





//form


document.querySelector('.add-item')
    .addEventListener('click', (e)=>{
        e.preventDefault();
    });

document.querySelector('.cancel')
.addEventListener('click', (e)=>{
    e.preventDefault();
    document.querySelector('.create-item-form').style.display = 'none';
});


