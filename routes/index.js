const express = require('express');
const router = express.Router();
const debug = require('debug')('wind-ctrl:main');
const config = require('../config');
const resources = config.resources;

const mpv = require('../shared/mpv');
const mpm = require('../shared/mpm');
const mpd = require('../shared/mpd')(mpv);

var mpv_mpm = null;

router.get('/', function(req, res, next) {
  res.json({"success": true});
});

router.get('/resources', function(req, res, next) {
  res.json({
    "success": true,
    "resources": resources
  });
});

router.post('/player/load/:id', function(req, res, next) {
  if (mpv_mpm) mpv_mpm.release();
  const resource = resources[req.params.id];
  mpv.loadFile(resource.path);
  mpv_mpm = mpm(mpv, { repeat: resource.repeat });
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

router.get('/player/observe', function(req, res, next) {
  res.json({ "success": true });
});


module.exports = router;
