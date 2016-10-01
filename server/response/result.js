'use strict';

const path = require('path');
const BPromise = require('bluebird');
const chalk = require('chalk');

const config = require('../config');
const Logger = require('../logger');

const result = {

  cache: {},

  file(req, res, response, dataPath) {

    BPromise.delay(response.latency || 200).then(() => {

      const filePath = path.join(dataPath, response.file);
      const status = response.status || 200;

      if (response.headers) {
        res.set(response.headers);
      }

      res.status(status).sendFile(filePath, (err) => {

        if (err) {

          Logger.error(`NOT FOUND ${filePath} `);

          config.events.emit(config.constants.EVENTS.FILE_NOT_FOUND, {
            req
          });

          res.sendStatus(404);
        } else {

          const file = chalk.blue(filePath);
          Logger.info(`FILE ${file} ${chalk.dim(status)}`);

          config.events.emit(config.constants.EVENTS.RESPONSE, {
            req,
            res: response,
            file: filePath
          });

        }
      });
    });
  },

  url(req, res, response) {
    config.events.emit(config.constants.EVENTS.REDIRECT, {
      req,
      res: response
    });

    res.redirect(response.url);
  },

  send(req, res) {
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
