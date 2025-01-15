// import {fetch} from ".
// " 

// async function generateText() {
//   const response = await fetch('https://text.pollinations.ai/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       messages: [
//         { role: 'system', content: 'You are a helpful assistant.' },
//         { role: 'user', content: 'What is artificial intelligence?' }
//       ],
//       seed: 42,
//       jsonMode: true,
//       model: 'mistral'
//     }),
//   });

//   const data = await response.json();
//   console.log(data);
// }

// generateText();