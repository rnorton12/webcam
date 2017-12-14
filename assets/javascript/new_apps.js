$(document).ready(function () {
    var maxLimit = 10;
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
    var currentCountryObject = {};
    var currentArrayIndex = 0; // index into array of current country with live webCams

    // disable the Back button on the page so it is not clickable
    function disableBackButton() {
        $("#back-button").prop("disabled", true);
    }

    // enable the Back button on the page so it is clickable
    function enableBackButton() {
        $("#back-button").prop("disabled", false);
    }

    // disable the Next button on the page so it is not clickable
    function disableNextButton() {
        $("#back-button").prop("disabled", true);
    }

    // enable the Next button on the page so it is clickable
    function enableNextButton() {
        $("#back-button").prop("disabled", false);
    }

    // display random webcams
    function displayRandomWebcam() {

        var key = "JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP";

        $.ajax({
            url: "https://webcamstravel.p.mashape.com/webcams/list/orderby=random&limit=1",
            headers: {
                "X-Mashape-Key": key
            },
            type: "GET",
            success: function (response) {
                console.log(response);
            }
        });

        //$("#embedded-video").appendTo($());
    }
    displayRandomWebcam();
    // need work to display automatically to webpage

    // var index = $(this).attr("value");
    //         var webCamId = $(this).attr("value");
    //         var webCamTitle = $(this).attr("name");
    //         var webCamObject = getWebcamById(webCamId);

    //         if (webCamObject !== undefined) {
    //             // sample: <a name="lkr-timelapse-player" data-id="1010244116" data-play="live" href="https://lookr.com/1010244116" target="_blank">Lausanne › South-East: Place de la Palud</a><script async type="text/javascript" src="https://api.lookr.com/embed/script/player.js"></script>
    //             var $webCam = $("<a>");
    //             $webCam.attr("name", "lkr-timelapse-player");
    //             $webCam.attr("data-id", webCamId);
    //             $webCam.attr("data-play", "live");
    //             $webCam.attr("href", webCamObject.player.live.embed);
    //             $webCam.attr("target", "_blank");
    //             $webCam.text(webCamTitle);

    //             $("#embedded-video").empty();
    //             $("#embedded-video").append($webCam);
    //             $("#embedded-video").append('<script async type="text/javascript" src="https://api.lookr.com/embed/script/player.js"></script>');
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
                for (var i = 0; i < data.length; i++) {
                    var countryObject = {
                        name: "",
                        code: ""
                    };
                    // only interested in the alpha 2 country code
                    // for the webcams travel api
                    countryObject.name = data[i].name;
                    countryObject.code = data[i].alpha2Code;
                    countryCodeObjectArray.push(countryObject);
                    queryWebCamsByCountry(countryCodeObjectArray[i], offset, limit);
                }
            },
            error: function () {
                console.log("error getting country codes");
            }
        });
    }

    // curl --get --include 'https://webcamstravel.p.mashape.com/webcams/list/category=beach?lang=en&show=webcams%3Aimage%2Clocation' -H 'X-Mashape-Key: JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP'
    function queryWebCamsByCountry(countryObject, limit) {
        //curl --get --include 'https://webcamstravel.p.mashape.com/webcams/list/continent=AF?lang=en&show=webcams:player%3Aimage%2Clocation' -H 'X-Mashape-Key: JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP'
        var key = "JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP";
        $.ajax({
            url: "https://webcamstravel.p.mashape.com/webcams/list/country=" +
                countryObject.code +
                "/property=live/limit=" +
                limit +
                ",0" + // offset
                "?lang=en&show=webcams%3Aimage%2Clocation%2Curl%2Cplayer",

            headers: {
                "X-Mashape-Key": key
            },
            type: "GET",
            dataType: "json",
            processData: false,
            success: function (data) {

                if (data.result.total) {
                    console.log(data);
                    var liveWebCams = {
                        countryCode: "",
                        countryName: "",
                        totalCams: 0,
                        webcams: []
                    };
                    liveWebCams.countryCode = countryObject.code;
                    liveWebCams.countryName = countryObject.name;
                    liveWebCams.totalCams = data.result.total;
                    liveWebCams.webcams = data.result.webcams;
                    var newLength = countryWithLiveWebCams.push(liveWebCams);
                    renderButton(liveWebCams, (newLength - 1));
                }
            },
            error: function () {
                console.log("Cannot get data");
            }
        });
    }

    function queryWebcamsByOffset(webcamObject, offset, limit, fwd) {
        //curl --get --include 'https://webcamstravel.p.mashape.com/webcams/list/continent=AF?lang=en&show=webcams%3Aimage%2Clocation' -H 'X-Mashape-Key: JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP'
        var key = "JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP";
        $.ajax({
            url: "https://webcamstravel.p.mashape.com/webcams/list/country=" +
                webcamObject.countryCode +
                "/property=live/limit=" +
                limit +
                "," +
                offset +
                "?lang=en&show=webcams%3Aimage%2Clocation%2Curl%2Cplayer",

            headers: {
                "X-Mashape-Key": key
            },
            type: "GET",
            dataType: "json",
            processData: false,
            success: function (data) {

                webcamObject.webcams = [];
                webcamObject.webcams = data.result.webcams;
                if (fwd) {
                    webcamObject.webCamsRemaining.next = webcamObject.webCamsRemaining.next - data.result.webcams.length;
                    webcamObject.webCamsRemaining.back = offset;
                } else {
                    webcamObject.webCamsRemaining.next = webcamObject.totalCams - webcamObject.webCamsRemaining.back;
                    webcamObject.webCamsRemaining.back = offset;
                }

                console.log("next: " + webcamObject.webCamsRemaining.next);
                console.log("back: " + webcamObject.webCamsRemaining.back);

                renderTableDetails(webcamObject);
                renderMap(webcamObject);
            },
            error: function () {
                console.log("Cannot reach data");
            }
        });

        if (fwd) {
            enableNextButton();
        } else {
            enableBackButton();
        }
        return webcamObject;
    }

    function renderButton(webcamObject, index) {
        var offset = 0;
        var limit = maxLimit;
        console.log(JSON.stringify(webcamObject));
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var $list = $("<a>");
        // set the class
        $list.addClass("dropdown-item country-code m-1");
        $list.attr("href", "#");
        // Adding a data-attribute
        $list.attr("data-name", webcamObject.countryCode);
        $list.attr("value", index);
        // Providing the initial button text
        $list.text(
            webcamObject.countryName //+
        //"(" +
        //webcamObject.countryCode +
        //")" +
        //"(" +
        //webcamObject.totalCams +
        //")"
        );
        // Adding the list to the list div
        $("#list").append($list)

    }

    // {"countryCode":"AL","countryName":"Albania","totalCams":1,"webcams":[{"id":"1496005860","status":"active","title":"Tirana: Skanderbeg Square","image":{"current":{"icon":"https://images.webcams.travel/icon/1496005860.jpg","thumbnail":"https://images.webcams.travel/thumbnail/1496005860.jpg","preview":"https://images.webcams.travel/preview/1496005860.jpg","toenail":"https://images.webcams.travel/thumbnail/1496005860.jpg"},"daylight":{"icon":"https://images.webcams.travel/daylight/icon/1496005860.jpg","thumbnail":"https://images.webcams.travel/daylight/thumbnail/1496005860.jpg","preview":"https://images.webcams.travel/daylight/preview/1496005860.jpg","toenail":"https://images.webcams.travel/daylight/thumbnail/1496005860.jpg"},"sizes":{"icon":{"width":48,"height":48},"thumbnail":{"width":200,"height":112},"preview":{"width":400,"height":224},"toenail":{"width":200,"height":112}},"update":1512921712},"location":{"city":"Tirana","region":"Tiranë","region_code":"AL.50","country":"Albania","country_code":"AL","continent":"Europe","continent_code":"EU","latitude":41.327398,"longitude":19.818828,"timezone":"Europe/Tirane"},"url":{"current":{"desktop":"https://www.webcams.travel/webcam/1496005860-tirana-skanderbeg-square","mobile":"https://m.webcams.travel/webcam/1496005860-tirana-skanderbeg-square"},"daylight":{"desktop":"https://www.webcams.travel/webcam/1496005860-tirana-skanderbeg-square/daylight","mobile":"https://m.webcams.travel/webcam/1496005860-tirana-skanderbeg-square/daylight"},"edit":"https://lookr.com/edit/1496005860"}}]}
    function renderTableSummary(webcamObject) {
        var tableHeadingArray = ["Country Code", "Country Name", "Total Live Cameras"];
        var tableDataArray = [webcamObject.countryCode, webcamObject.countryName, webcamObject.totalCams];
        var $table = $("<table>");
        var $tableHeadRow = $("<tr>");

        // generate table headers
        for (var i = 0; i < tableHeadingArray.length; i++) {
            var $tableHead = $("<th>");
            $tableHead.attr("scope", "col");
            $tableHead.text(tableHeadingArray[i]);
            $tableHeadRow.append($tableHead);
        }
        $table.append($tableHeadRow);

        // generate table data
        var $tableDataRow = $("<tr>");
        for (var i = 0; i < tableDataArray.length; i++) {
            var $tableCol = $("<td>");
            $tableCol.text(tableDataArray[i]);
            $tableDataRow.append($tableCol);
        }
        $table.append($tableDataRow);

        $("#table-summary").empty();
        $("#table-summary").append($table);
    }

    // {"countryCode":"AL","countryName":"Albania","totalCams":1,"webcams":[{"id":"1496005860","status":"active","title":"Tirana: Skanderbeg Square","image":{"current":{"icon":"https://images.webcams.travel/icon/1496005860.jpg","thumbnail":"https://images.webcams.travel/thumbnail/1496005860.jpg","preview":"https://images.webcams.travel/preview/1496005860.jpg","toenail":"https://images.webcams.travel/thumbnail/1496005860.jpg"},"daylight":{"icon":"https://images.webcams.travel/daylight/icon/1496005860.jpg","thumbnail":"https://images.webcams.travel/daylight/thumbnail/1496005860.jpg","preview":"https://images.webcams.travel/daylight/preview/1496005860.jpg","toenail":"https://images.webcams.travel/daylight/thumbnail/1496005860.jpg"},"sizes":{"icon":{"width":48,"height":48},"thumbnail":{"width":200,"height":112},"preview":{"width":400,"height":224},"toenail":{"width":200,"height":112}},"update":1512921712},"location":{"city":"Tirana","region":"Tiranë","region_code":"AL.50","country":"Albania","country_code":"AL","continent":"Europe","continent_code":"EU","latitude":41.327398,"longitude":19.818828,"timezone":"Europe/Tirane"},"url":{"current":{"desktop":"https://www.webcams.travel/webcam/1496005860-tirana-skanderbeg-square","mobile":"https://m.webcams.travel/webcam/1496005860-tirana-skanderbeg-square"},"daylight":{"desktop":"https://www.webcams.travel/webcam/1496005860-tirana-skanderbeg-square/daylight","mobile":"https://m.webcams.travel/webcam/1496005860-tirana-skanderbeg-square/daylight"},"edit":"https://lookr.com/edit/1496005860"}}]}
    function renderTableDetails(webcamObject) {
        var tableHeadingArray = ["ID", "Status", "Title", "Thumbnail", "City", "Map", "url"];
        var $table = $("<table>");
        var $tableHeadRow = $("<tr>");

        // generate table headers
        for (var i = 0; i < tableHeadingArray.length; i++) {
            var $tableHead = $("<th>");
            $tableHead.attr("scope", "col");
            $tableHead.text(tableHeadingArray[i]);
            $tableHeadRow.append($tableHead);
        }
        $table.append($tableHeadRow);

        // generate table data
        for (var i = 0; i < webcamObject.webcams.length; i++) {
            var $tableRow = $("<tr>");
            $tableRow.attr("height", "100%");

            var $tableCol1 = $("<td>");
            $tableCol1.text(webcamObject.webcams[i].id);

            var $tableCol2 = $("<td>");
            $tableCol2.text(webcamObject.webcams[i].status);

            var $tableCol3 = $("<td>");
            $tableCol3.text(webcamObject.webcams[i].title);

            var $tableCol4 = $("<td>");
            var $image = $("<img>");
            $image.attr("src", webcamObject.webcams[i].image.current.thumbnail);
            $image.attr("alt", "camera image");
            $image.attr("width", "20px");
            $image.attr("height", "20px");
            $tableCol4.append($image);

            var $tableCol5 = $("<td>");
            $tableCol5.text(webcamObject.webcams[i].location.city);

            // insert Map here
            var $tableCol6 = $("<td>");
            $tableCol6.attr("height", "300px");
            $tableCol6.attr("width", "300px");
            var $mapImage = $("<div>");
            $mapImage.addClass("map-image");
            var $mapDiv = $("<div>");
            $mapDiv.attr("id", "map-" + i);
            $mapDiv.attr("style", "position: relative; overflow: hidden; width: 300px; height: 300px;");
            $($mapImage).append($mapDiv);
            $($tableCol6).append($mapImage);

            var $tableCol7 = $("<td>");
            if (webcamObject.webcams[i].player.live.available) {
                var $button = $("<button>");
                // set the class
                $button.addClass("btn btn-primary view-webcam m-1");
                $button.attr("id", "live-webcam");
                $button.attr("type", "button");
                // Adding a data-attribute
                $button.attr("value", webcamObject.webcams[i].id);
                $button.attr("name", webcamObject.webcams[i].title);
                // Providing the initial button text
                $button.text("Live");
                $tableCol7.append($button);
            }

            if (webcamObject.webcams[i].player.day.available) {
                var $button = $("<button>");
                // set the class
                $button.addClass("btn btn-primary m-1");
                $button.attr("id", "day-webcam");
                $button.attr("type", "button");
                // Adding a data-attribute
                $button.attr("value", webcamObject.webcams[i].id);
                $button.attr("name", webcamObject.webcams[i].title);
                // Providing the initial button text
                $button.text("Day");
                $tableCol7.append($button);
            }

            $tableRow.append($tableCol1);
            $tableRow.append($tableCol2);
            $tableRow.append($tableCol3);
            $tableRow.append($tableCol4);
            $tableRow.append($tableCol5);
            $tableRow.append($tableCol6);
            $tableRow.append($tableCol7);
            $table.append($tableRow);
        }
        $("#table-details").empty();
        $("#table-details").append($table);
    }

    function getWebcamById(id) {
        var webcamObject = undefined;

        for (var i = 0; i < currentCountryObject.webcams.length; i++) {
            if (currentCountryObject.webcams[i].id === id) {
                webcamObject = currentCountryObject.webcams[i];
                break;
            }
        }
        return webcamObject;
    }

    function initMap(lat, lng, elementId) {
        var position = {
            lat: lat,
            lng: lng
        };

        var map = new google.maps.Map(document.getElementById(elementId), {
            center: position,
            zoom: 12
        });

        var marker = new google.maps.Marker({
            position: position,
            map: map
        });
    }

    function renderMap(webcamObject) {
        for (var i = 0; i < webcamObject.webcams.length; i++) {
            var id = "map-" + i;
            var lat = webcamObject.webcams[i].location.latitude;
            var lng = webcamObject.webcams[i].location.longitude;
            initMap(lat, lng, id);
        }
    }

    getCountryCodes();

    // Adding a click event listener to all elements with a class of "animal"
    $(document).on("click", ".country-code", function () {
        var value = $(this).attr("value");
        currentArrayIndex = value;
        currentCountryObject.countryCode = countryWithLiveWebCams[value].countryCode;
        currentCountryObject.countryName = countryWithLiveWebCams[value].countryName;
        currentCountryObject.totalCams = countryWithLiveWebCams[value].totalCams;
        currentCountryObject.webcams = [];
        currentCountryObject.webcams = countryWithLiveWebCams[value].webcams;
        currentCountryObject.webCamsRemaining = {
            next: 0,
            back: 0
        };
        if (currentCountryObject.totalCams > maxLimit) {
            currentCountryObject.webCamsRemaining.next = currentCountryObject.totalCams - maxLimit;
            currentCountryObject.webCamsRemaining.back = 0;
        }

        renderTableSummary(currentCountryObject);
        renderTableDetails(currentCountryObject);
        renderMap(currentCountryObject);
    });

    $(document).on("click", "#back-button", function () {
        var limit = maxLimit;

        if (currentCountryObject.webCamsRemaining.back > 0) {
            disableBackButton(); // while data is being retrieved
            myOffset -= maxLimit;
            var returnObject = queryWebcamsByOffset(currentCountryObject, myOffset, limit, false);
            currentCountryObject.webCamsRemaining = returnObject.webCamsRemaining;
        }
        console.log("next: " + currentCountryObject.webCamsRemaining.next);
        console.log("back: " + currentCountryObject.webCamsRemaining.back);
    });

    $(document).on("click", "#next-button", function () {
        var limit = maxLimit;

        if (currentCountryObject.webCamsRemaining.next > 0) {
            disableNextButton();  // while data is being retrieved
            myOffset += maxLimit;

            if ((currentCountryObject.totalCams - currentCountryObject.webCamsRemaining.next) < maxLimit) {
                limit = currentCountryObject.totalCams - currentCountryObject.webCamsRemaining.next;
            }

            var returnObject = queryWebcamsByOffset(currentCountryObject, myOffset, limit, true);
            currentCountryObject.webCamsRemaining = returnObject.webCamsRemaining;

            console.log("next: " + currentCountryObject.webCamsRemaining.next);
            console.log("back: " + currentCountryObject.webCamsRemaining.back);
        }
    });

    $(document).on("click", "#live-webcam", function () {
        var index = $(this).attr("value");
        var webCamId = $(this).attr("value");
        var webCamTitle = $(this).attr("name");
        var webCamObject = getWebcamById(webCamId);

        if (webCamObject !== undefined) {
            // sample: <a name="lkr-timelapse-player" data-id="1010244116" data-play="live" href="https://lookr.com/1010244116" target="_blank">Lausanne › South-East: Place de la Palud</a><script async type="text/javascript" src="https://api.lookr.com/embed/script/player.js"></script>
            var $webCam = $("<a>");
            $webCam.attr("name", "lkr-timelapse-player");
            $webCam.attr("data-id", webCamId);
            $webCam.attr("data-play", "live");
            $webCam.attr("href", webCamObject.player.live.embed);
            $webCam.attr("target", "_blank");
            $webCam.text(webCamTitle);

            $("#embedded-video").empty();
            $("#embedded-video").append($webCam);
            $("#embedded-video").append('<script async type="text/javascript" src="https://api.lookr.com/embed/script/player.js"></script>');
        }
    });
    $(document).on("click", "#day-webcam", function () {
        var index = $(this).attr("value");
        var webCamId = $(this).attr("value");
        var webCamTitle = $(this).attr("name");
        var webCamObject = getWebcamById(webCamId);

        if (webCamObject !== undefined) {
            // sample: <a name="lkr-timelapse-player" data-id="1381307807" data-play="day" href="https://lookr.com/1381307807" target="_blank">Pieksämäki: Pieksämäen asemanseutua</a><script async type="text/javascript" src="https://api.lookr.com/embed/script/player.js"></script>
            var $webCam = $("<a>");
            $webCam.attr("name", "lkr-timelapse-player");
            $webCam.attr("data-id", webCamId);
            $webCam.attr("data-play", "day");
            $webCam.attr("href", webCamObject.player.day.embed + "?autoplay=1");
            $webCam.attr("target", "_blank");
            $webCam.text(webCamTitle);

            $("#embedded-video").empty();
            $("#embedded-video").append($webCam);
            $("#embedded-video").append('<script async type="text/javascript" src="https://api.lookr.com/embed/script/player.js"></script>');
        }
    });

});

　
 
 
　

　

　
