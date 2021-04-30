import Stream from "./core/stream";
import pluck from "./operator/pluck";
import _ from "lodash";
//channels
const source = new Stream(
  fetch("http://api.jirengu.com/fm/v2/getChannels.php").then((res) =>
    res.json()
  )
).pipe(pluck("channels"));

source.useStream((res) => {
  const box = document.querySelector("#box");
  res.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p>${item.channel_id}</p>
      <img src="${item.cover_big}" />
      <img src="${item.cover_middle}" />
      <img src="${item.cover_small}" />
      <p>${item.name}</p>
    `;
    box.appendChild(li);
  });
});
source.useStream((res) => {
  const box = document.querySelector("#box");
  res.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p>${item.channel_id}</p>
      <img src="${item.cover_big}" />
      <img src="${item.cover_middle}" />
      <img src="${item.cover_small}" />
      <p>${item.name}</p>
    `;
    box.appendChild(li);
  });
});

const source1 = new Stream(
  fetch("http://api.jirengu.com/fm/v2/getSong.php").then((res) => res.json())
).pipe(pluck("song", "0", "url"));

source1.useStream((url: string) => {
  console.log("url: ", url);
  const btn = document.querySelector("#btn");
  btn.addEventListener("click", () => {
    window.open(url);
  });
});

// //event
const source2 = new Stream(
  fetch("http://api.jirengu.com/getWeather.php").then((res) => res.json())
).pipe(pluck("source", "result"));

const click = document.querySelector("#click");
click.addEventListener(
  "click",
  source2.useEventStream((data) => {
    alert(JSON.stringify(data));
  })
);

// //filter

const source3 = new Stream([0, 1, false, 2, "", 3]).pipe(
  (d) => {
    console.log(d);
    return d;
  },
  pluck("source"),
  _.compact
);
const filter = document.querySelector("#filter");
filter.addEventListener(
  "click",
  source3.useEventStream((data) => {
    alert(data);
  })
);
