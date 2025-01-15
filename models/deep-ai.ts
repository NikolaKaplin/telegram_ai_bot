import axios from "axios";
import FormData = require("form-data");

export function generateApiKey() {
  let userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0";
  var myrandomstr = Math.round(Math.random() * 100000000000) + "";
  var myhashfunction = (function () {
    for (var a = [], b = 0; 64 > b; ) {
      a[b] = 0 | (4294967296 * Math.sin(++b % Math.PI));
    }
    return function (c) {
      var d,
        e,
        f,
        g = [(d = 1732584193), (e = 4023233417), ~d, ~e],
        h = [],
        l = unescape(encodeURI(c)) + "\u0080",
        k = l.length;
      c = (--k / 4 + 2) | 15;
      for (h[--c] = 8 * k; ~k; ) {
        h[k >> 2] |= l.charCodeAt(k) << (8 * k--);
      }
      for (b = l = 0; b < c; b += 16) {
        for (
          k = g;
          64 > l;
          k = [
            (f = k[3]),
            d +
              (((f =
                k[0] +
                [
                  (d & e) | (~d & f),
                  (f & d) | (~f & e),
                  d ^ e ^ f,
                  e ^ (d | ~f),
                ][(k = l >> 4)] +
                a[l] +
                ~~h[b | ([l, 5 * l + 1, 3 * l + 5, 7 * l][k] & 15)]) <<
                (k = [
                  7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21,
                ][4 * k + (l++ % 4)])) |
                (f >>> -k)),
            d,
            e,
          ]
        ) {
          d = k[1] | 0;
          e = k[2];
        }
        for (l = 4; l; ) {
          g[--l] += k[l];
        }
      }
      for (c = ""; 32 > l; ) {
        c += ((g[l >> 3] >> (4 * (1 ^ l++))) & 15).toString(16);
      }
      return c.split("").reverse().join("");
    };
  })();
  return (
    "tryit-" +
    myrandomstr +
    "-" +
    myhashfunction(
      userAgent +
        myhashfunction(
          userAgent +
            myhashfunction(
              userAgent + myrandomstr + "suditya_is_a_smelly_hacker"
            )
        )
    )
  );
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", function (input) {
  // Удаляем символ новой строки в конце ввода
  const text = input.toString().trim();
  // Если введено 'exit', завершаем программу
  if (text === "exit") {
    console.log("Выход...");
    process.exit();
  }

  generateText(text);
});
const generateText = async (text) => {
  let userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0";
  const apiKey = generateApiKey();
  const url = "https://api.deepai.org/hacking_is_a_serious_crime";
  // Create a FormData instance
  const form = new FormData();
  form.append("chat_style", "free-chatgpt");
  form.append("chatHistory", `[{"role":"user","content":"${text}"}]`); // Ensure it's a string
  try {
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(), // Important: include the form headers
        "api-key": apiKey,
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "User-Agent": userAgent,
      },
      responseType: "stream",
    });

    response.data.on("data", (chunk) => {
      process.stdout.write(chunk.toString());
    });
    process.stdin.writable;
    response.data.on("end", () => {
      console.log("Stream finished.");
    });
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw error; // Rethrow the error for further handling
  }
};
// Export the module

//generateText("how to use next js?");
