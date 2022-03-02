// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
  'use strict'

  /* NASTAVENÍ MULTISELECTů */

  //Nastavení multiselectu Pozice
  $('#vyber-pozice').multiselect({
    buttonWidth: '100%'
  });

  $('.multiselect-wrapper select').on('change', function() {
    var value = $(this).val();
    var name = $(this).attr('name');

    var label = name == 'pozice' ? 'Jiná pozice' : 'Jiná oblast působení';
    var placeholder = name == 'pozice' ? 'Jiná pracovní pozice' : 'Zadejte oblast mimo ČR';
    var invFeedback = name == 'pozice' ? 'Prosíme, doplňte vlastní pozici nebo zrušte zaškrtnutí u položky "jiná (doplňte níže)' : 'Prosíme, doplňte vlastní oblast působení nebo zrušte zaškrtnutí u položky "Mimo ČR (doplňte níže)"';


    if (value.includes('jiná')) {
      var html =
        `<div class="col-12">
        <label for="${name}-jine" class="form-label">${label}</label>
        <input type="text" class="form-control" name="${name}-jine" id="${name}-jine" placeholder="${placeholder}" required>
        <div class="invalid-feedback">
          ${invFeedback}.
        </div>
      </div>`;
      $(`#jina-${name}`).html(html);
    } else {
      $(`#jina-${name}`).html('');
    }
  });

  //Pole okresů
  var okresy = ["Benešov", "Beroun", "Blansko", "Brno-město", "Brno-venkov", "Bruntál", "Břeclav", "Česká Lípa", "České Budějovice", "Český Krumlov", "Domažlice", "Děčín", "Frýdek-Místek", "Havlíčkův Brod", "Hodonín", "Hradec Králové", "Cheb", "Chomutov", "Chrudim", "Jablonec nad Nisou", "Jeseník", "Jihlava", "Jindřichův Hradec", "Jičín", "Karlovy Vary", "Karviná", "Kladno", "Klatovy", "Kolín", "Kroměříž", "Kutná Hora", "Liberec", "Litoměřice", "Louny", "Mladá Boleslav", "Most", "Mělník", "Nový Jičín", "Nymburk", "Náchod", "Olomouc", "Opava", "Ostrava-město", "Pardubice", "Pelhřimov", "Plzeň-jih", "Plzeň-město", "Plzeň-sever", "Prachatice", "Praha", "Praha-východ", "Praha-západ", "Prostějov", "Písek", "Přerov", "Příbram", "Rakovník", "Rokycany", "Rychnov nad Kněžnou", "Semily", "Sokolov", "Strakonice", "Svitavy", "Šumperk", "Tachov", "Teplice", "Trutnov", "Tábor", "Třebíč", "Uherské Hradiště", "Ústí nad Labem", "Ústí nad Orlicí","Vsetín", "Vyškov", "Zlín", "Znojmo", "Žďár nad Sázavou"];

  //Přemapování pole na objekt ve tvaru { value: "Praha", label: "Praha", title: "Praha"}
  var options = okresy.map(okr => {
    return { value: okr, label: okr, title: okr }
  })

  options.unshift({value: "jiná", label: "Mimo ČR (doplňte níže)", title: "Mimo ČR (doplňte níže)"})

  //Vložení předvybrané možnosti "Vyberte okres" (jinak se zobrazí jako předvyplněný první okres)
  //options.push({ value: "", label: "Vyberte okres", selected: true, disabled: true })

  //Nastavení pole lokace + přidání možností pomocí 'dataprovider'
  $('#lokace')
    .multiselect({
      buttonWidth: '100%',
      maxHeight: 200,
      enableFiltering: true,
      includeFilterClearBtn: false,
      enableCaseInsensitiveFiltering: true
    }) //Nastavení multiselectu
    .multiselect('dataprovider', options) //Předvyplnění dat
    .val('').multiselect(); //Fix u single select

  $('#lokace-wrapper .multiselect-selected-text')[0].innerHTML = "Vyberte okres"; //Fix u single select
  $('#lokace-wrapper input[type=radio]').each(function() {
    $(this).prop('checked', false);
  });
  /* Kontrola a odeslání formuláře */
  //Event listener (při odeslání formuláře provede funkci  submitForm)
  $("#main-form").on('submit', submitForm);
})()

function validateMultiselect() {
  //Zobrazení chybových hlášek u multiselectů (případně možné dodat i další CSS třídy)
  //Pro každý div s třídou 'multiselect-wrapper' (naše vlastní třída ručně dopsaná do HTML) provede následující funkce
  var isValid = $(this).is(":invalid");
  $(this).parent().parent().find('.invalid-feedback').toggleClass('d-block', isValid);
  /*
  $('.multiselect-wrapper').each(function() {
    //Ověří zda je <select> platný (má hodnotu, pokud je required)
    var isValid = $(this).find('select').is(":invalid");
    //Zobrazí / skryje '.invalid-feedback' pokud je <select> nevyplněný / vyplněný
    $(this).find('.invalid-feedback').toggleClass('d-block', isValid);
  });*/
}

/* Funkce pro kontrolu a odeslání formuláře */
function submitForm(e) {
  //Zakáže automatické odeslání HTML formuláře (umožní provést vlastní akci)
  e.preventDefault();

  var form = e.target;

  //Zkontroluje, zda jsou všechna pole platná
  var valid = form.checkValidity();

  //Přidání třídy 'was-validated' pro zobrazení chybových hlášek
  form.classList.add('was-validated');

  $('.multiselect-wrapper select').each(validateMultiselect);
  $('.multiselect-wrapper select').on('change', validateMultiselect);

  if (!valid) {
    return
  }

  /* Převedení všech dat z formuláře do objektu */
  var formData = new FormData(e.target);
  var data = Object.fromEntries(formData.entries());
  var jinaPozice = $('#pozice-jine').val();
  data.pozice = $('select#vyber-pozice').val().toString().replace('jiná', jinaPozice); 
  var jinaLokace = $('#lokace-jine').val();
  data.lokace = $('select#lokace').val().toString().replace('jiná', jinaLokace);

  makeRequest("https://script.google.com/macros/s/AKfycbz3RTUFynIJvEELSqm0QU6kd_8KIv0TDOzPwjOjAkeDmOvd12xYZrMeRDDNaC33ZH8J/exec", "POST", JSON.stringify(data))
    .then(res => {
      if (res.response.substring(0, 5) == 'https') {
        top.location.href = res.response;
        $('#main-form').hide();
        $('#message').html(`<div class="card card-body text-center mb-5"><p class="text-center"><img src="img/heart.svg" width="20" height="20" alt="heart" claas="mx-auto my-1"></p> <p class="text-muted">Děkujeme za vyplnění dotazníku.<br> Pokud stahování nezačne automaticky, klikněte na <a href="${res.response}" class="link-secondary">tento odkaz</a>.</p></div>`);
      } else {
        alert(res.response);
      }

    })
    .catch(error => {
      console.log(error);
    });
  $('#main-form').removeClass('was-validated').after('<p class="text-center mt-3" id="message">Stahování začne za okamžik</p>')
}

function makeRequest(url, method, payload = null) {
  var request = new XMLHttpRequest();
  return new Promise(function(resolve, reject) {
    request.onreadystatechange = function() {
      if (request.readyState !== 4) return;
      if (request.status >= 200 && request.status < 300) {
        resolve(request);
      } else {
        reject({
          status: request.status,
          statusText: request.statusText
        });
      }
    };
    request.open(method || 'GET', url, true);
    if (payload) {
      request.setRequestHeader('Content-type', 'text/plain');
    }
    request.send(payload);
  });
};