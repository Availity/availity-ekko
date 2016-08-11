'use strict';

const path = require('path');
const BPromise = require('bluebird');

const config = require('../config');
const logger = require('../logger');

const result = {

  cache: {},

  file: function(req, res, response, dataPath) {
    BPromise.delay(response.latency || 200).then(() => {

      const filePath = path.join(dataPath, response.file);
      const status = response.status || 200;

      if (response.headers) {
        res.set(response.headers);
      }

      res.status(status).sendFile(filePath, (err) => {
        if (err) {
          logger.error('{red:FILE {cyan:%s} {bold:NOT FOUND}', filePath);

          config.events.emit(config.constants.EVENTS.FILE_NOT_FOUND, {
            req: req
          });

          res.sendStatus(404);
        } else {
          logger.info('{green:FILE {cyan:%s} {gray:%s}', filePath, status);

          config.events.emit(config.constants.EVENTS.RESPONSE, {
            req: req,
            res: response,
            file: filePath
          });
        }
      });
    });
  },

  url: function(req, res, response) {
    config.events.emit(config.constants.EVENTS.REDIRECT, {
      req: req,
      res: response
    });

    res.redirect(response.url);
  },

  send: function(req, res) {
    const route = res.locals.route;
    const request = res.locals.request;

    const routeId = route.id;
    const requestId = request.id;

    // cache: {
    //  'route1_request2': [0,0] //  position 0 === response index; position 1 === repeat index
    // }
    const cacheKey = routeId + '_' + requestId;

    let indexes = result.cache[cacheKey];

    if (!indexes) { // empty cache so hydrate
      indexes = result.cache[cacheKey] = [0, 0];
    }

    let responseIndex = indexes[0];
    let repeatIndex = indexes[1];

    let response = request.responses[responseIndex];

    if (repeatIndex >= response.repeat) {
      responseIndex = (responseIndex + 1) % request.responses.length;
      repeatIndex = 0;
    }

    repeatIndex++;

    // cache the latest index for the next request
    indexes[0] = responseIndex;
    indexes[1] = repeatIndex;
    result.cache[cacheKey] = indexes;

    // return the appropriate response object
    response = request.responses[responseIndex];

    if (response.file) {
      this.file(req, res, response, route.dataPath);
      return;
    }

    this.url(req, res, response);

  }
};

module.exports = result;
