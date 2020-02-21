import _ from 'lodash';
import Icon from './icon.svg';
import Data from './data.xml';
import printMe from './print.js';
import './style.css';

function component(){
    const element = document.createElement('div');
    const btn = document.createElement('button');
    element.innerHTML = _.join(['Hello','webpack'],' ');
    element.classList.add('hello');
    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;
    // Add the image to our existing div.
   const myIcon = new Image();
   myIcon.src = Icon;
   element.appendChild(btn);
   element.appendChild(myIcon);
   console.log(Data);
    return element;
}
document.body.appendChild(component());