/* eslint-disable jsx-quotes, react/prop-types, max-len, no-underscore-dangle */

import React from 'react';

const images = {
  bk: 'http://us.123rf.com/450wm/asmati/asmati1605/asmati160501240/56829894-king-crown-sign-red-vector-icon-on-black-flat-circle.jpg?ver=6',
  bb: 'http://vignette4.wikia.nocookie.net/agk/images/1/16/Black_Circle.png/revision/latest/scale-to-width-down/480?cb=20151220003202',
  wk: 'http://cdn.shopify.com/s/files/1/1099/2848/products/Screen_Shot_2016-01-11_at_11.21.32_AM_1024x1024.png?v=1452542780',
  wb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Disc_Plain_red.svg/2000px-Disc_Plain_red.svg.png',
};

export default (props) => {
  let image;
  let imgClass;
  let cls = (props.x + props.y) % 2 ? 'invalidLocation' : 'taken';
  if (props.x.toString() === props.selectedX.toString() && props.y.toString() === props.selectedY.toString()) { cls = 'selected'; }
  const onClick = (props.x + props.y) % 2 ? null : props.target;
  let tag;
  let urlKey = ''
  if (props.piece === '') {
    tag = undefined;
    imgClass = 'pieceHide';
  } else {
    urlKey += props.piece.color === 'black' ? 'b' : 'w';
    urlKey += props.piece.status === 'king' ? 'k' : 'b';
    imgClass = 'piece';
    image = images[urlKey];
  }
  tag = <img src={image} role="presentation" className={imgClass} />;
  return <div key={`${props.x}${props.y}`} className={cls} onClick={onClick} data-x={props.x} data-y={props.y} > {tag} </div>;
};
