//this file contains code that jsut run in the browser
const deleteProduct = btn => {
  console.log('Clicked');
  console.log(btn.parentNode.querySelector('[name=productId]').value);
  const prodId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  const productElement = btn.closest('article');

  //it's a method supported by the browser to send http requests
  fetch('/admin/product/' + prodId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
    .then(result => {
      console.log(result);
      return result.json();
    })
    .then(data => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
      console.log(err);
    });
};
