# Решение команды "MISIS x MIREA SALUT!"

## Команда

[Александр, Frontend developer](https://t.me/ALEKSANDERGORIN)

[Заман, Backend, Team Lead](https://t.me/chosenone_nf)

[Николай, Backend](https://t.me/lllpala700km)

[Вадим, Frontend](https://t.me/vdmkkk)

[Даниил, Designer](https://t.me/sfyeidbxhxdhs)

## Стек приложения
__Бэкенд__: фреймворк Gin, база данных: PostgreSQL (Citus, используемый в Micosoft)
Docker, Docker-compose

__Фронтенд__: React, JavaScript

## Решение
Реализован swagger бэкенда [админ-панели](http://45.8.99.29:8080/swagger/index.html#/), [сервиса отдачи цен](http://92.255.107.73:8000/swagger/index.html#/), а так же [фронтенд]().
Также доступна [видео-демонстрация работы платформы](https://disk.yandex.ru/d/ByVk5522QK-xmg)

## Product features
- [x] Управление матрицами
    - [x] Изменение
        - [x] История изменений (history)
        - [x] Детальное сравнение двух матриц (аналог git diff)
        - [x] Просмотр данных в таблице (поиск по ней)
- [x] Аналитика
    - [x] Интерес
        - [x] Тенденция цен с графиком конверсии (конверсия - мок)
        - [x] Трассировка всего приложения (jaeger)
        - [x] Анализ (графики на моках)
- [ ] Профиль пользователя (мок)   

## Dev features
- [x] Algo
    - [x] Оптимизированный поиск цен по baseline
    - [x] Оптимизированный поиск цен по discount
- [x] Storage
    - [x] Создание storage
    - [x] Подготовка storage к production (просчитывание оптимизаций)
    - [x] Deploy storage на production
        - [ ] Реализовать передачу через Postgres
    - [x] Просмотр текущего storage (выбранного)
- [x] Price
    - [x] Получение
    - [x] Быстрое обновление
        - [ ] Полностью атомарное обновление 
            - [x] Идея реализации атомарного обновления
- [x] Deployment
    - [x] Dockerfiles (front, admin panel back, price api back)
    - [ ] Распределённая Citus PostgreSQL
        - [ ] Шардирование (позволяет сильно оптимизировать нагрузку на postgres)
    - [ ] k8s
        - [ ] Оркестрация "подмены" текущего storage на новый
        - [ ] Перезапуск price api при его "смерти"
            - [x] Price api back сам получает текущий storage при перезапуске
             
## Документация
#### Алгоритмы:
##### Общий
Гипотеза: Самых нижних категорий дерева (и, скорее всего, локации)
Следствие: Даже если локация есть в матрице цен, а выбранной категории вообще в ней нет, значит, пары (локация, категория) вообще нет
Реализация: Аллоцируем 2 массива len(maxIndex-1), где maxIndex - максимальный индекс категории или локации соответственно, и высчитываем "прыжки" из тех локаций/категорий (не пар, а одиночных значений!) которые ВООБЩЕ не встречаются в baseline матрице. Таким образом, мы гораздо быстрее (не делая запрос в postgres) пропускаем несколько шагов (если прыгнули на 3 категории выше и на 2 локации - 6 лишних запросов в БД), таким образом уменьшая нагрузку на postgres и увеличивая скорость.
##### Скидочный
Гипотеза: Суммарный размер скидочных матриц ощутимо меньше размера baseline матриц
Слествие: Савайте засунем все скидочные в hashMap??
Реализация: map[discountMatrixName]map[locationID]map[categoryID]int - price

#### Доставка до price api nodes
#### Citus 
1. Используется в Microsoft
2. Управляет шардированием и репликацией
3. По источникам из [доклада Microsoft](https://www.youtube.com/watch?v=W_3e07nGFxY&embeds_referring_origin=https%3A%2F%2Fwww.citusdata.com&feature=emb_logo&themeRefresh=1) Citus в 300 раз быстрее при сложно запросе с JOIN и sum в таблице, в которой более 500 миллионов строк
4. С [июня 2022](https://www.citusdata.com/blog/2022/06/17/citus-11-goes-fully-open-source/) поддерживае query from every node, что позволит не обращаться к master'у, а делать запросы к localhost с price api node, что облегчит нагрузку на сеть и увеличит скорость
5. С [официального сайта](https://www.citusdata.com/blog/2017/09/29/what-performance-can-you-expect-from-postgres/): "...2 million records per core in a second applies to Citus, and that additionally, because of our horizontal scale you can expect 2 million per core in your Citus cluster...", что говорит нам о том, что это решение **более чем удовлетворительно для 2 million rpm**
#### Идея
Каждая price nod'а имеет свой postgres, который подключён к master'у. Также, каждая price node имеет в runtime название baselineMatrix и []string{discountMatrices}, чтобы понимать, к каким именно матрицам обращаться в Postgres. 
При изменении storage, мы сначала кладём новые матрицы в Postgres, высчитываем для них оптимизацию по алгоритму, затем кладём оптимизации в postgres (jsonb) и только потом говорим **k8s**, который будет дёргать ручки каждой price node (ретраить), чтобы она начала отдавать данные из новой матрицы. Из-за citus изменение postgres будет происходить транзакционно.
Таким образом, сам момент изменения - это лишь подмена полей структуры в runtime.
Из этого не реализован сам citus, k8s и get оптимизации алгоритма из postgres, мы успели сделать так, что preparedStorage отсылается на nodes и там кладётся в структуру, которая ждёт экзекуции.