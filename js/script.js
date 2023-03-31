const input = document.getElementById('user-input')
const inputSection = document.getElementById('input-section')
const dataSection = document.getElementById('data-section')
const infoList = document.getElementById('info-list')
const container = document.getElementById('container')
const errorAlert = document.getElementById('error-alert')
const sendButton = document.getElementById('send-button')
const backButton = document.getElementById('back-button')
const loadIcon = document.getElementById('loading-icon')
const dateSpan = document.getElementById('query-date')

sendButton.addEventListener('click', getCep)
backButton.addEventListener('click', goBack)

async function getCep() {

    const userCep = input.value

    if (userCep.length >= 9 || userCep.length < 8) {
        container.style.height = '335px'
        container.style.width = '335px'
        errorAlert.style.display = 'block'
    } 
    else {
        container.style.height = '300px'
        container.style.width = '300px'
        errorAlert.style.display = 'none'

        const url = `https://viacep.com.br/ws/${userCep}/json/`

        loadButton()

        try {
            const response = await fetch(url)
            const data = await response.json()
            const { cep, logradouro, bairro, localidade, uf, ddd } = data
            const atributos = {
                'cep': cep,
                'uf': uf,
                'ddd': ddd,
                'cidade': localidade,
                'bairro': bairro,
                'rua': logradouro
            }

            if (data.erro) {
                setTimeout(() => {
                    dateSpan.innerHTML = ''
                    insertError(infoList)
                    dataSection.className = 'active'
                }, 1500)
            }
            else {
                setTimeout(() => {
                    insertData(atributos, infoList)
                    insertQueryDate()
                    dataSection.className = 'active'
                }, 1500);
            }

            setTimeout(() => {
                container.style.height = '450px'
                container.style.width = '400px'
                inputSection.className = 'disabled'
            }, 1000);

        } catch (error) {
            console.log(error)
        }
    }
}

function goBack() {

    if (dataSection.classList.contains('active')) {

        input.value = ''
        infoList.innerHTML = ''

        sendButton.style.display = 'inline-block'

        loadIcon.style.display = 'none'
        loadIcon.classList.remove('rotate')

        container.style.height = '300px'
        container.style.width = '300px'

        inputSection.className = 'active'
        dataSection.className = 'disabled'
    }

}

function insertData(object, element) {

    for (item in object) {

        const div = document.createElement('div')
        div.classList.add('data-div')

        const attrSpan = document.createElement('span')
        attrSpan.classList.add('attr-span')
        attrSpan.innerText += `${item}:`

        const dataSpan = document.createElement('span')
        dataSpan.classList.add('data-span')
        dataSpan.innerText += `${object[item]}`

        div.appendChild(attrSpan)
        div.appendChild(dataSpan)

        element.appendChild(div)
    }

}

function insertQueryDate() {

    const dateFun = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    const localDate = dateFun.toLocaleDateString('pt-br', options)
    const localHour = dateFun.getHours()
    const localMinute = dateFun.getMinutes()

    dateSpan.innerHTML = `Consulta realizada em: <br> ${localDate} <br> ${localHour}:${localMinute}`
}

function loadButton() {
    sendButton.style.display = 'none'

    const loadIcon = document.getElementById('loading-icon')

    loadIcon.style.display = 'block'
    loadIcon.classList.add('rotate')
}

function insertError(element) {
    const errorDiv = document.createElement('div')
    errorDiv.classList.add('error-div')

    const errorSpan = document.createElement('span')
    errorSpan.classList.add('error-style')

    const errorIcon = document.createElement('i')

    errorIcon.className = 'ph ph-warning-octagon'

    errorSpan.innerHTML += 'CEP inexistente!<br>Tente novamente...'

    errorDiv.appendChild(errorIcon)
    errorDiv.appendChild(errorSpan)

    element.appendChild(errorDiv)
}