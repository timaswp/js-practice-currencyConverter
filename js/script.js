const inputs = document.querySelectorAll('input'),
      labelSpan = document.querySelectorAll('span');

inputs.forEach((item, i) => {
    inputChange(item, i);
});

function inputChange(input, i) {
    input.addEventListener('input', () => {
        const errorText = document.createElement('div');
        errorText.textContent = "Что-то пошло не так";
        errorText.classList.add('error');

        fetch('js/current.json')
            .then(response => response.json())
            .then(data => {
                if (i === 0) {
                    inputs[1].value = (+inputs[0].value / data.current.usd).toFixed(2);
                } else {
                    inputs[0].value = (+inputs[1].value * data.current.usd).toFixed(2);
                }
            })
            .catch(() => {
                labelSpan[i].append(errorText);
                setTimeout(() => {
                    errorText.remove();
                }, 1000);
            });
    })
}