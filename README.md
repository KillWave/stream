<h1 align="center"> Stream </h1>

<p align="center">
  <a href="https://www.npmjs.org/package/stream">
    <img alt="NPM" src="http://img.shields.io/npm/v/stream" />
  </a>
  <a href="">
    <img alt="Size" src="https://img.shields.io/badge/size-6kb-green.svg" />
  </a>
</p>

## Why

stream is more simpler and lightweight (gzip 2kb). It satisfies most of the situation event-driven situation, suitable for dealing with a variety of event streams.

For frameworks of component systems, such as React, Vue.js, etc., communication between non parent and child components is a bothering thing, but it can be made easy by using stream.

## Simple Usage

```js
import Stream from "./core/stream";
import pluck from "./operator/pluck";
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

// 分流

const source3 = new Stream([0, 1, false, 2, "", 3]);

const sourceFusing1 = source3.createShunt().pipe(pluck("source"),_.compact);
const sourceFusing2 = source3.createShunt().pipe(pluck("event"));

sourceFusing1.useStream((res) => {
  console.log("sourceFusing1", res);
});
sourceFusing2.useStream((res) => {
  console.log("sourceFusing2", res);
});


const filter = document.querySelector("#filter");
filter.addEventListener(
  "click",
  source3.useEventStream((data) => data, true)
);

```

[MIT](./LICENSE)
