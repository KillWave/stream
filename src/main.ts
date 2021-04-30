import Stream from "./core/stream";
import pluck from "./operator/pluck";
// import fusing from "./core/fusing";
import _ from "lodash";
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

// const source1 = new Stream(
//   fetch("http://api.jirengu.com/fm/v2/getSong.php").then((res) => res.json())
// ).pipe(pluck("song", "0", "url"));

// source1.useStream((url: string) => {
//   console.log("url: ", url);
//   const btn = document.querySelector("#btn");
//   btn.addEventListener("click", () => {
//     window.open(url);
//   });
// });

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

// //filter compact

const source3 = new Stream([0, 1, false, 2, "", 3]);

const sourceFusing1 = source3.fusing().pipe(pluck("source"));
// console.log("sourceFusing1: ", sourceFusing1);

const sourceFusing2 = source3.fusing().pipe(pluck("event"));
// console.log("sourceFusing2: ", sourceFusing2);

sourceFusing1.useStream((res) => {
  console.log("sourceFusing1", res);
});
sourceFusing2.useStream((res) => {
  console.log("sourceFusing2", res);
});
// source3.useStream((res) => {
//   console.log("res: ", res);
// });

const filter = document.querySelector("#filter");
filter.addEventListener(
  "click",
  source3.useEventStream((data) => {
    console.log("data: ", data);
  }, true)
);
