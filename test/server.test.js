// Set test environment
process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const expect = chai.expect;
const should = chai.should();

const mongoose = require("mongoose");
// Load KeyValueStore model
const KeyValueStore = require("../models/KeyValue");

chai.use(chaiHttp);

describe("Database", () => {
  it("should be able to connect to 'test' MongoURI", done => {
    done();
  });
  it("should be able to drop collection", done => {
    done();
  });
});

describe("POST /", () => {
  it("should be able to post a JSON key/value pair", done => {
    done();
  });
  it("should be able to update value by Key", done => {
    done();
  });
  it("should be able to validate value & Key format", done => {
    done();
  });
});

describe("GET /", () => {
  it("should be able to GET response text and status(200)", done => {
    done();
  });
  it("should be able to GET value from provided key", done => {
    done();
  });
  it("should be able to GET value from provided key & timestamp query", done => {
    done();
  });
  it("should be able to GET next lower value (if any) from provided key with timestamp query less than the timestamp of matching key  ", done => {
    done();
  });
  it('should be able to validate if "timestamp" is found in Object.keys(req.query)', done => {
    done();
  });
});
