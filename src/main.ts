import { chain } from "./core";
import pluck from "./operator/pluck";
import { compact } from "lodash-es";
const source = chain(
  fetch("http://api.jirengu.com/fm/v2/getChannels.php").then((res) =>
    res.json()
  )
).pipe(pluck("channels"));

source.commit().then((res: Array<any>) => {
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
source.commit().then((res: Array<any>) => {
  console.log(111, res);
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

const source1 = chain(
  fetch("http://api.jirengu.com/fm/v2/getSong.php").then((res) => res.json())
).pipe(pluck("song", "0", "url"));

source1.commit().then((url: string) => {
  console.log("url: ", url);
  const btn = document.querySelector("#btn");
  btn.addEventListener("click", () => {
    window.open(url);
  });
});

// //event
const source2 = chain(
  fetch("http://api.jirengu.com/getWeather.php").then((res) => res.json())
).pipe(pluck("result"));

const click = document.querySelector("#click");
click.addEventListener("click", (e) => {
  source2.commit().then((res) => {
    alert(JSON.stringify(res));
    console.log(e);
  });
});

const source3 = chain([0, 1, false, 2, "", 3]);

const sourceFusing1 = chain(source3).pipe(compact);
const sourceFusing2 = chain().pipe(pluck("type"));

sourceFusing1.commit().then((res) => {
  console.log("sourceFusing1", res);
});

const filter = document.querySelector("#filter");
filter.addEventListener("click", (e) => {
  sourceFusing2.commit(e).then((res) => {
    console.log(res);
    alert(res);
  });
});
