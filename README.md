# Node Js Reporter arr server
Reporter is an simple application which helps user to create reports about their employees divided on 3 categories:
* recent employees report (you can specify total number of records in report)
* top-salaries report (10 employees) 
* report of employees with specifies badge (you can specify total number of records in report)

As a simple storage for users info was chosen [`lowDb`](https://github.com/typicode/lowdb) package. Information about employees is stored on Yandex Dysk, settings for reports - Yandex DataSync. 
All API is secured with Bearer Auth, so you should provide it in Auth header for all request.  

## Background
This is application was made as a first project with Node Js [Express](https://expressjs.com/) for educational purposes.

## Preparation
Configuration for application should be located in `.env` file, which is ignored by git for security reasons. It contains next properties:
*HOST -host of server
*PORT - port of server
*YANDEX_TOKEN - token for yandex Auth

## Start application


```bash
npm start
```
Or you can start application with [`nodemon`](https://github.com/remy/nodemon) lib for auto restart after changes.
```bash
nodemon /bin/www.js
```
## Test
```bash
npm test
```
This will invoke [`xo`](https://github.com/xojs/xo) linter and test execution.

## Docs

All API is documented in swagger, which is located by next url: `/api-docs`.
