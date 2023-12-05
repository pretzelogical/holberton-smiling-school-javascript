$(function () {
  function getQuotesFromAPI(elem) {
    $.getJSON('https://smileschool-api.hbtn.info/quotes')
    .done(function (quotes) {
      console.log(quotes);
      const container = elem.children().first();
      container.empty();
      const carousel = $('<div class="carousel slide" id="carouselExampleControls" data-ride="carousel">')
                       .append('<div class="carousel-inner">');
      const carouselInner = carousel.children().first();
      for (const quote of quotes) {
        const itemClass = quote === quotes[0] ? 'carousel-item active' : 'carousel-item';
        console.log(itemClass);
        carouselInner.append(
          $(`<div class="${itemClass}">`).append(
            $('<div class="row mx-auto align-items-center">').append(
              $('<div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">').append(
                $(`<img src="${quote.pic_url}" class="d-block align-self-center" alt="Carousel Pic">`)
              ),
              $('<div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">').append(
                $('<div class="quote-text">').append(
                  $('<p class="text-white">').text(quote.text),
                  $('<h4 class="text-white font-weight-bold">').text(quote.name),
                  $('<span class="text-white">').text(quote.title)
                )
              )
            )
          )
        )
      }
      carousel.append(
        $('<a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">').append(
          $('<img src="images/arrow_white_left.png" alt="Quote Previous" aria-hidden="true">'),
          $('<span class="sr-only">Previous</span>')
        ),
        $('<a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">').append(
          $('<img src="images/arrow_white_right.png" alt="Quote Next" aria-hidden="true">'),
          $('<span class="sr-only">Next</span>')
        )
      );
      container.append(carousel);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function main() {
    const targeted = {
      'quotes': getQuotesFromAPI
    };
    const elems = [];
    for (const target of Object.keys(targeted)) {
      const elem = $(`section#${target}`);
      if (elem.length) {
        elems.push(elem);
        targeted[target](elem);
      }
    }
    for (const elem of elems) {
      console.log(elem.attr('id').split(' '));
    }
    $('.slickCarousel1').slick({
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
          }
        }
      ]
    })
  }
  main();
});
