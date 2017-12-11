$(document).ready(function () {

    var myWebCams = document.getElementById("myVideo").autoplay;

    var randomCam = Math.floor(Math.random() * myWebCams.length);

    var maxLimit = 50;
    var myOffset = 0;

    var countryCodeObjectArray = [];

    /* this is an array of objects
    var liveWebCams = {
        countryCode: "",
        countryName: "",
        totalCams: 0,
        webcams: []
    };
    */
    var countryWithLiveWebCams = [];
    var countryLiveWebCams = 0;
    var countryCode = "";

    var webCamObjectList = [];
    var test;

    // ISO 3166-1-alpha-2 - country codes
    function getCountryCodes() {
        var offset = myOffset;
        var limit = maxLimit;
        $.ajax({
            url: "https://restcountries.eu/rest/v2/all",
            type: "GET",
            success: function (data) {
                console.log(data);
                console.log("country Code Count: " + data.length);
                for ( var i = 0; i < data.length; i++) {
                    var countryObject = {
                        name: "",
                        code: ""
                    };
                    // only interested in the alpha 2 country code
                    // for the webcams travel api
                    countryObject.name = data[i].name;
                    countryObject.code = data[i].alpha2Code;
                    countryCodeObjectArray.push(countryObject);
                    queryWebCamList(countryCodeObjectArray[i], offset, limit);
                }
                console.log("countryCodeList: " + countryCodeObjectArray.toString());
               // renderButtons();
                return(countryWithLiveWebCams);
                
            },
            error: function () {
                console.log("error getting country codes");
            }
        });
    }

    // curl --get --include 'https://webcamstravel.p.mashape.com/webcams/list/category=beach?lang=en&show=webcams%3Aimage%2Clocation' -H 'X-Mashape-Key: JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP'
    function queryWebCamList(country, offset, limit) {
        console.log("countryCode: " + countryCode);
        console.log("limit: " + limit);
        console.log("offset: " + offset);
        //curl --get --include 'https://webcamstravel.p.mashape.com/webcams/list/continent=AF?lang=en&show=webcams%3Aimage%2Clocation' -H 'X-Mashape-Key: JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP'
        var key = "JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP";
        $.ajax({
           url: "https://webcamstravel.p.mashape.com/webcams/list/country=" + country.code + "/property=live/limit=" + limit + "," + offset + "?lang=en&show=webcams%3Aimage%2Clocation%2Curl",
           
            headers: {"X-Mashape-Key": key},
            type: 'GET',
            dataType: 'json',
            processData: false,
            success: function (data) {
            console.log(data);
              if (data.result.total) {
                var liveWebCams = {
                    countryCode: "",
                    countryName: "",
                    totalCams: 0,
                   // webcams: []
                };
                if (data.result.total) {
                    console.log(data);
                    liveWebCams.countryCode = country.code;
                    liveWebCams.countryName = country.name;
                    liveWebCams.totalCams = data.result.total;
                   // liveWebCams.webcams = data.result.webcams;
                    countryWithLiveWebCams.push(liveWebCams);
                    renderButton(liveWebCams);
                }
                
              }

            },
            error: function(){
              alert("Cannot get data");
            }
        });
    }

    function renderButton(webcam) {
        var offset = 0;
        var limit = maxLimit;

        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var $button = $("<button>");
        // set the class
        $button.addClass("btn btn-primary country-code m-1");
        $button.attr("type", "button");
        // Adding a data-attribute
        $button.attr("data-name", webcam.countryCode);
        // Providing the initial button text
        $button.text(webcam.countryName + "(" + webcam.countryCode + ")" + "(" + webcam.totalCams + ")");
        // Adding the button to the buttons div
        $("#buttons").append($button);
    }
    getCountryCodes();


    // Adding a click event listener to all elements with a class of "animal"
    $(document).on("click", ".country-code", function () {
        //countryCode = $(this).attr("data-name");

       // console.log("searchTerm: " + countryCode);
        // initial query
        // this will tell me how many web cams
       // myOffset = 0;
       queryWebCamList(countryCode, myOffset, maxLimit);
       
    });

    $(document).on("click", "#next-button", function () {
        console.log('Total Cams: ' + totalLiveWebCams);
        if (totalLiveWebCams > 0) {
            var temp = myOffset + maxLimit;
            if (temp > totalLiveWebCams) {
                myOffset = myOffset + (totalLiveWebCams - myOffset);
            } else {
                myOffset = myOffset + maxLimit;
            }
        }
        console.log("myOffset: " + myOffset);
        queryWebCamList(countryCode, myOffset, maxLimit);
    });

    function makeNewThumbnail() {

        $(".thumbnail").empty();

        for(var i = 0; i < myWebCams.length; i++) {
    
            var newThumbnail = $("<img>");
            newThumbnail.addClass("");
            newThumbnail.text(webCam[i]);
            $(".thumbnail").append(newThumbnail);

   }}; 

});
