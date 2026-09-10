import { Store } from "tauri-plugin-store-api";

const store = new Store(".settings.dat");

await store.set("some-key", { value: 5 });

const val = await store.get<{ value: number }>("some-key");

if (val) {
  console.log(val);
} else {
  console.log("val is null");
}

await store.save(); // this manually saves the store, otherwise the store is only saved when your app is closed