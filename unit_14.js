let forecastArr = "";
const arrCapitals = {
    "Beijing": {
        "id": 1816670,
        "name": "Beijing",
        "country": "China"
    },
    "Tokyo": {
        "id": 1850147,
        "name": "Tokyo",
        "country": "Japan"
    },
    "Moscow": {
        "id": 524901,
        "name": "Moscow",
        "country": "Russian Federation",
    },
    "Delhi": {
        "id": 1273294,
        "name": "Delhi",
        "country": "India"
    },
    "Seoul": {
        "id": 1835848,
        "name": "Seoul",
        "country": "Korea"
    },
    "Jakarta": {
        "id": 1642911,
        "name": "Jakarta",
        "country": "Indonesia"
    },
    "Bangkok": {
        "id": 1609350,
        "name": "Bangkok",
        "country": "Thailand"
    },
    "Cairo": {
        "id": 360630,
        "name": "Cairo",
        "country": "Egypt"
    },
    "London": {
        "id": 2643743,
        "name": "London",
        "country": "Great Britain",
    },
    "Kiev": {
        "id": 703448,
        "name": "Kiev",
        "country": "Ukraine"
    }
}

creatingListСapital()//запускаем первую функцию

//Добавление списка столиц с id
function creatingListСapital() {
    for (let key in arrCapitals) {
        let newElemt = document.createElement("option");//формируем новый элемент html - option  

        newElemt.setAttribute("value", name);//добавляем аттрибут value и название столицы        
        newElemt.setAttribute("id", arrCapitals[key].id);//добавляем аттрибут id и его значение
        newElemt.textContent = `${arrCapitals[key].name}, ${arrCapitals[key].country}`;
        document.querySelector(".location select").appendChild(newElemt);

        //для формирования строки столицы по умолчанию
        if (key == "Beijing") {//"Beijing" активен по умолчанию
            document.querySelector("option").selected = true;
        }
    }

    document.querySelector(".location select").onchange = selectedСapital;//сажаем обработчика событий

    selectedСapital();//для формирования строки столицы по умолчанию

    eventWeatherForecast();//сажаем обработчика событий
}

//сажаем обработчика событий на прогноз на 5 дней
function eventWeatherForecast() {
    let list = document.querySelectorAll(".meteoconditions li");

    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener("click", choiceDate);
        list[i].addEventListener("mouseover", focusDate);
        list[i].addEventListener("mouseout", focusDate);
    }
}

// сажаем дату / день недели на прогнозные вкладки
function dateForecast() {
    let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    //определяем первый текущий день недели
    let dayNow = new Date(forecastArr.list[0].dt * 1000)
    let selectDay = dayNow.getDay();
    let weekDay = document.querySelectorAll(".weekday");

    //перебор на 5 дней
    for (let i = 0; i < 5; i++) {
        if (selectDay < 6) {
            weekDay[i].textContent = week[selectDay];
            selectDay++
        } else {
            weekDay[i].textContent = week[selectDay];
            selectDay = 0;
        }
    }
}

// сажаем индексы массивов на прогнозные вкладки в id
function arrForecast() {
    //определяемся с первым отчетным периодом

    let arr = document.querySelectorAll(".meteoconditions li");
    let arrHour = [];
    let currentFirstIndex;
    let currentSecondIndex;

    // массив с часами
    for (let i = 0; i < forecastArr.list.length; i++) {
        let hour = new Date(forecastArr.list[i].dt * 1000);
        arrHour.push(hour.getHours());
    }

    //первая точка отсчета
    //если еще не наступили 12 часов дня, точка отсчета на 12 часов
    //если наступили и прошли, то берем текущий период

    if (arrHour.indexOf(0) == 0 || arrHour.indexOf(0) >= 4) {
        currentFirstIndex = arrHour.indexOf(12);//на 12 часов

    } else {
        currentFirstIndex = 0;//текущий
    }
    arr[0].id = currentFirstIndex;//вешаем id на первый прогнозный день (номер соответствует массиву)

    // вторая точка отсчета на id
    currentSecondIndex = arrHour.indexOf(12, currentFirstIndex + 1);
    arr[1].id = currentSecondIndex;

    //остальные точки на id
    arr[2].id = currentSecondIndex + 8;
    arr[3].id = currentSecondIndex + 8 * 2;
    arr[4].id = currentSecondIndex + 8 * 3;

    temperatureСurrent(arr)//расстановка прогнозной температуры на 5 дней
    iconСurrent(arr);//расстановка прогнозных иконок на 5 дней
    detailedForecast(arr[0].id);//запуск первого прогнозного дня
}

//температура на прогнозные дни
function temperatureСurrent(arr) {
    let temperature = document.querySelectorAll(".temperature_forecast");

    for (let i = 0; i < temperature.length; i++) {
        let temp = forecastArr.list[arr[i].id].main.temp;
        temperature[i].innerHTML = Math.round(temp - 273) + '&deg'
    }
}

//иконки на прогнозные дни
function iconСurrent(arr) {
    let iconMin = document.querySelectorAll(".icon_cloud_min img");

    for (let i = 0; i < iconMin.length; i++) {
        //костыль для замены ночной версии на дневную (n на d)
        let codeIcon = forecastArr.list[arr[i].id].weather[0].icon.replace("n", "d");
        let addressIcon = `icon/${codeIcon}.png`;
        iconMin[i].setAttribute("src", addressIcon);
    }
}

// формирование адреса API
function selectedСapital() {
    const apiKey = "f8e4baaf5cc72f828508135ca6ebd32b";
    let apiCalls = "";
    let selectedСapitalId = "";
    let listCapitals = document.querySelectorAll("option");

    for (let i in listCapitals) {//получение id города
        if (listCapitals[i].selected) {
            selectedСapitalId = listCapitals[i].id;
        }
    }

    // формирование строки с параметрами
    apiCalls = `https://api.openweathermap.org/data/2.5/forecast?id=${selectedСapitalId}&appid=${apiKey}`;
    weatherForecast(apiCalls);
}

//забираем массив с прогнозом погоды
function weatherForecast(apiCalls) {
    //метод возвращает promise
    fetch(apiCalls)
        //внешний код
        .then(function (resp) { return resp.json() })// возврат ответа в формате JSON (перекодировка html в JSON)
        .then(function (data) {//вывод в консоль

            forecastArr = data;
            // console.log(forecastArr);
            dateForecast();
            arrForecast();
        })

        // Обработчик на ошибку
        .catch(function () {
            // catch any errors
        });

}

//активный день недели
function choiceDate() {
    let arr = document.querySelectorAll(".meteoconditions li");

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].classList.contains("active")) {
            arr[i].classList.remove("active");
        }
    }

    this.classList.add("active");
    detailedForecast(this.id);
}

function focusDate() {//светимся по фокусу
    this.classList.toggle("focus");
}

//формирование прогноза выбранного дня
function detailedForecast(id) {
    let temp = forecastArr.list[id].main.temp;
    let clouds = forecastArr.list[id].weather[0].description;

    let icon = forecastArr.list[id].weather[0].icon.replace("n", "d");//костыль
    let addressIcon = `icon/${icon}.png`;

    let pressure = forecastArr.list[id].main.pressure;
    let humidity = forecastArr.list[id].main.humidity;
    let wind = forecastArr.list[id].wind.speed;

    document.querySelector(".current_temperature").innerHTML = Math.round(temp - 273) + '&deg';
    document.querySelector(".description_clouds").innerHTML = clouds;
    document.querySelector(".icon_cloud_max img").setAttribute("src", addressIcon)
    document.querySelector(".pressure").innerHTML = Math.round(pressure * 0.750063755419211) + ' mm Hg';
    document.querySelector(".humidity").innerHTML = humidity + ' %';
    document.querySelector(".wind").innerHTML = wind + ' kph';
}


