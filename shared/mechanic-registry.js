export const mechanicFamilies={
 signal:'slider',
 timing:'timing',aim:'timing',race:'timing',chase:'timing',gesture:'timing',fold:'timing',wipe:'timing',drive:'timing',
 compose:'compose',choice:'choice',find:'find',search:'find',dial:'dial',tv:'dial',phone:'phone',billing:'billing',chat:'chat',
 repair:'repair',cassette:'repair',vhs:'repair',disk:'repair',arcade:'arcade',builder:'builder',shop:'shop',trade:'shop',collection:'shop',
 camera:'camera',studio:'camera',album:'camera',print:'camera',
 schedule:'schedule',vignette:'sequence',sequence:'sequence',browse:'browse',boot:'boot',dialup:'dialup',event:'event',random:'random',
 ledger:'ledger',strategy:'strategy',pet:'pet',secret:'secret',ambient:'ambient',audio:'ambient',inspect:'inspect'
};

export const supportedMechanics=new Set(Object.keys(mechanicFamilies));
export const mechanicFamilyFor=mechanic=>mechanicFamilies[mechanic]||null;
