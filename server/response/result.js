'use strict';

const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const chalk = require('chalk');

const config = require('../config');
const Logger = require('../logger');

const result = {

  cache: {},

  sendFile(req, res, status, response, filePath) {

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

  },

  parseJSON(contents) {
    let replacedContents;
    try {
      replacedContents = JSON.parse(contents);
    } catch (err) {
      replacedContents = contents;
    }

    return replacedContents;
  },

  sendJson(req, res, status, response, filePath) {

    try {

      const contents = fs.readFileSync(filePath, 'utf8');
      const regex = /\${context}/g;
      const replacedContents = contents.replace(regex, config.options.pluginContext);
      const json = this.parseJSON(replacedContents);

      Logger.info(`FILE ${filePath} ${chalk.dim(status)}`);

      res.status(status).json(json);

      config.events.emit(config.constants.EVENTS.RESPONSE, {
        req,
        res: response,
        file: filePath
      });

    } catch (err) {

      Logger.error(`NOT FOUND ${filePath} `);

      config.events.emit(config.constants.EVENTS.FILE_NOT_FOUND, {
        req
      });

      res.sendStatus(404);

    }

  },

  file(req, res, response, dataPath) {

    Promise.delay(response.latency || 200).then(() => {

      const filePath = path.join(dataPath, response.file);
      const status = response.status || 200;

      if (response.headers) {
        res.set(response.headers);
      }

      if (path.extname(filePath) === '.json') {
        this.sendJson(req, res, status, response, filePath);
      } else {
        this.sendFile(req, res, status, response, filePath);
      }

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
