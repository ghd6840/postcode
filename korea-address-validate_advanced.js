
document.addEventListener("DOMContentLoaded", function(){
    waitForElementToDisplay("country_id",checkCountry,1000,9000);

    // window.addEventListener('hashchange', function () {
    //     if(location.hash == '#payment'){
    //         setTimeout(checkCountry, 3000);
    //     }
    // });
    
});

function checkCountry() {
    var selectCountry = document.getElementsByName('country_id')[0];

    if(!selectCountry)
        return false;

    var idx = selectCountry.selectedIndex;
    var country = selectCountry.options[idx].value;
    
    if(country == 'KR'){
        document.querySelector("input[name='postcode']").parentElement.insertAdjacentHTML('beforeend','<input id="validate-korea" type="button" onclick="validateKoreaPostcode()" value="우편번호 찾기">');
        document.querySelector("input[name='region']").setAttribute("disabled", true);
    }

    document.getElementsByName('country_id')[0].addEventListener("change", function(e){
        var idx = this.selectedIndex;
        var country = this.options[idx].value;
    
        if(country == 'KR'){
            if(!document.getElementById('validate-korea')){
                document.querySelector("input[name='postcode']").parentElement.insertAdjacentHTML('beforeend','<input id="validate-korea" type="button" onclick="validateKoreaPostcode()" value="우편번호 찾기">');
            }
            document.querySelector("input[name='region']").setAttribute("disabled", true);
        }
        else {
            if(document.getElementById('validate-korea')){
                document.getElementById('validate-korea').remove();
            }
            document.querySelector("input[name='region']").removeAttribute("disabled");
        }
    });
}

function validateKoreaPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = '';
            var extraAddr = '';

            if (data.userSelectedType === 'R') {
                addr = data.roadAddress;
            } else {
                addr = data.jibunAddress;
            }

            if(data.userSelectedType === 'R'){
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
            } else {
                // document.getElementById("sample6_extraAddress").value = '';
            }

            var postcode = document.querySelector('input[name="postcode"]');
            var street0 = document.querySelector('input[name="street[0]"]');
            // var region = document.querySelector('input[name="region"]');    // 시,도
            var city = document.querySelector('input[name="city"]');  // 시,군

            /**** Add event for checkout page keyup ****/
            var event = document.createEvent("Events");
            event.initEvent('keyup', true, true);
            event.keyCode == 39;

            postcode.value = data.zonecode;
            postcode.dispatchEvent(event);

            street0.value = addr;
            street0.dispatchEvent(event);

            // region.value = data.sido;
            city.value = data.sido + ' ' + data.sigungu;
            city.dispatchEvent(event);

            
            if(postcode.getAttribute("aria-invalid") == 'true'){
                postcode.setAttribute('aria-invalid', 'false');
                postcode.nextElementSibling.remove();
            }
            if(street0.getAttribute("aria-invalid") == 'true'){
                street0.setAttribute('aria-invalid', 'false');
                street0.nextElementSibling.remove();
            }
            // if(region.getAttribute("aria-invalid") == 'true'){
            //     region.setAttribute('aria-invalid', 'false');
            //     region.nextElementSibling.remove();
            // }
            if(city.getAttribute("aria-invalid") == 'true'){
                city.setAttribute('aria-invalid', 'false');
                city.nextElementSibling.remove();
            }

            document.querySelector('input[name="street[1]"]').focus();
        }
    }).open();
}



function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    // console.log(selector);
    var selectCountry = document.getElementsByName('country_id')[0];
    if (selectCountry != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}