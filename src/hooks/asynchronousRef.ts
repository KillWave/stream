import { customRef } from 'vue';
export default function (data: Promise<unknown>) {
  return customRef((track, trigger) => {
    let result: unknown = null;
    data.then((res) => {
      result = res;
      trigger();
    });
    return {
      get() {
        track();
        return result;
      },
      set(newValue) {
        result = newValue;
        trigger();
      },
    };
  });
}
