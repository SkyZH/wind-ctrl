const express = require('express');
const router = express.Router();
const debug = require('debug')('wind-ctrl:main');
const process = require('process');
const _ = require('lodash');

const config = require('../config');
const resources = config.resources;

const mpv = require('../shared/mpv');

router.get('/', function(req, res, next) {
  res.json({"success": true});
});

router.get('/resources', function(req, res, next) {
  res.json({
    "success": true,
    "resources": _.map(resources, (resource, index) => _.merge(resource, { 'id': index }))
  });
});

router.post('/player/load/:id', function(req, res, next) {
  const resource = resources[req.params.id];
  mpv.loadFile(resource);
  res.json({ "success": true });
});

router.post('/player/play', function(req, res, next) {
  mpv.play();
  res.json({ "success": true });
});

router.post('/player/pause', function(req, res, next) {
  mpv.pause();
  res.json({ "success": true });
});

router.post('/player/volume/:volume', function(req, res, next) {
  mpv.volume(req.params.volume);
  res.json({ "success": true });
});

router.post('/player/jump/:seconds', function(req, res, next) {
  mpv.jump(req.params.seconds);
  res.json({ "success": true });
});

router.post('/app/exit', function(req, res, next) {
  setInterval(() => {
    mpv.mpv._mpv.kill('SIGKILL');
  }, 3000);
  res.json({ "success": true });
});

router.get('/player/observe', function(req, res, next) {
  res.json({ "success": true });
});


module.exports = router;
