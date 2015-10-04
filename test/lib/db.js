/* global describe,it,before,after */
'use strict'
let DB = require('../../lib/db')
let should = require('should')

describe('DB', function () {
  let db = DB('datt-testdatabase')
  let doc = {
    _id: 'test-document-id',
    data: 'test-data'
  }

  before(function () {
    return db.init()
  })

  after(function () {
    return db.destroy()
  })

  describe('#init', function () {
    it('should exist', function () {
      should.exist(db.init)
    })
  })

  describe('#close', function () {
    it('should exist', function () {
      should.exist(db.close)
    })
  })

  describe('#info', function () {
    it('should give some info', function () {
      return db.info().then(info => {
        should.exist(info)
        should.exist(info.db_name)
      })
    })
  })

  describe('#put', function () {
    it('should put a piece of data', function () {
      return db.put(doc)
    })

    it('should should get an update conflict if inserting again', function () {
      return db.put(doc)
        .then(() => {
          throw new Error('promise should not succeed')
        }).catch(() => {
          // expected
        })
    })
  })

  describe('#get', function () {
    it('should get a piece of data', function () {
      return db.get(doc._id).then((doc) => {
        doc.data.should.equal('test-data')
      })
    })
  })
})
