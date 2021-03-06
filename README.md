# Node Js Reporter app server
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
* HOST - host of server
* PORT - port of server
* YANDEX_TOKEN - token for yandex Auth
* REPORT_NUM_OF_RECORDS - max number of records in "recent employees" and "employee with badge" reports
* REPORT_EXCH_RATE - exchange rate of US dollar for USD salary calculation

## Start application


```bash
npm start
```
Or you can start application with [`nodemon`](https://github.com/remy/nodemon) lib for auto restart after changes.
```bash
nodemon /bin/www.js
```
## Test
If you wan't to run tests:
```bash
npm test
```
In case if you want get test coverage:
```bash
npm run coverage
```
If you want to check code style run next command:
```bash
npm run lint
```
It will invoke [`xo`](https://github.com/xojs/xo) linter execution.

## Docs

All API is documented in swagger, which is located by next url: `/api-docs`.
