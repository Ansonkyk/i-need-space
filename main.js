
const searchSat = $("#search");
function displayTime(i) {
  return i.toString().substring(0, 19);
}
function addText(input) {
  $("div.user-output").addClass("on");
  setTimeout(function () {
    delay(input);
  }, 1500);
  return;
}

function delay(input) {
  const outputTextField = $("div.output-text-field");
  $(outputTextField).html(input).addClass("on-text");
  return;
}
$(searchSat).on("click", function () {
  $("div.user-output").removeClass("on");
  $("div.output-text-field").removeClass("on-text");


  let apiKey = $("#api-key").val();
  let address = $("#address").val();
  let norad = $("#norad").val();

  if (apiKey === "" || address === "" || norad === "") {
    addText("Invalid Entry");
    return;
  } else {
    const addressURI = encodeURI(address);
    const search = async () => {
      const rawData = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${addressURI}.json?access_token=${apiKey}`
      );
      const coords = await rawData.json();
      const longitude = coords.features[0].center[0];
      const latitude = coords.features[0].center[1];
      const rawSatData = await fetch(
        `https://satellites.fly.dev/passes/${norad}?lat=-${latitude}&lon=${longitude}&limit=1&days=15&visible_only=true`
      );
      const flyover = await rawSatData.json();
      const rise = flyover[0].rise.utc_datetime;
      const culminate = flyover[0].culmination.utc_datetime;
      const set = flyover[0].set.utc_datetime;
      const riseTime = displayTime(rise);
      const culminateTime = displayTime(culminate);
      const setTime = displayTime(set);

      const outputText =
        "Your rise time is " +
        riseTime +
        "<br />" +
        "Your culminate time is " +
        culminateTime +
        "<br />" +
        "Your set time is " +
        setTime;

      addText(outputText);
    };
    search();
  }return
});