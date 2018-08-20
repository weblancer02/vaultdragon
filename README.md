# VaultDragon Coding Test

---

by Ramnel Erson B. Ramos - Aug 20, 2018

### Pre-requisites

---

```sh
$ npm install
```

### npm commands

---

```
$ npm run server
$ npm run test
```

### Test cases

---

There are 11 unit (online) tests defined in this module. First of which involves integration tests with MongoDB (mLab). Assertions might fail when response timeout exceeds 2000ms.

### POST

---

URL : `http://localhost:5000/object`

JSON Request : `{ myKey : "myValue" }`

JSON Response : `{ key: "myKey", value: "myValue", timestamp = <unix time stamp> }`

### GET Value from Key

---

URL : `http://localhost:5000/object/myKey`

JSON Response : `{ value: "myValue" }`

### GET Value from Key & Timestamp

---

URL : `http://localhost:5000/object/myKey?timestamp=<unix timestamp>`

JSON Response : `{ value: "myValue" }`
