import {createStream} from "./core/stream";
import pluck from "./operator/pluck";
import {compact} from "lodash-es";
import { createShunt } from './core/shunt'
const source = createStream(
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

const source1 = createStream(
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
const source2 = createStream(
  fetch("http://api.jirengu.com/getWeather.php").then((res) => res.json())
).pipe(pluck("source", "result"));

const click = document.querySelector("#click");
click.addEventListener(
  "click",
  source2.useEventStream((data) => {
    alert(JSON.stringify(data));
  })
);

// 分流

const source3 = createStream([0, 1, false, 2, "", 3]);



const sourceFusing1 = createShunt(source3).pipe(pluck("source"),compact);
const sourceFusing2 = createShunt(source3).pipe(pluck("event"));

sourceFusing1.useStream((res) => {
  console.log("sourceFusing1", res);
});
sourceFusing2.useStream((res) => {
  console.log("sourceFusing2", res);
});



const filter = document.querySelector("#filter");
filter.addEventListener(
  "click",
  source3.useEventStream((data) => data)
);
