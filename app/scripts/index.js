// @flow

document.addEventListener('DOMContentLoaded', (): void => {
  // LOADED
  document.body.classList.add('loaded')

  // MODAL
  if (document.querySelector('#product-modal')) {
    Array.prototype.forEach.call(document.querySelectorAll('.Product'), (product): void => {
      product.addEventListener('click', (e: Event): void => {
        e.preventDefault()

        // 1. Fetch data
        // 2. Upate modal info
        // 3. Display it
        const productData: Promise = fetch(product.getAttribute('href'))
        productData
          .then((response: Response): void => response.json())
          .then((data: object): void => {
            console.log(data)

            new Modal({ el: document.querySelector('#product-modal') }).show();
          })
          .catch((error: any): void => {
            console.error(Error(error))
          })
      })
    })
  }

  // AUTOCOMPLETE
  if (document.querySelector('.Search')) {
    // Init autocmplete
  }

  // FILTERS
})
