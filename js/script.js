const inputs = document.querySelectorAll('input'),
      labelSpan = document.querySelectorAll('span');

inputs.forEach((item, i) => {
    item.addEventListener('input', () => {
        const request = new XMLHttpRequest();
        request.open('GET', 'js/current.json');
        request.setRequestHeader('Content-type', 'application/json');
        request.send();

        request.addEventListener('load', () => {
            if (request.status === 200) {
                const data = JSON.parse(request.response);
                if (i == 0) {
                    inputs[1].value = (+inputs[0].value / data.current.usd).toFixed(2);
                } else {
                    inputs[0].value = (+inputs[1].value * data.current.usd).toFixed(2);
                }
            } else {
                const errorText = document.createElement('div');
                errorText.textContent = "Что-то пошло не так";
                errorText.classList.add('error');
                labelSpan[i].append(errorText);
                setTimeout(() => {
                    errorText.remove();
                }, 1000);
            }
        });
    })
});