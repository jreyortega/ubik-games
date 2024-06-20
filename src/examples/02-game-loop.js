import Ubik from '../engine/Ubik.js';

const ubik = new Ubik();

ubik.update = (dt) => {
  ubik.logger.info('Ubik\s loop works!');
  ubik.logger.info('Last dt = ' + dt);
};

ubik.start();
