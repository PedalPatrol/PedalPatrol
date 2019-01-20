import { ConnectComponent } from '../util/connect-component';

import BikePresenter from './presenters/bike-presenter';
import BikeModel from './models/bike-model';

import { connect } from 'react-mvp'
// import HomePresenter from './presenters/home-presenter';
// import MapPresenter from './presenters/map-presenter';

// export const BikeVP = connect(BikeModel, BikePresenter, BikeView);

export const BikeM = new BikeModel();
export const BikeP = new BikePresenter();