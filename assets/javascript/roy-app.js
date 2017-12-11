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
    var currentArrayIndex = 0; // index into array of current country with live webCams

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
        //curl --get --include 'https://webcamstravel.p.mashape.com/webcams/list/continent=AF?lang=en&show=webcams%3Aimage%2Clocation' -H 'X-Mashape-Key: JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP'
        var key = "JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP";
        $.ajax({
            url: "https://webcamstravel.p.mashape.com/webcams/list/country=" +
                countryObject.code +
                "/property=live/limit=" +
                limit +
                ",0" + // offset
                "?lang=en&show=webcams%3Aimage%2Clocation%2Curl",

            headers: {
                "X-Mashape-Key": key
            },
            type: "GET",
            dataType: "json",
            processData: false,
            success: function (data) {
                console.log(data);
                if (data.result.total) {
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
                alert("Cannot get data");
            }
        });
    }

    function queryWebcamsByOffset(countryCode, index, offset, limit) {
        //curl --get --include 'https://webcamstravel.p.mashape.com/webcams/list/continent=AF?lang=en&show=webcams%3Aimage%2Clocation' -H 'X-Mashape-Key: JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP'
        var key = "JPZH8HA6lBmshdutMhV7vXqrSTydp1Ov8CljsnUVWnKklt18RP";
        $.ajax({
            url: "https://webcamstravel.p.mashape.com/webcams/list/country=" +
                countryCode +
                "/property=live/limit=" +
                limit +
                "," +
                offset +
                "?lang=en&show=webcams%3Aimage%2Clocation%2Curl",

            headers: {
                "X-Mashape-Key": key
            },
            type: "GET",
            dataType: "json",
            processData: false,
            success: function (data) {
                console.log(data);
                if (data.result.total) {
                    countryWithLiveWebCams[index].webcams = [];
                    countryWithLiveWebCams[index].webcams = data.result.webcams;
                    renderTableDetails(countryWithLiveWebCams[index]);
                }
            },
            error: function () {
                alert("Cannot get data");
            }
        });
    }

    function renderButton(webcamObject, index) {
        var offset = 0;
        var limit = maxLimit;
        console.log(JSON.stringify(webcamObject));
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var $button = $("<button>");
        // set the class
        $button.addClass("btn btn-primary country-code m-1");
        $button.attr("type", "button");
        // Adding a data-attribute
        $button.attr("data-name", webcamObject.countryCode);
        $button.attr("value", index);
        // Providing the initial button text
        $button.text(
            webcamObject.countryName +
            "(" +
            webcamObject.countryCode +
            ")" +
            "(" +
            webcamObject.totalCams +
            ")"
        );
        // Adding the button to the buttons div
        $("#buttons").append($button);
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
        var tableHeadingArray = ["ID", "Status", "Title", "Thumbnail", "City", "latitude", "longitude", "url"];
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

            var $tableCol6 = $("<td>");
            $tableCol6.text(webcamObject.webcams[i].location.latitude);

            var $tableCol7 = $("<td>");
            $tableCol7.text(webcamObject.webcams[i].location.longitude);

            var $tableCol8 = $("<td>");
            var $link = $("<a>");
            $link.attr("href", webcamObject.webcams[i].url.current.desktop);
            $link.attr("target", "_blank");
            $link.text("View Web Camera");
            $tableCol8.text(webcamObject.webcams[i].url.current.desktop);
            $tableCol8.append($link);
           
            $tableRow.append($tableCol1);
            $tableRow.append($tableCol2);
            $tableRow.append($tableCol3);
            $tableRow.append($tableCol4);
            $tableRow.append($tableCol5);
            $tableRow.append($tableCol6);
            $tableRow.append($tableCol7);
            $tableRow.append($tableCol8);
            $table.append($tableRow);
        }
       
        
        $("#table-details").empty();
        $("#table-details").append($table);
    }
    getCountryCodes();

    // Adding a click event listener to all elements with a class of "animal"
    $(document).on("click", ".country-code", function () {
        var value = $(this).attr("value");
        currentArrayIndex = value;
        renderTableSummary(countryWithLiveWebCams[value]);
        renderTableDetails(countryWithLiveWebCams[value]);
    });

    $(document).on("click", "#back-button", function () {
        var limit = maxLimit;
        var webcamObject = countryWithLiveWebCams[currentArrayIndex];
        var temp = myOffset - limit;
        if (myOffset !== 0) {
            if (temp < 0) {
                myOffset = 0;
            } else {
                myOffset = temp;
            }
            console.log("myOffset: " + myOffset);
            queryWebcamsByOffset(webcamObject.countryCode, currentArrayIndex, myOffset, limit);
        }
    });

    $(document).on("click", "#next-button", function () {
        var limit = maxLimit;
        var webcamObject = countryWithLiveWebCams[currentArrayIndex];
        var temp = myOffset + limit;
        if (myOffset < webcamObject.totalCams) {
            if (temp > webcamObject.totalCams) {
                myOffset = myOffset + (webcamObject.totalCams - myOffset);
            } else {
                myOffset = myOffset + maxLimit;
            }
            console.log("myOffset: " + myOffset);
            queryWebcamsByOffset(webcamObject.countryCode, currentArrayIndex, myOffset, limit);
        }
    });
});