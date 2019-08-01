import React from 'react';
import l from './Single.less';

import BannerAnim, { Element } from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
const rdom = require('react-dom'); 
const BgElement = Element.BgElement;


let is_running = true;
class Demo extends React.Component {


  scrollFunc = (e) => {
    const ele = rdom.findDOMNode(this);
    if (e.nativeEvent.deltaY <= 0) {
      if(ele.scrollTop <= 0 && is_running) {
        e.preventDefault();
        console.log('scrolling up---向下滑动')
        this.handle('up')
      }
    } else{
      if(ele.scrollTop + ele.clientHeight >= ele.scrollHeight && is_running) {
        e.preventDefault();
        console.log('scrolling down---向上滑动')
        this.handle('down')
      }
    }
  }
  handle = (type) => {
    console.log('is_running', is_running)
    if (type === 'up' && is_running) {
      console.log('向下')
      is_running = false;
      setTimeout(this.banner.prev, 500)
    }else if (type === 'down' && is_running) {
      console.log('向上')
      is_running = false;
      setTimeout(this.banner.next, 500)
    }
  }
  changeBanner = (key) => {
    if (key === 'after') {
      is_running = true
      setTimeout(function () {
        console.log('结束了')
        is_running = true;
      }, 1500)
    }
  }
  render() {
    return (
      <BannerAnim 
        dragPlay={false}
        onWheel={this.scrollFunc} 
        prefixCls="banner-user" 
        ref={(c) => { this.banner = c; }}
        type="verticalOverlay"
        onChange={this.changeBanner}
      >
        
        <Element prefixCls="banner-user-elem" key="0">
          <BgElement
            key="bg"
            className="bg"
            style={{ background: '#364D79' }}
          />
          <TweenOne className="banner-user-title" 
            animation={{ 
              // y: -30,
              scale: .5, 
              top: -50,
              opacity: 0, 
              type: 'from' ,
              duration: 1000,
              repeat: -1,
              repeatDelay: 2000
            }}
          >
            PRODUCT
          </TweenOne>
          <TweenOne className="banner-user-title" 
            animation={{ 
              y: 20, 
              opacity: 0.5, 
              type: 'from', 
              delay: 400 
            }}
          >
            ------ 产品 ------
          </TweenOne>
          <QueueAnim 
            className={l.box} 
            key="box" 
            duration="500"  
            interval="400"
            animConfig={[
              { opacity: [1, 0], translateY: [0, 50] },
              // { opacity: [1, 0], translateY: [0, -50] }
            ]}
          >
            {
              ['','','','','','','',''].map( (item,index) => {
                return <div className={l.cell} key={`box${index}`}>{index + 1}</div>
              })
            }
          </QueueAnim>
        </Element>


        <Element prefixCls="banner-user-elem" key="1">
          <BgElement
            key="bg"
            className="bg"
            style={{ background: '#64CBCC'}}
          />
          <TweenOne className="banner-user-title"
            animation={{ 
              // y: -30,
              scale: .5, 
              top: -50,
              opacity: 0, 
              type: 'from' ,
              duration: 1000,
              // repeat: -1,
              repeatDelay: 2000
            }}
          >
            Ant Motion Banner
          </TweenOne>
          <TweenOne
            className="banner-user-text"
            animation={{ 
              y: 20, 
              opacity: 0.5, 
              type: 'from', 
              delay: 400 
            }}
          >
            The Fast Way Use Animation In React 111111
          </TweenOne>
          <QueueAnim 
            className={l.box1} 
            key="box" 
            duration="1500"  
            interval="200"
            animConfig={[
              { opacity: [1, 0], scale: [1, 0] },
              // { opacity: [1, 0], translateY: [0, -50] }
            ]}
          >
            {
              ['','','','','','','','', ''].map( (item,index) => {
                return <div className={l.cell1} key={`box${index}`}>{index + 1}</div>
              })
            }
          </QueueAnim>
        </Element>

      </BannerAnim>
    );
  }
}
export default Demo;
