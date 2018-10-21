# Домашнее задание: автотесты

## Как запустить
### Приложение

```sh
npm i
npm start
```

### Интеграционные тесты
```sh
selenium-standalone start # http://0.0.0.0:4444/wd/hub
```

```sh
npm run start
```
Далее

`npm run itest` - запускает hermione  
или  
`npm run itest-initial` - запускает hermione с флагом `--update-refs`  

### Модульные тесты
```sh
npm run utest
```

## Логические блоки 
1. Роутинг в `app.js`  

2. Работа с API git с помощью child_process.execFile()  
  2.1. метод gitHistory возвращает массив объектов c историей о коммитах в формате `{ hash, author, timestamp, msg }`  
  2.2. метод gitFileTree возвращает массив объектов со структурой файлов указанной директории, в формате `{type(blob|tree), hash, path}`  
  2.3. метод gitFileContent возвращает строку с содержимым файла.  

3. Получение данных для рендера страниц:  
  3.1. / - index.hbs  
    Вызова функции `gitHistory`  
    Получение массива `list`  
    Рендер страницы `views/index.hbs`  
  3.2. /files/:hash/* - files.hbs (где * - ничто или директория)  
    Вызов функции `gitFileTree`  
    Получение массива `files`  
    Рендер страницы `views/files.hbs`  
  3.3. /content/:hash/* - content.hbd (где * - путь к файлу)  
    Вызов функции `gitFileContent`  
    Получение содержимого файла  
    Рендер страницы `views/content.hbs`  
