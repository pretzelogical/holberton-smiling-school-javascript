$(function () {
  let carouselsCreated = 0;
  function getQuotesFromAPI(elem) {
    $.getJSON("https://smileschool-api.hbtn.info/quotes")
      .done(function (quotes) {
        console.log(quotes);
        const container = elem.children().first();
        container.empty();
        const carousel = $(
          '<div class="carousel slide" id="carouselExampleControls" data-ride="carousel">'
        ).append('<div class="carousel-inner">');
        const carouselInner = carousel.children().first();
        for (const quote of quotes) {
          const itemClass =
            quote === quotes[0] ? "carousel-item active" : "carousel-item";
          console.log(itemClass);
          carouselInner.append(
            $(`<div class="${itemClass}">`).append(
              $('<div class="row mx-auto align-items-center">').append(
                $(
                  '<div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">'
                ).append(
                  $(
                    `<img src="${quote.pic_url}" class="d-block align-self-center" alt="Carousel Pic">`
                  )
                ),
                $(
                  '<div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">'
                ).append(
                  $('<div class="quote-text">').append(
                    $('<p class="text-white">').text(quote.text),
                    $('<h4 class="text-white font-weight-bold">').text(
                      quote.name
                    ),
                    $('<span class="text-white">').text(quote.title)
                  )
                )
              )
            )
          );
        }
        carousel.append(
          $(
            '<a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">'
          ).append(
            $(
              '<img src="images/arrow_white_left.png" alt="Quote Previous" aria-hidden="true">'
            ),
            $('<span class="sr-only">Previous</span>')
          ),
          $(
            '<a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">'
          ).append(
            $(
              '<img src="images/arrow_white_right.png" alt="Quote Next" aria-hidden="true">'
            ),
            $('<span class="sr-only">Next</span>')
          )
        );
        container.append(carousel);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function createVideoCard(video) {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i > video.star) {
        stars.push(
          $(
            '<img src="images/star_off.png" alt="star off" width="15px" height="15px">'
          )
        );
      } else {
        stars.push(
          $(
            '<img src="images/star_on.png" alt="star on" width="15px" height="15px">'
          )
        );
      }
    }
    return $('<div class="card">').append(
      $(
        `<img src="${video.thumb_url}" class="card-img-top" alt="Video thumbnail">`
      ),
      $('<div class="card-img-overlay text-center">').append(
        $(
          '<img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay">'
        )
      ),
      $('<div class="card-body">').append(
        $('<h5 class="card-title font-weight-bold">').text(video.title),
        $('<p class="card-text text-muted">').text(video["sub-title"]),
        $('<div class="creator d-flex align-items-center">').append(
          $(
            `<img src="${video.author_pic_url}" alt="Creator of video" width="30px" class="rounded-circle" alt="Creator Pic">`
          ),
          $('<h6 class="pl-3 m-0 main-color">').text(video.author)
        ),
        $('<div class="info pt-3 d-flex justify-content-between">').append(
          $('<div class="rating d-flex">').append(stars),
          $('<div class="main-color">').text(video.duration)
        )
      )
    );
  }

  function createVideoCarousel(videos) {
    const carouselClass = `slickCarousel${carouselsCreated++}`;
    const carousel = $(`<div class="${carouselClass}">`);
    for (const video of videos) {
      carousel.append(
        $("<div>").append(
          $(
            '<div class="d-flex align align-items-center justify-content-center">'
          ).append(createVideoCard(video))
        )
      );
    }
    $(carousel).slick({
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
    return carousel;
  }

  function getVideoCarousel(elem) {
    const elemId = elem.attr("id").split(" ")[0];
    const endpoint = `https://smileschool-api.hbtn.info/${elemId}`;
    console.log(endpoint);
    $.getJSON(endpoint)
      .done(function (videos) {
        const carousel = createVideoCarousel(videos);
        console.log(videos);
        console.log(elem);
        $(`#${elemId} .container .row`).empty();
        $(`#${elemId} .container .row`).append(
          $('<div class="col-12">').append(carousel)
        );
      })
      .fail(function (error) {
        console.log(error);
        throw new Error("Could not retrieve carousel");
      });
  }

  function populateDropdown(dropdown, data) {
    for (const item of data) {
      dropdown.append($(`<a class="dropdown-item" href="#" data-search-option="${item}">`).text(item.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')));
    }
  }

  function resultLoad(videos) {
    function displayLoader(elem) {}
    const res = $('#searchResults');
    const row = $('<div class="row">');
    console.log(videos);
    for (const video of videos) {
      row.append(
        $('<div class="col-12 col-sm-4 col-lg-3 d-flex justify-content-center">')
        .append(createVideoCard(video))
      )
    }

    res.children().first().empty();
    res.children().first().append(row);
    console.log(res.children().first())

    // if (res.data('isLoading') !== true) {

    // }
  }

  function search(e) {
    e.preventDefault();
    const keyword = $("input#textSearch__keyword").val();
    const topic = (($("#bsDropdown__topic").children('a').children().first()).text()).split(' ').map(word => word.toLowerCase()).join('_');
    const sort = (($("#bsDropdown__sortBy").children('a').children().first()).text()).split(' ').map(word => word.toLowerCase()).join('_');
    console.log(keyword, topic, sort);
    $.getJSON('https://smileschool-api.hbtn.info/courses', {q: keyword, topic: topic, sort: sort})
    .done(function (videos) {
      resultLoad(videos.courses);
    })
    .fail(function (error) {
      console.error(error);
    })
  }

  function initSearch(elem) {
    const container = elem.children().first();
    const keywordSearch = $("input#textSearch__keyword");
    const topicSearch = $("#bsDropdown__topic");
    const sortSearch = $("#bsDropdown__sortBy");
    const topicDropdown = $('#bsDropdown__topic .dropdown-menu');
    const sortDropdown = $('#bsDropdown__sortBy .dropdown-menu');

    $.getJSON('https://smileschool-api.hbtn.info/courses')
    .done(function (videos) {
      console.log(videos);
      populateDropdown(topicDropdown, videos.topics);
      populateDropdown(sortDropdown, videos.sorts);
      keywordSearch.on('input', search);
      for (const elem of [topicDropdown, sortDropdown]) {
        for (let child of elem.children()) {
          child = $(child);
          console.log(child);
          child.on('click', function (e) {
            e.preventDefault();
            const display = $(this).parent().parent();
            display.children('a').children().first().text($(this).text());
            console.log(display.children('a').children().first());
            resultLoad(videos.courses);
          })
        }
      }
      resultLoad(videos.courses);
    })
    .fail(function (error) {
      console.error(error);
    })

    console.log(container, keywordSearch, topicSearch, sortSearch);

  }

  function main() {
    const targeted = {
      quotes: getQuotesFromAPI,
      "popular-tutorials": getVideoCarousel,
      "latest-videos": getVideoCarousel,
      search__course: initSearch,
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
      console.log(elem.attr("id").split(" "));
    }
    if ($(".2_homepage_slick").length) {
      $(".2_homepage_slick").slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      });
    }
  }
  main();
});
