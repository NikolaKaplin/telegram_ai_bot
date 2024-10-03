export async function getAnswer(prompt) {
    const url = 'https://hand.ni-li.com/api/llm-on-lpacpu/generate';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer iCeoI6o+4Bv1oV1+IgGbjUD7s+gK2ooj9xdXXHVrfck='
        },
        body: `{"model":"mixtral-8x7b-32768","prompt": "${prompt}"}`
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

getAnswer("когда изобрели электробус?");