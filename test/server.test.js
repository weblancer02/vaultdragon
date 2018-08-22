const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const expect = chai.expect;
const should = chai.should();
const mongoose = require("mongoose");
const mongodb = require("mongodb").MongoClient;

let vaultTimeStamp = null;

// Load KeyValueStore model
const KeyValueStore = require("../models/KeyValue");

// KeyValue fixture
const newKey = new KeyValueStore({
  key: "DRAGON",
  value: "DVAULT1",
  timestamp: Math.floor(Date.now() / 1000)
});

// Assign ES6 promise to mongoose Promise for deprecation warnings.
// mongoose.Promise = global.Promise;

// DB Config
const db =
  process.env.MONGODB_URI !== undefined
    ? process.env.MONGODB_URI
    : require("../config/keys").MONGODB_URI["development"];

chai.use(chaiHttp);

// This test is dependent on the network connectivity
// the DATABASE tests below may fail if response timeout exceeds 2000ms
describe("DATABASE", () => {
  it("should be able to connect to 'test' MongoURI", done => {
    console.log;
    mongoose
      .connect(
        db,
        {
          auth: {
            user: "dragontest",
            password: "dragon1"
          }
        },
        { useNewUrlParser: true }
      )
      .then()
      .catch(err => console.log("ERROR:" + err));
    mongodb.connection
      .once("open", () => done())
      .on("error", err => console.warn("ERROR: " + err));
  });

  it("should be able insert a document to the collection", done => {
    newKey
      .save()
      .then(() => {
        expect(newKey.isNew).to.be.false;
        done();
      })
      .catch(err => console.log(err));
  });

  it("should be able to delete in the collection", done => {
    KeyValueStore.remove(() => done());
  });
});

describe("POST /", () => {
  it("should be able to post a JSON key/value pair", done => {
    chai
      .request(server)
      .post("/object")
      .set("content-type", "application/json")
      .send({ vaultKey: "dragonValue" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.all.keys("key", "value", "timestamp");
        done();
      });
  });

  it("should be able to update value by Key 'vaultKey'", done => {
    chai
      .request(server)
      .post("/object")
      .set("content-type", "application/json")
      .send({ vaultKey: "testValue2" })
      .then(res => {
        vaultTimeStamp = res.body.timestamp;

        chai
          .request(server)
          .get("/object/vaultKey")
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.value).equal("testValue2");
            done();
          });
      });
  });
});

describe("GET /", () => {
  it("should be able to GET / response text and status(200)", done => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).equal("Vault Dragon Coding Test");
        done();
      });
  });

  it("GET /object should return status(404)", done => {
    chai
      .request(server)
      .get("/object")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should be able to GET value from '/object/vaultKey' route", done => {
    chai
      .request(server)
      .get("/object/vaultKey")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("value");
        expect(res.body.value).equal("testValue2");
        done();
      });
  });

  it("should be able to GET value from provided key & timestamp query", done => {
    chai
      .request(server)
      .get("/object/vaultKey")
      .query({ timestamp: vaultTimeStamp })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.value).equal("testValue2");
        done();
      });
  });

  it("should be able to GET next lower value (if any) from provided key with timestamp query less than the timestamp of matching key  ", done => {
    chai
      .request(server)
      .get("/object/vaultKey")
      .query({ timestamp: vaultTimeStamp - 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.value).equal("dragonValue");
        done();
      });
  });

  it('should be able to validate if "timestamp" is found in Object.keys(req.query)', done => {
    chai
      .request(server)
      .get("/object/vaultKey")
      .query({ timestamped: vaultTimeStamp })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("timestamp");
        expect(res.body.timestamp).equal("'Timestamp' query not found.");
        done();
      });
  });
});
